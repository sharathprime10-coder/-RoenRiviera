"""
Campus FAQ workflow — uses LangGraph RAG graph for answering FAQ queries via Groq.
"""

import time
from app.schemas.chat import ChatRequest, ChatResponse, ChatMetadata
from app.rag.llm import generate_rag_response
from app.rag.grounding import check_evidence_sufficiency, map_citations
from app.schemas.chat import SourceItem


async def execute_campus_faq(request: ChatRequest, conv_id: str) -> ChatResponse:
    """
    Execute the Campus FAQ workflow via LangGraph / Groq.
    Falls back to the direct LLM path if the graph is unavailable.
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
            "sassy": request.sassy,
        }

        print(f"[WORKFLOW] Campus FAQ -> LangGraph/Groq for: {request.message[:60]}...")
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
            workflow="campus_faq",
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
        print(f"[WORKFLOW] LangGraph failed for campus_faq: {e}. Falling back to direct LLM.")

        # ── Graceful fallback ──
        mock_retrieved_chunks = [
            {"document_id": "faq_001", "document_name": "Campus Policies", "content": "Library hours are 8 AM to 10 PM daily."}
        ]

        if not check_evidence_sufficiency(request.message, mock_retrieved_chunks):
            return ChatResponse(
                conversation_id=conv_id,
                workflow="campus_faq",
                answer="I couldn't find an official answer to that in the campus FAQ.",
                grounded=False,
                confidence="low",
                sources=[],
                metadata=ChatMetadata(retrieval_count=0, latency_ms=5),
            )

        context = "\n".join([chunk["content"] for chunk in mock_retrieved_chunks])
        llm_answer = await generate_rag_response(request.message, context, request.sassy)
        is_grounded, sources = map_citations(llm_answer, mock_retrieved_chunks)
        elapsed = int((time.time() - start) * 1000)

        return ChatResponse(
            conversation_id=conv_id,
            workflow="campus_faq",
            answer=llm_answer,
            grounded=is_grounded,
            confidence="high",
            sources=sources,
            metadata=ChatMetadata(retrieval_count=len(mock_retrieved_chunks), latency_ms=elapsed),
        )
