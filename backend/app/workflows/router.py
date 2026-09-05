"""
Workflow router — dispatches incoming ChatRequests to the correct pipeline.

• syllabus_rag / campus_faq → LangGraph RAG graph (Groq)
• timetable               → LangGraph Timetable graph (Groq)
• unknown                 → error response
"""

import uuid
import time

from app.schemas.chat import ChatRequest, ChatResponse, ChatMetadata, SourceItem
from app.rag.llm import generate_rag_response
from app.rag.grounding import check_evidence_sufficiency, map_citations
from app.workflows.timetable import check_timetable_conflict
from app.workflows.faq import execute_campus_faq


async def route_workflow(request: ChatRequest) -> ChatResponse:
    # Generate a conversation ID if not provided
    conv_id = request.conversation_id or str(uuid.uuid4())
    
    if request.workflow == "syllabus_rag":
        return await execute_syllabus_rag(request, conv_id)
    elif request.workflow == "campus_faq":
        return await execute_campus_faq(request, conv_id)
    elif request.workflow == "timetable":
        # Hardcoding a dummy user_id for the hackathon version
        return await check_timetable_conflict(request.message, "user_123", conv_id)
    else:
        # Fallback for unknown workflow
        return ChatResponse(
            conversation_id=conv_id,
            workflow=request.workflow,
            answer="Unsupported workflow.",
            grounded=False,
            confidence="low",
            sources=[],
            metadata=ChatMetadata(retrieval_count=0, latency_ms=0)
        )


async def execute_syllabus_rag(request: ChatRequest, conv_id: str) -> ChatResponse:
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
        llm_answer = await generate_rag_response(request.message, context)
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
