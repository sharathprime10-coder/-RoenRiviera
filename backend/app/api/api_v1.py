from fastapi import APIRouter
from app.api.endpoints import chat, voice

api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(voice.router, prefix="/voice", tags=["voice"])
