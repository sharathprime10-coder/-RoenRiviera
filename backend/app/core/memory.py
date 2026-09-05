import json
import asyncio
from typing import List, Dict, Any
from app.core.db import get_supabase_client
from app.rag.graph import _get_groq_llm
from langchain_core.messages import SystemMessage, HumanMessage

def save_message(user_id: str, conversation_id: str, role: str, content: str):
    """Save a chat message to short-term memory (database)."""
    supabase = get_supabase_client()
    try:
        supabase.table("chat_messages").insert({
            "conversation_id": conversation_id,
            "user_id": user_id,
            "role": role,
            "content": content
        }).execute()
    except Exception as e:
        print(f"[MEMORY] Failed to save message: {e}")

def get_recent_messages(user_id: str, conversation_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Get the most recent messages for a conversation, ordered chronologically."""
    supabase = get_supabase_client()
    try:
        result = supabase.table("chat_messages")\
            .select("*")\
            .eq("user_id", user_id)\
            .eq("conversation_id", conversation_id)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        # Return in chronological order
        return list(reversed(result.data))
    except Exception as e:
        print(f"[MEMORY] Failed to fetch recent messages: {e}")
        return []

def get_user_memory(user_id: str) -> Dict[str, Any]:
    """Fetch the long-term memory for a user."""
    supabase = get_supabase_client()
    try:
        result = supabase.table("user_memory").select("*").eq("user_id", user_id).execute()
        if result.data:
            return result.data[0]
    except Exception as e:
        print(f"[MEMORY] Failed to fetch user memory: {e}")
        
    # Default structure if none exists or error occurred
    return {"user_id": user_id, "semantic_facts": {}, "preferences": {}, "summary": ""}

async def extract_and_update_memory(user_id: str, conversation_id: str):
    """Background task to extract durable facts and preferences from recent conversation."""
    try:
        messages = get_recent_messages(user_id, conversation_id, limit=20)
        if not messages:
            return

        chat_history = "\n".join([f"{m['role']}: {m['content']}" for m in messages])
        
        llm = _get_groq_llm()
        system_prompt = (
            "You are an Automatic Memory Extraction Module for a campus assistant. "
            "Read the recent conversation and extract any durable facts about the user "
            "(e.g., their major, courses they take) and their preferences (e.g., 'keep answers short'). "
            "Return the result STRICTLY as a JSON object with two keys: 'semantic_facts' (key-value strings) "
            "and 'preferences' (key-value strings). If nothing new is found, return empty dicts."
        )
        
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Conversation:\n{chat_history}")
        ])
        
        try:
            # Simple JSON parse (in production use structured output/function calling)
            raw_text = response.content.replace("```json", "").replace("```", "").strip()
            extracted = json.loads(raw_text)
            new_facts = extracted.get("semantic_facts", {})
            new_prefs = extracted.get("preferences", {})
            
            if new_facts or new_prefs:
                current_memory = get_user_memory(user_id)
                
                # Merge logic
                merged_facts = current_memory.get("semantic_facts", {})
                merged_facts.update(new_facts)
                merged_prefs = current_memory.get("preferences", {})
                merged_prefs.update(new_prefs)
                
                supabase = get_supabase_client()
                supabase.table("user_memory").upsert({
                    "user_id": user_id,
                    "semantic_facts": merged_facts,
                    "preferences": merged_prefs
                }).execute()
                print(f"[MEMORY] Extracted and saved memory for {user_id}")
                
        except json.JSONDecodeError:
            print("[MEMORY] Failed to parse JSON from extraction")
            
    except Exception as e:
        print(f"[MEMORY] Error extracting memory: {e}")
