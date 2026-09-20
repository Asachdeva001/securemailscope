from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from app.core.config import settings

class IAPAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Exclude root health checks and openapi docs
        if request.url.path in ["/", "/health", "/docs", "/openapi.json"]:
            return await call_next(request)

        iap_jwt = request.headers.get("x-goog-authenticated-user-jwt")
        iap_email = request.headers.get("x-goog-authenticated-user-email")

        analyst_email = "soc_analyst@enterprise.local"

        if iap_email:
            analyst_email = iap_email.replace("accounts.google.com:", "")
        elif iap_jwt and settings.ENABLE_GCP_INTEGRATION:
            # Parse GCP IAP JWT assertion claim
            try:
                import jwt
                unverified_claims = jwt.decode(iap_jwt, options={"verify_signature": False})
                analyst_email = unverified_claims.get("email", analyst_email)
            except Exception:
                pass

        # Attach authenticated analyst user to request state
        request.state.analyst_email = analyst_email
        request.state.user_role = "SOC_LEAD" if "admin" in analyst_email.lower() else "SOC_ANALYST"

        response = await call_next(request)
        return response
