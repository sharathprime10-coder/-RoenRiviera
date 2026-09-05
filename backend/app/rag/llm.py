"""
Dual-LLM routing pipeline.

• Simple queries (greetings, chitchat, general knowledge) → Gemini (fast)
• Complex queries (syllabus RAG, timetable, summarisation) → Groq via LangGraph

The classify_query() function is a lightweight, rule-based router so it
adds effectively zero latency.  It can be upgraded to an LLM-based
classifier later without changing the rest of the pipeline.
"""

import re
import httpx
from app.core.config import settings
from google import genai
from google.genai import types
from app.core.personality import get_system_prompt_suffix


# ──────────────────────────────────────────────────────────────────────
# Query classification (router)
# ──────────────────────────────────────────────────────────────────────

# Keywords / patterns that indicate a *complex* query requiring RAG or
# structured campus data.  Kept as compiled regexes for speed.
_COMPLEX_PATTERNS = re.compile(
    r"\b("
    r"syllabus|curriculum|course|module|subject|semester|exam|midterm|final"
    r"|timetable|schedule|conflict|class(?:es)?|lecture|lab|tutorial"
    r"|library|campus|facility|hostel|canteen|office|hours|contact"
    r"|summarize|summary|explain|describe|detail|overview"
    r"|attendance|grade|gpa|cgpa|marks|result"
    r"|fee|payment|scholarship|deadline"
    r"|professor|faculty|hod|dean|department"
    r"|placement|internship|company|recruitment"
    r"|club|event|fest|hackathon|workshop|seminar"
    r")\b",
    re.IGNORECASE,
)

# Greetings / chitchat patterns that should stay on the fast Gemini path
_SIMPLE_PATTERNS = re.compile(
    r"^(hi|hello|hey|good\s+(morning|afternoon|evening)|thanks|thank\s*you"
    r"|bye|goodbye|how\s+are\s+you|what'?s?\s+up|yo|sup|hola)\b",
    re.IGNORECASE,
)


def classify_query(query: str) -> str:
    """
    Classify a user query as 'simple' or 'complex'.

    Returns
    -------
    str
        ``"simple"`` → fast Gemini pipeline
        ``"complex"`` → Groq / LangGraph pipeline
    """
    stripped = query.strip()

    # Very short greetings / chitchat → always simple
    if _SIMPLE_PATTERNS.search(stripped):
        return "simple"

    # Contains campus / academic keywords → complex
    if _COMPLEX_PATTERNS.search(stripped):
        return "complex"

    # Fallback: short queries (≤ 8 words) without keywords → simple
    if len(stripped.split()) <= 8:
        return "simple"

    # Longer free-text → treat as complex (might need RAG)
    return "complex"


# ──────────────────────────────────────────────────────────────────────
# LLM provider classes (unchanged from original, kept for fallback)
# ──────────────────────────────────────────────────────────────────────

class LLMProvider:
    async def generate_response(self, prompt: str, context: str, sassy: bool = False) -> str:
        raise NotImplementedError


class GeminiProvider(LLMProvider):
    def __init__(self):
        # We assume the key will be injected via settings
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = settings.GEMINI_MODEL

    async def generate_response(self, prompt: str, context: str, sassy: bool = False) -> str:
        if not settings.GEMINI_API_KEY:
            return "Gemini API key not configured."
        
        system_suffix = get_system_prompt_suffix(sassy)
        full_prompt = f"Context:\n{context}\n\nUser Query:\n{prompt}"
        if system_suffix:
            full_prompt = f"System Instruction: You are a helpful assistant.{system_suffix}\n\n{full_prompt}"
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=full_prompt,
            config=types.GenerateContentConfig(
                temperature=0.0
            )
        )
        return response.text


class GroqProvider(LLMProvider):
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model_name = settings.GROQ_MODEL
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    async def generate_response(self, prompt: str, context: str, sassy: bool = False) -> str:
        if not self.api_key:
            return "Groq API key not configured."
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": f"You are a helpful assistant answering based on this context: {context}" + get_system_prompt_suffix(sassy)},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.0
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(self.url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]


# ──────────────────────────────────────────────────────────────────────
# Simple-path Gemini response (fast, low-latency)
# ──────────────────────────────────────────────────────────────────────

async def _simple_gemini_response(prompt: str, context: str, sassy: bool = False) -> str:
    """Handle simple / conversational queries via Gemini."""
    provider = GeminiProvider()
    return await provider.generate_response(prompt, context, sassy)


# ──────────────────────────────────────────────────────────────────────
# Complex-path LangGraph / Groq response
# ──────────────────────────────────────────────────────────────────────

async def _complex_groq_response(prompt: str, context: str, sassy: bool = False) -> str:
    """
    Invoke the RAG LangGraph for complex queries.
    Falls back to raw GroqProvider if the graph raises.
    """
    try:
        from app.rag.graph import rag_graph

        initial_state = {
            "query": prompt,
            "context_chunks": [],
            "context_text": context,
            "answer": "",
            "grounded": False,
            "latency_ms": 0,
            "sassy": sassy,
        }

        result = rag_graph.invoke(initial_state)
        return result["answer"]

    except Exception as graph_err:
        print(f"[ROUTER] LangGraph RAG failed ({graph_err}), falling back to raw Groq")
        provider = GroqProvider()
        return await provider.generate_response(prompt, context, sassy)


# ──────────────────────────────────────────────────────────────────────
# Public API — drop-in replacement for the old generate_rag_response
# ──────────────────────────────────────────────────────────────────────

async def generate_rag_response(prompt: str, context: str, sassy: bool = False) -> str:
    """
    Primary LLM pipeline with intelligent routing + fallback support.

    1. Classify the query as *simple* or *complex*.
    2. Simple  → fast Gemini response.
       Complex → LangGraph / Groq pipeline.
    3. If the chosen path fails and fallback is enabled, try the other.
    """
    classification = classify_query(prompt)
    print(f"[ROUTER] Query classified as '{classification}': {prompt[:80]}...")

    try:
        if classification == "simple":
            return await _simple_gemini_response(prompt, context, sassy)
        else:
            return await _complex_groq_response(prompt, context, sassy)

    except Exception as primary_err:
        if settings.LLM_FALLBACK_ENABLED:
            print(f"[ROUTER] Primary path failed: {primary_err}. Falling back...")
            try:
                if classification == "simple":
                    # Gemini failed → try Groq
                    return await _complex_groq_response(prompt, context, sassy)
                else:
                    # Groq failed → try Gemini
                    return await _simple_gemini_response(prompt, context, sassy)
            except Exception as fallback_err:
                print(f"[ROUTER] Fallback also failed: {fallback_err}")
                return "Service temporarily unavailable due to upstream LLM errors."

        return "Service temporarily unavailable."
