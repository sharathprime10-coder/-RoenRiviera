from pydantic import BaseModel, Field
from typing import List, Optional, Literal
import re

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="The user's query.")
    workflow: Literal["syllabus_rag", "campus_faq", "timetable", "chitchat", "auto"]
    conversation_id: Optional[str] = Field(None, max_length=36)
    sassy: bool = False

class SourceItem(BaseModel):
    document_id: str
    document_name: str
    page: Optional[int] = None
    section: Optional[str] = None
    snippet: str
    source_type: Literal["official", "uploaded", "system"]

class ChatMetadata(BaseModel):
    retrieval_count: Optional[int] = None
    latency_ms: Optional[int] = None

class ChatResponse(BaseModel):
    conversation_id: str
    workflow: str
    answer: str
    grounded: bool
    confidence: Literal["high", "medium", "low"]
    sources: List[SourceItem] = []
    metadata: Optional[ChatMetadata] = None
