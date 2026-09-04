import httpx
from typing import Optional, Dict, Any, List
from app.core.config import settings
from google import genai
from google.genai import types

class LLMProvider:
    async def generate_response(self, prompt: str, context: str) -> str:
        raise NotImplementedError

class GeminiProvider(LLMProvider):
    def __init__(self):
        # We assume the key will be injected via settings
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = settings.GEMINI_MODEL

    async def generate_response(self, prompt: str, context: str) -> str:
        if not settings.GEMINI_API_KEY:
            return "Gemini API key not configured."
        
        full_prompt = f"Context:\n{context}\n\nUser Query:\n{prompt}"
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=full_prompt,
            config=types.GenerateContentConfig(
                temperature=0.0
            )
        )
        return response.text

class GroqProvider(LLMProvider):
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model_name = settings.GROQ_MODEL
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    async def generate_response(self, prompt: str, context: str) -> str:
        if not self.api_key:
            return "Groq API key not configured."
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": f"You are a helpful assistant answering based on this context: {context}"},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.0
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(self.url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

async def generate_rag_response(prompt: str, context: str) -> str:
    """Primary LLM pipeline with fallback support."""
    primary_provider = settings.LLM_PROVIDER.lower()
    
    try:
        if primary_provider == "gemini":
            provider = GeminiProvider()
            return await provider.generate_response(prompt, context)
        elif primary_provider == "groq":
            provider = GroqProvider()
            return await provider.generate_response(prompt, context)
        else:
            return "Invalid LLM provider configured."
    except Exception as e:
        if settings.LLM_FALLBACK_ENABLED:
            print(f"Primary LLM failed: {e}. Falling back...")
            try:
                # If Gemini failed, try Groq
                if primary_provider == "gemini":
                    fallback = GroqProvider()
                    return await fallback.generate_response(prompt, context)
                # If Groq failed, try Gemini
                elif primary_provider == "groq":
                    fallback = GeminiProvider()
                    return await fallback.generate_response(prompt, context)
            except Exception as fallback_e:
                print(f"Fallback LLM also failed: {fallback_e}")
                return "Service temporarily unavailable due to upstream LLM errors."
        
        return "Service temporarily unavailable."
