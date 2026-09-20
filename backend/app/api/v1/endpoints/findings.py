from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.finding import Finding
from app.schemas.schemas import FindingResponse

router = APIRouter()

@router.get("/", response_model=List[FindingResponse])
def list_findings(
    investigation_id: Optional[str] = None,
    category: Optional[str] = None,
    severity: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Finding)
    if investigation_id:
        query = query.filter(Finding.investigation_id == investigation_id)
    if category:
        query = query.filter(Finding.category == category)
    if severity:
        query = query.filter(Finding.severity == severity)

    return query.order_by(Finding.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=FindingResponse)
def get_finding(id: str, db: Session = Depends(get_db)):
    f = db.query(Finding).filter(Finding.id == id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Finding not found")
    return f
