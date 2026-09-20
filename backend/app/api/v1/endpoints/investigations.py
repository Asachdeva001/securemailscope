from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.investigation import Investigation
from app.schemas.schemas import InvestigationCreate, InvestigationResponse

router = APIRouter()

@router.post("/", response_model=InvestigationResponse)
def create_investigation(payload: InvestigationCreate, db: Session = Depends(get_db)):
    inv = Investigation(
        name=payload.name,
        description=payload.description,
        analyst=payload.analyst or "SOC Analyst"
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv

@router.get("/", response_model=List[InvestigationResponse])
def list_investigations(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Investigation).order_by(Investigation.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=InvestigationResponse)
def get_investigation(id: str, db: Session = Depends(get_db)):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return inv

@router.delete("/{id}")
def delete_investigation(id: str, db: Session = Depends(get_db)):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    db.delete(inv)
    db.commit()
    return {"message": "Investigation deleted successfully"}
