"""
LangGraph-based workflow graphs for complex RAG and campus operations.

This module defines stateful, multi-step graphs that are invoked for
"complex" queries (syllabus RAG, campus FAQ, timetable reasoning).
All complex work is routed through Groq via LangChain for robust
state management and multi-step reasoning.
"""

import time
from typing import TypedDict, List, Dict, Any, Optional
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from app.core.config import settings


# ---------------------------------------------------------------------------
# State definitions
# ---------------------------------------------------------------------------

class RAGState(TypedDict):
    """State carried through the RAG graph."""
    query: str
    context_chunks: List[Dict[str, Any]]
    context_text: str
    answer: str
    grounded: bool
    latency_ms: int


class TimetableState(TypedDict):
    """State carried through the Timetable graph."""
    query: str
    user_id: str
    schedule_data: List[Dict[str, Any]]
    has_conflict: bool
    answer: str
    latency_ms: int


# ---------------------------------------------------------------------------
# Groq LLM singleton (reused across invocations)
# ---------------------------------------------------------------------------

def _get_groq_llm() -> ChatGroq:
    """Return a ChatGroq instance configured from settings."""
    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model_name=settings.GROQ_MODEL,
        temperature=0.0,
        max_retries=2,
    )


# ---------------------------------------------------------------------------
# RAG Graph – nodes
# ---------------------------------------------------------------------------

def retrieve_context(state: RAGState) -> dict:
    """
    Retrieve relevant document chunks for the user query.
    Currently returns mock data; in production this would call
    a vector store (Supabase pgvector, Pinecone, etc.).
    """
    start = time.time()

    query_lower = state["query"].lower()

    # -- Mock retrieval logic (replace with real vector search) --
    if any(kw in query_lower for kw in ["syllabus", "course", "curriculum", "subject", "module"]):
        chunks = [
            {
                "document_id": "doc_cs101",
                "document_name": "CS101 Syllabus",
                "content": "CS101 covers Data Structures, Algorithms, and OOP. The midterm exam is on October 15th. The final exam covers all modules including Graph Theory and Dynamic Programming.",
                "page": 1,
                "section": "Course Overview",
            },
            {
                "document_id": "doc_cs101",
                "document_name": "CS101 Syllabus",
                "content": "Module 1: Arrays & Linked Lists. Module 2: Stacks & Queues. Module 3: Trees & Graphs. Module 4: Sorting & Searching. Module 5: Dynamic Programming.",
                "page": 2,
                "section": "Module Breakdown",
            },
        ]
    elif any(kw in query_lower for kw in ["library", "campus", "facility", "hours", "contact", "office"]):
        chunks = [
            {
                "document_id": "faq_001",
                "document_name": "Campus Policies",
                "content": "Library hours are 8 AM to 10 PM daily. The student services office is open from 9 AM to 5 PM on weekdays. The campus gym is open from 6 AM to 9 PM.",
                "section": "Facilities",
            },
        ]
    elif any(kw in query_lower for kw in ["summarize", "summary", "explain", "describe"]):
        chunks = [
            {
                "document_id": "doc_cs101",
                "document_name": "CS101 Syllabus",
                "content": "CS101 covers Data Structures, Algorithms, and OOP. The midterm exam is on October 15th. The final exam covers all modules including Graph Theory and Dynamic Programming. Prerequisites: Basic programming in any language.",
                "page": 1,
                "section": "Course Overview",
            },
        ]
    else:
        chunks = [
            {
                "document_id": "faq_general",
                "document_name": "General Campus Info",
                "content": "RoenRiviera University offers over 50 undergraduate programs. The campus is located in a 200-acre green zone with modern facilities.",
                "section": "About",
            },
        ]

    context_text = "\n\n".join(c["content"] for c in chunks)
    elapsed = int((time.time() - start) * 1000)

    return {
        "context_chunks": chunks,
        "context_text": context_text,
        "latency_ms": elapsed,
    }


def generate_rag_answer(state: RAGState) -> dict:
    """Generate a grounded answer using Groq (LangChain)."""
    start = time.time()

    llm = _get_groq_llm()

    system_prompt = (
        "You are River, the intelligent campus assistant for RoenRiviera University. "
        "Answer the student's question using ONLY the context provided below. "
        "If the context does not contain enough information, say so honestly. "
        "Be concise, helpful, and cite the relevant document when possible.\n\n"
        f"### Context\n{state['context_text']}"
    )

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=state["query"]),
    ]

    response = llm.invoke(messages)
    elapsed = int((time.time() - start) * 1000) + state.get("latency_ms", 0)

    return {
        "answer": response.content,
        "grounded": True,
        "latency_ms": elapsed,
    }


# ---------------------------------------------------------------------------
# Timetable Graph – nodes
# ---------------------------------------------------------------------------

def fetch_schedule(state: TimetableState) -> dict:
    """
    Fetch the student's schedule data.
    Mock implementation — in production would query a database.
    """
    start = time.time()

    mock_schedule = [
        {"day": "Monday", "time": "10:00", "course": "CS101", "room": "A-201"},
        {"day": "Monday", "time": "10:00", "course": "MA102", "room": "B-105"},
        {"day": "Tuesday", "time": "14:00", "course": "PH103", "room": "C-301"},
        {"day": "Wednesday", "time": "09:00", "course": "CS101", "room": "A-201"},
        {"day": "Thursday", "time": "11:00", "course": "MA102", "room": "B-105"},
        {"day": "Friday", "time": "10:00", "course": "ENG104", "room": "D-102"},
    ]

    elapsed = int((time.time() - start) * 1000)
    return {"schedule_data": mock_schedule, "latency_ms": elapsed}


def detect_conflicts(state: TimetableState) -> dict:
    """Deterministic overlap detection on the schedule data."""
    from collections import defaultdict

    slots: Dict[str, List[str]] = defaultdict(list)
    for entry in state["schedule_data"]:
        key = f"{entry['day']}_{entry['time']}"
        slots[key].append(entry["course"])

    conflicts = {k: v for k, v in slots.items() if len(v) > 1}
    has_conflict = bool(conflicts)

    return {"has_conflict": has_conflict}


def generate_timetable_answer(state: TimetableState) -> dict:
    """Generate a natural-language response about the timetable using Groq."""
    start = time.time()

    llm = _get_groq_llm()

    schedule_text = "\n".join(
        f"  {e['day']} {e['time']} — {e['course']} (Room {e['room']})"
        for e in state["schedule_data"]
    )

    conflict_note = ""
    if state["has_conflict"]:
        # Re-detect which slots conflict for the prompt
        from collections import defaultdict
        slots: Dict[str, List[Dict]] = defaultdict(list)
        for entry in state["schedule_data"]:
            key = f"{entry['day']} at {entry['time']}"
            slots[key].append(entry)
        for key, entries in slots.items():
            if len(entries) > 1:
                names = ", ".join(e["course"] for e in entries)
                conflict_note += f"\n⚠ CONFLICT on {key}: {names}"

    system_prompt = (
        "You are River, the campus timetable assistant. "
        "Analyze the student's schedule and answer their question. "
        "If there are conflicts, highlight them clearly.\n\n"
        f"### Student Schedule\n{schedule_text}"
    )
    if conflict_note:
        system_prompt += f"\n\n### Detected Conflicts{conflict_note}"

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=state["query"]),
    ]

    response = llm.invoke(messages)
    elapsed = int((time.time() - start) * 1000) + state.get("latency_ms", 0)

    return {"answer": response.content, "latency_ms": elapsed}


# ---------------------------------------------------------------------------
# Compile graphs
# ---------------------------------------------------------------------------

def _build_rag_graph() -> StateGraph:
    """Build and compile the RAG StateGraph."""
    graph = StateGraph(RAGState)
    graph.add_node("retrieve", retrieve_context)
    graph.add_node("generate", generate_rag_answer)
    graph.add_edge("retrieve", "generate")
    graph.add_edge("generate", END)
    graph.set_entry_point("retrieve")
    return graph.compile()


def _build_timetable_graph() -> StateGraph:
    """Build and compile the Timetable StateGraph."""
    graph = StateGraph(TimetableState)
    graph.add_node("fetch_schedule", fetch_schedule)
    graph.add_node("detect_conflicts", detect_conflicts)
    graph.add_node("generate_answer", generate_timetable_answer)
    graph.add_edge("fetch_schedule", "detect_conflicts")
    graph.add_edge("detect_conflicts", "generate_answer")
    graph.add_edge("generate_answer", END)
    graph.set_entry_point("fetch_schedule")
    return graph.compile()


# Pre-compiled graph applications (import and invoke directly)
rag_graph = _build_rag_graph()
timetable_graph = _build_timetable_graph()
