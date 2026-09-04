from app.schemas.chat import ChatRequest, ChatResponse, ChatMetadata, SourceItem
from app.rag.llm import generate_rag_response
from app.rag.grounding import check_evidence_sufficiency, map_citations
import uuid

async def route_workflow(request: ChatRequest) -> ChatResponse:
    # Generate a conversation ID if not provided
    conv_id = request.conversation_id or str(uuid.uuid4())
    
    # Mock responses for now based on the workflow
    if request.workflow == "syllabus_rag":
        return await execute_syllabus_rag(request, conv_id)
    elif request.workflow == "campus_faq":
        return await execute_campus_faq(request, conv_id)
    elif request.workflow == "timetable":
        return await execute_timetable(request, conv_id)
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
    # 1. Retrieve evidence (Mocked for now until Supabase is hooked up)
    mock_retrieved_chunks = [
        {"document_id": "doc123", "document_name": "CS101 Syllabus", "content": "The midterm is on October 15th."}
    ]
    
    # 2. Evidence Sufficiency Check
    if not check_evidence_sufficiency(request.message, mock_retrieved_chunks):
        return ChatResponse(
            conversation_id=conv_id,
            workflow="syllabus_rag",
            answer="I don't have enough information in the provided documents to answer that question.",
            grounded=False,
            confidence="low",
            sources=[],
            metadata=ChatMetadata(retrieval_count=0, latency_ms=10)
        )
        
    # 3. LLM Abstraction
    context = "\n".join([chunk["content"] for chunk in mock_retrieved_chunks])
    
    # In a real run, this requires API keys to be set. Since they aren't, it returns the error string.
    llm_answer = await generate_rag_response(request.message, context)
    
    # 4. Citation Integrity
    is_grounded, sources = map_citations(llm_answer, mock_retrieved_chunks)

    return ChatResponse(
        conversation_id=conv_id,
        workflow="syllabus_rag",
        answer=llm_answer,
        grounded=is_grounded,
        confidence="high",
        sources=sources,
        metadata=ChatMetadata(retrieval_count=len(mock_retrieved_chunks), latency_ms=150)
    )

async def execute_campus_faq(request: ChatRequest, conv_id: str) -> ChatResponse:
    return ChatResponse(
        conversation_id=conv_id,
        workflow="campus_faq",
        answer="This is a mock answer from the Campus FAQ workflow. Backend integration is in progress.",
        grounded=True,
        confidence="high",
        sources=[],
        metadata=ChatMetadata(retrieval_count=0, latency_ms=10)
    )

async def execute_timetable(request: ChatRequest, conv_id: str) -> ChatResponse:
    return ChatResponse(
        conversation_id=conv_id,
        workflow="timetable",
        answer="This is a mock answer from the Timetable workflow. Conflict check pending.",
        grounded=True,
        confidence="high",
        sources=[],
        metadata=ChatMetadata(retrieval_count=0, latency_ms=10)
    )
