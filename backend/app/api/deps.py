from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import httpx
from app.core.config import settings

security = HTTPBearer()

# ─────────────────────────────────────────────────────────────────
# JWKS cache — Supabase public keys for RS256 token verification
# ─────────────────────────────────────────────────────────────────
_jwks_cache: dict | None = None

async def _get_jwks() -> dict:
    """
    Fetch (and cache) Supabase's JWKS (JSON Web Key Set).
    These are the public keys used to verify RS256-signed access tokens.
    URL: <SUPABASE_URL>/auth/v1/.well-known/jwks.json
    """
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache

    jwks_url = f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(jwks_url)
        resp.raise_for_status()
        _jwks_cache = resp.json()
    return _jwks_cache


def _get_public_key_from_jwks(jwks: dict, kid: str | None):
    """
    Find the matching public key in the JWKS by 'kid' (key ID).
    Falls back to the first key if kid is None or not found.
    """
    from jwt.algorithms import RSAAlgorithm
    keys = jwks.get("keys", [])
    if not keys:
        raise ValueError("JWKS has no keys")

    if kid:
        for key in keys:
            if key.get("kid") == kid:
                return RSAAlgorithm.from_jwk(key)

    # Fallback: use the first key
    return RSAAlgorithm.from_jwk(keys[0])


# ─────────────────────────────────────────────────────────────────
# Token verification dependency
# ─────────────────────────────────────────────────────────────────

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verifies a Supabase JWT access token (RS256).
    Fetches the JWKS from Supabase and verifies the token signature.
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        # Step 1: Read the token header to get kid + alg without verifying
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        alg = unverified_header.get("alg", "RS256")

        if alg == "RS256":
            # RS256: verify against Supabase JWKS public key
            jwks = await _get_jwks()
            public_key = _get_public_key_from_jwks(jwks, kid)
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience="authenticated",
                options={"verify_exp": True},
            )
        else:
            # HS256 fallback (legacy / local dev tokens)
            import base64
            secret = settings.SUPABASE_JWT_SECRET
            try:
                decoded_secret = base64.b64decode(secret)
            except Exception:
                decoded_secret = secret.encode("utf-8")
            payload = jwt.decode(
                token,
                decoded_secret,
                algorithms=["HS256"],
                audience="authenticated",
                options={"verify_exp": True},
            )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError as e:
        print(f"JWT Verification failed: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
    except Exception as e:
        print(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")
