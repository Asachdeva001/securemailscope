from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.session import Certificate
from app.schemas.schemas import CertificateResponse

router = APIRouter()

@router.get("/", response_model=List[CertificateResponse])
def list_certificates(
    expiration_status: Optional[str] = None,
    chain_status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Certificate)
    if expiration_status:
        query = query.filter(Certificate.expiration_status == expiration_status)
    if chain_status:
        query = query.filter(Certificate.certificate_chain_status == chain_status)

    return query.offset(skip).limit(limit).all()

@router.get("/{id}", response_model=CertificateResponse)
def get_certificate(id: str, db: Session = Depends(get_db)):
    cert = db.query(Certificate).filter(Certificate.id == id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return cert
