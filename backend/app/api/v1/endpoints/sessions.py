from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.session import EmailSession
from app.schemas.schemas import EmailSessionResponse

router = APIRouter()

@router.get("/", response_model=List[EmailSessionResponse])
def list_sessions(
    investigation_id: Optional[str] = None,
    protocol: Optional[str] = None,
    tls_version: Optional[str] = None,
    risk_level: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(EmailSession)
    if investigation_id:
        query = query.filter(EmailSession.investigation_id == investigation_id)
    if protocol:
        query = query.filter(EmailSession.protocol == protocol)
    if tls_version:
        query = query.filter(EmailSession.tls_version == tls_version)
    if risk_level:
        query = query.filter(EmailSession.risk_level == risk_level)

    return query.order_by(EmailSession.risk_score.desc()).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=EmailSessionResponse)
def get_session(id: str, db: Session = Depends(get_db)):
    sess = db.query(EmailSession).filter(EmailSession.id == id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Email session not found")
    return sess
