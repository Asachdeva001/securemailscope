from fastapi import APIRouter

from app.api.v1.endpoints import (
    investigations,
    evidence,
    sessions,
    findings,
    certificates,
    ai,
    dashboard,
    reports,
    blockchain,
    demo
)

api_router = APIRouter()

api_router.include_router(investigations.router, prefix="/investigations", tags=["Investigations"])
api_router.include_router(evidence.router, prefix="/evidence", tags=["Evidence"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["Email Sessions"])
api_router.include_router(findings.router, prefix="/findings", tags=["Findings"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["Certificates"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI & Anomalies"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["SOC Dashboard"])
api_router.include_router(reports.router, prefix="/reports", tags=["Forensic Reports"])
api_router.include_router(blockchain.router, prefix="/blockchain", tags=["Blockchain Provenance"])
api_router.include_router(demo.router, prefix="/demo", tags=["Demo Mode"])
