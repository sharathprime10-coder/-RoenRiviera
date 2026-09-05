"""
Workflow router — dispatches incoming ChatRequests to the correct pipeline.

• syllabus_rag / campus_faq → LangGraph RAG graph (Groq)
• timetable               → LangGraph Timetable graph (Groq)
• unknown                 → error response
"""

import uuid
import time
import asyncio

from typing import AsyncGenerator
import json
from app.schemas.chat import ChatRequest, ChatResponse, ChatMetadata, SourceItem
from app.rag.llm import generate_rag_response, classify_query
from app.rag.grounding import check_evidence_sufficiency, map_citations
from app.workflows.timetable import check_timetable_conflict
from app.workflows.faq import execute_campus_faq
from app.api.endpoints.voice import _voice_simple_response
from app.core.memory import save_message, get_user_memory, get_recent_messages, extract_and_update_memory


async def route_workflow_stream(request: ChatRequest) -> AsyncGenerator[str, None]:
    conv_id = request.conversation_id or str(uuid.uuid4())
    user_id = "user_123"
    
    save_message(user_id, conv_id, "user", request.message)
    
    user_memory = get_user_memory(user_id)
    memory_context = ""
    if user_memory.get("preferences") or user_memory.get("semantic_facts"):
        memory_context = f"User Memory Context: Preferences: {user_memory.get('preferences', {})}. Facts: {user_memory.get('semantic_facts', {})}."
        
    try:
        from app.rag.graph import rag_graph
        initial_state = {
            "query": request.message,
            "context_chunks": [],
            "context_text": "",
            "answer": "",
            "grounded": False,
            "latency_ms": 0,
            "memory_context": memory_context,
            "sassy": request.sassy,
        }
        
        full_answer = ""
        # stream events from LangGraph
        async for event in rag_graph.astream_events(initial_state, version="v1"):
            if event["event"] == "on_chat_model_stream":
                chunk = event["data"]["chunk"].content
                if chunk:
                    full_answer += chunk
                    yield f"data: {json.dumps({'content': chunk})}\n\n"
                    
        # Once stream finishes, yield a final event with sources if needed
        # and save the final message to DB.
        save_message(user_id, conv_id, "assistant", full_answer)
        
        recent_msgs = get_recent_messages(user_id, conv_id, limit=20)
        if len(recent_msgs) % 5 == 0:
            asyncio.create_task(extract_and_update_memory(user_id, conv_id))
            
    except Exception as e:
        print(f"[STREAM] Error: {e}")
        yield f"data: {json.dumps({'content': ' Error generating response.'})}\n\n"


async def route_workflow(request: ChatRequest) -> ChatResponse:
    # Generate a conversation ID if not provided
    conv_id = request.conversation_id or str(uuid.uuid4())
    user_id = "user_123" # TODO: extract real user_id from JWT payload
    
    # Save user message
    save_message(user_id, conv_id, "user", request.message)
    
    # Fetch long-term memory to inject context
    user_memory = get_user_memory(user_id)
    memory_context = ""
    if user_memory.get("preferences") or user_memory.get("semantic_facts"):
        memory_context = f"User Memory Context: Preferences: {user_memory.get('preferences', {})}. Facts: {user_memory.get('semantic_facts', {})}."
    
    workflow = request.workflow
    if workflow == "auto":
        classification = classify_query(request.message)
        print(f"[ROUTER] Auto-classified '{request.message[:30]}...' as: {classification}")
        if classification == "simple":
            workflow = "chitchat"
        else:
            workflow = "syllabus_rag" # Default complex workflow for now

    if workflow == "syllabus_rag":
        response = await execute_syllabus_rag(request, conv_id, memory_context)
    elif workflow == "campus_faq":
        response = await execute_campus_faq(request, conv_id)
    elif workflow == "timetable":
        # TODO: extract real user_id from JWT payload
        response = await check_timetable_conflict(request.message, "user_123", conv_id, request.sassy)
    elif workflow == "chitchat" or workflow == "simple_chat":
        response = await execute_simple_chat(request, conv_id)
    else:
        # Fallback for unknown workflow
        response = ChatResponse(
            conversation_id=conv_id,
            workflow=request.workflow,
            answer="Unsupported workflow.",
            grounded=False,
            confidence="low",
            sources=[],
            metadata=ChatMetadata(retrieval_count=0, latency_ms=0)
        )
        
    # Save assistant response
    save_message(user_id, conv_id, "assistant", response.answer)
    
    # Run automatic memory extraction every 5 messages asynchronously
    recent_msgs = get_recent_messages(user_id, conv_id, limit=20)
    if len(recent_msgs) % 5 == 0:
        asyncio.create_task(extract_and_update_memory(user_id, conv_id))
        
    return response

async def execute_simple_chat(request: ChatRequest, conv_id: str) -> ChatResponse:
    start = time.time()
    try:
        # Reuse the dedicated simple LLM from voice (OpenRouter)
        answer = await _voice_simple_response(request.message, request.sassy)
        elapsed = int((time.time() - start) * 1000)
        return ChatResponse(
            conversation_id=conv_id,
            workflow="simple_chat",
            answer=answer,
            grounded=False,
            confidence="high",
            sources=[],
            metadata=ChatMetadata(retrieval_count=0, latency_ms=elapsed)
        )
    except Exception as e:
        print(f"[WORKFLOW] Simple chat failed: {e}")
        return ChatResponse(
            conversation_id=conv_id,
            workflow="simple_chat",
            answer="I'm having trouble connecting right now.",
            grounded=False,
            confidence="low",
            sources=[],
            metadata=ChatMetadata(retrieval_count=0, latency_ms=0)
        )


async def execute_syllabus_rag(request: ChatRequest, conv_id: str, memory_context: str = "") -> ChatResponse:
    """
    Execute the Syllabus RAG workflow via LangGraph / Groq.
    Falls back gracefully if the graph is unavailable.
    """
    start = time.time()

    try:
        from app.rag.graph import rag_graph

        initial_state = {
            "query": request.message,
            "context_chunks": [],
            "context_text": "",
            "answer": "",
            "grounded": False,
            "latency_ms": 0,
            "memory_context": memory_context,
            "sassy": request.sassy,
        }

        print(f"[WORKFLOW] Syllabus RAG -> LangGraph/Groq for: {request.message[:60]}...")
        result = rag_graph.invoke(initial_state)
        elapsed = int((time.time() - start) * 1000)

        # Build source items from the graph's retrieved chunks
        sources = []
        for chunk in result.get("context_chunks", []):
            sources.append(SourceItem(
                document_id=chunk.get("document_id", "unknown"),
                document_name=chunk.get("document_name", "Unknown Document"),
                page=chunk.get("page", None),
                section=chunk.get("section", None),
                snippet=chunk.get("content", "")[:100] + "...",
                source_type="official",
            ))

        return ChatResponse(
            conversation_id=conv_id,
            workflow="syllabus_rag",
            answer=result["answer"],
            grounded=result.get("grounded", True),
            confidence="high",
            sources=sources,
            metadata=ChatMetadata(
                retrieval_count=len(result.get("context_chunks", [])),
                latency_ms=elapsed,
            ),
        )

    except Exception as e:
        print(f"[WORKFLOW] LangGraph failed for syllabus_rag: {e}. Falling back to direct LLM.")

        # ── Graceful fallback to the old generate_rag_response path ──
        mock_retrieved_chunks = [
            {"document_id": "doc123", "document_name": "CS101 Syllabus", "content": "The midterm is on October 15th."}
        ]

        if not check_evidence_sufficiency(request.message, mock_retrieved_chunks):
            return ChatResponse(
                conversation_id=conv_id,
                workflow="syllabus_rag",
                answer="I don't have enough information in the provided documents to answer that question.",
                grounded=False,
                confidence="low",
                sources=[],
                metadata=ChatMetadata(retrieval_count=0, latency_ms=10),
            )

        context = "\n".join([chunk["content"] for chunk in mock_retrieved_chunks])
        llm_answer = await generate_rag_response(request.message, context, request.sassy)
        is_grounded, sources = map_citations(llm_answer, mock_retrieved_chunks)
        elapsed = int((time.time() - start) * 1000)

        return ChatResponse(
            conversation_id=conv_id,
            workflow="syllabus_rag",
            answer=llm_answer,
            grounded=is_grounded,
            confidence="high",
            sources=sources,
            metadata=ChatMetadata(retrieval_count=len(mock_retrieved_chunks), latency_ms=elapsed),
        )
