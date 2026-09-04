from app.schemas.chat import ChatRequest, ChatResponse, ChatMetadata
from app.rag.llm import generate_rag_response
from app.rag.grounding import check_evidence_sufficiency, map_citations

async def execute_campus_faq(request: ChatRequest, conv_id: str) -> ChatResponse:
    # 1. Retrieve evidence (Mocked for now)
    # FAQ usually has rich metadata filtering (e.g., source_type="official")
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
            metadata=ChatMetadata(retrieval_count=0, latency_ms=5)
        )
        
    context = "\n".join([chunk["content"] for chunk in mock_retrieved_chunks])
    llm_answer = await generate_rag_response(request.message, context)
    is_grounded, sources = map_citations(llm_answer, mock_retrieved_chunks)

    return ChatResponse(
        conversation_id=conv_id,
        workflow="campus_faq",
        answer=llm_answer,
        grounded=is_grounded,
        confidence="high",
        sources=sources,
        metadata=ChatMetadata(retrieval_count=len(mock_retrieved_chunks), latency_ms=100)
    )
