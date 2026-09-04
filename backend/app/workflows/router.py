from app.schemas.chat import ChatRequest, ChatResponse, ChatMetadata
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
    # Stub for Phase 2 implementation
    return ChatResponse(
        conversation_id=conv_id,
        workflow="syllabus_rag",
        answer="This is a mock answer from the Syllabus RAG workflow. Backend integration is in progress.",
        grounded=True,
        confidence="high",
        sources=[],
        metadata=ChatMetadata(retrieval_count=0, latency_ms=10)
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
