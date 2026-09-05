from fastapi import APIRouter
from app.api.endpoints import chat, voice, documents

api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(voice.router, prefix="/voice", tags=["voice"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
