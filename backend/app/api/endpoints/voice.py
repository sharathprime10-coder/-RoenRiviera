"""
Voice API endpoints.

• /speak  — Text-to-speech via edge-tts
• /process — Voice query processing with dual-LLM routing:
    - Simple conversational queries → fast OpenRouter (dedicated voice key)
    - Complex campus queries → Groq via LangGraph
"""

import os
import httpx
import edge_tts
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator

from app.core.config import settings
from app.rag.llm import classify_query
from app.api.deps import verify_token
from app.core.rate_limit import check_user_rate_limit

router = APIRouter()


class VoiceRequest(BaseModel):
    text: str
    voice_id: str = "en-US-AriaNeural"  # Default voice


# ──────────────────────────────────────────────────────────────────────
# TTS streaming
# ──────────────────────────────────────────────────────────────────────

async def generate_audio_stream(text: str, voice_id: str) -> AsyncGenerator[bytes, None]:
    communicate = edge_tts.Communicate(text, voice_id)
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            yield chunk["data"]


# ──────────────────────────────────────────────────────────────────────
# Dedicated Voice LLM — uses its own OpenRouter API key
# ──────────────────────────────────────────────────────────────────────

async def _voice_simple_response(text: str) -> str:
    """
    Handle simple / conversational voice queries via the dedicated
    OpenRouter key — completely isolated from the text-chat pipeline.
    """
    api_key = settings.OPENROUTER_API_KEY
    if not api_key:
        raise ValueError("No OpenRouter API key configured for voice.")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": settings.VOICE_OPENROUTER_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are River, a helpful, friendly AI campus assistant. "
                    "Keep your responses concise (1-3 sentences), "
                    "conversational, and suitable for text-to-speech."
                ),
            },
            {"role": "user", "content": text},
        ],
        "temperature": 0.7,
        "max_tokens": 200,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def _voice_complex_response(text: str) -> str:
    """
    Handle complex voice queries (campus data, RAG) via Groq / LangGraph.
    """
    try:
        from app.rag.graph import rag_graph

        initial_state = {
            "query": text,
            "context_chunks": [],
            "context_text": "",
            "answer": "",
            "grounded": False,
            "latency_ms": 0,
        }

        result = rag_graph.invoke(initial_state)
        return result["answer"]

    except Exception as e:
        print(f"[VOICE] LangGraph failed: {e}. Falling back to OpenRouter.")
        return await _voice_simple_response(text)


# ──────────────────────────────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────────────────────────────

@router.post("/speak")
async def generate_speech(
    request: VoiceRequest,
    current_user: dict = Depends(verify_token),
    rate_limit: dict = Depends(check_user_rate_limit)
):
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text is required")
            
        return StreamingResponse(
            generate_audio_stream(request.text, request.voice_id), 
            media_type="audio/mpeg"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/process")
async def process_voice_query(
    request: VoiceRequest,
    current_user: dict = Depends(verify_token),
    rate_limit: dict = Depends(check_user_rate_limit)
):
    """
    Process a voice query with intelligent routing:
    - Simple queries → dedicated OpenRouter key (fast, low latency)
    - Complex campus queries → Groq / LangGraph (rich, grounded)
    """
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text is required")

        # Classify and route
        classification = classify_query(request.text)
        print(f"[VOICE] Query classified as '{classification}': {request.text[:80]}...")

        if classification == "simple":
            llm_answer = await _voice_simple_response(request.text)
        else:
            llm_answer = await _voice_complex_response(request.text)

        # Stream audio back
        return StreamingResponse(
            generate_audio_stream(llm_answer, request.voice_id),
            media_type="audio/mpeg",
        )

    except Exception as e:
        print(f"[VOICE] Error processing voice query: {e}")
        raise HTTPException(status_code=500, detail=str(e))
