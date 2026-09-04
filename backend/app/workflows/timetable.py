from typing import List, Dict, Any
from app.schemas.chat import ChatResponse, ChatMetadata

async def check_timetable_conflict(query: str, user_id: str, conv_id: str) -> ChatResponse:
    """
    Deterministic overlap algorithm for checking timetable conflicts.
    Does NOT use vector search.
    """
    # Stub: Normalize -> Sort -> Overlap Algorithm -> Conflict (T/F)
    # In production, this would fetch structured JSON data for the user_id.
    
    # Mocking conflict logic
    has_conflict = False
    mock_answer = "No schedule conflicts detected for your query."
    
    if "monday" in query.lower() and "morning" in query.lower():
        has_conflict = True
        mock_answer = "Conflict detected: You have CS101 and MA102 scheduled at 10:00 AM on Monday."

    return ChatResponse(
        conversation_id=conv_id,
        workflow="timetable",
        answer=mock_answer,
        grounded=True,
        confidence="high",
        sources=[],
        metadata=ChatMetadata(retrieval_count=0, latency_ms=5)
    )
