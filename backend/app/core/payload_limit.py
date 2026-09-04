from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, status
from fastapi.responses import JSONResponse

class PayloadSizeLimitMiddleware(BaseHTTPMiddleware):
    """
    Limits the maximum size of incoming request bodies to prevent DoS attacks.
    """
    def __init__(self, app, max_size: int = 1_048_576): # Default 1MB
        super().__init__(app)
        self.max_size = max_size

    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        
        if content_length and int(content_length) > self.max_size:
            return JSONResponse(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                content={"detail": "Request body too large. Max size exceeded."}
            )
            
        return await call_next(request)
