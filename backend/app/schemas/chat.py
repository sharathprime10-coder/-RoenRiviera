from pydantic import BaseModel
from typing import List, Optional, Literal

class ChatRequest(BaseModel):
    message: str
    workflow: Literal["syllabus_rag", "campus_faq", "timetable"]
    conversation_id: Optional[str] = None

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
