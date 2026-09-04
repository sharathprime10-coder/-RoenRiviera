from fastapi import APIRouter, Depends
from app.schemas.chat import ChatRequest, ChatResponse
from app.workflows.router import route_workflow

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # TODO: Add auth dependency
    response = await route_workflow(request)
    return response
