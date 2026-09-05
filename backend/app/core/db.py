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
    Initialize local FastEmbed Embeddings.
    This runs completely locally and generates 384-dimensional vectors.
    """
    from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
    return FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
