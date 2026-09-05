import os
from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    """
    Returns a configured Supabase client.
    Uses the service role key to bypass RLS for vector DB operations.
    """
    url: str = settings.SUPABASE_URL
    key: str = settings.SUPABASE_SERVICE_ROLE_KEY
    
    if not url or not key:
        raise ValueError("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.")
        
    return create_client(url, key)

def get_embeddings():
    """
    Returns the initialized Gemini Embeddings model.
    """
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set in environment variables.")
        
    # We use text-embedding-004 which outputs 768-dimensional vectors
    return GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=api_key
    )
