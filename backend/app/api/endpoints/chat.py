from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
import json
from app.schemas.chat import ChatRequest, ChatResponse
from app.workflows.router import route_workflow, route_workflow_stream
from app.api.deps import verify_token
from app.core.memory import get_recent_messages
from app.core.guardrails import check_input_safety
from app.core.rate_limit import check_user_rate_limit

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest, 
    current_user: dict = Depends(verify_token),
    rate_limit: dict = Depends(check_user_rate_limit)
):
    is_safe, reason = check_input_safety(request.message)
    if not is_safe:
        return ChatResponse(
            conversation_id=request.conversation_id or "rejected",
            workflow=request.workflow,
            answer="I can't process that request.",
            grounded=False,
            confidence="low",
            sources=[]
        )

    response = await route_workflow(request)
    return response

@router.post("/stream")
async def chat_stream_endpoint(
    request: ChatRequest, 
    current_user: dict = Depends(verify_token),
    rate_limit: dict = Depends(check_user_rate_limit)
):
    is_safe, reason = check_input_safety(request.message)
    if not is_safe:
        async def mock_stream():
            msg = json.dumps({'content': 'I cannot process that request.'})
            yield f"data: {msg}\n\n"
        return StreamingResponse(mock_stream(), media_type="text/event-stream")

    return StreamingResponse(route_workflow_stream(request), media_type="text/event-stream")

@router.get("/history/{conversation_id}")
async def get_chat_history(conversation_id: str, current_user: dict = Depends(verify_token)):
    user_id = "user_123" # TODO: extract real user_id from JWT payload
    messages = get_recent_messages(user_id, conversation_id, limit=50)
    return {"messages": messages}
