import time
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict

# In-memory store for rate limiting (use Redis in production)
# Format: { client_ip: [timestamp1, timestamp2, ...] }
RATE_LIMIT_STORE = defaultdict(list)
MAX_REQUESTS_PER_MINUTE = 20

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean up old requests (older than 60 seconds)
        RATE_LIMIT_STORE[client_ip] = [
            t for t in RATE_LIMIT_STORE[client_ip] 
            if current_time - t < 60
        ]
        
        # Check limit
        if len(RATE_LIMIT_STORE[client_ip]) >= MAX_REQUESTS_PER_MINUTE:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."}
            )
            
        # Add current request
        RATE_LIMIT_STORE[client_ip].append(current_time)
        
        response = await call_next(request)
        return response

# Per-user rate limiting store
USER_RATE_LIMIT_STORE = defaultdict(list)
USER_MAX_REQUESTS_PER_MINUTE = 20

def check_user_rate_limit(current_user: dict):
    """
    Dependency to rate-limit authenticated users.
    Assumes current_user is passed from verify_token.
    """
    user_id = current_user.get("sub", "unknown")
    current_time = time.time()
    
    # Clean up old requests (older than 60 seconds)
    USER_RATE_LIMIT_STORE[user_id] = [
        t for t in USER_RATE_LIMIT_STORE[user_id] 
        if current_time - t < 60
    ]
    
    if len(USER_RATE_LIMIT_STORE[user_id]) >= USER_MAX_REQUESTS_PER_MINUTE:
        raise HTTPException(
            status_code=429,
            detail="User rate limit exceeded. Please try again later."
        )
        
    USER_RATE_LIMIT_STORE[user_id].append(current_time)
    return current_user
