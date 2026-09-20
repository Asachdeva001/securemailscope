from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.finding import AIAnalysis
from app.schemas.schemas import AIAnalysisResponse

router = APIRouter()

@router.get("/risk", response_model=List[AIAnalysisResponse])
def get_risk_analyses(
    classification: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(AIAnalysis)
    if classification:
        query = query.filter(AIAnalysis.classification == classification)
    return query.order_by(AIAnalysis.risk_probability.desc()).offset(skip).limit(limit).all()

@router.get("/anomalies", response_model=List[AIAnalysisResponse])
def get_anomalies(
    min_anomaly_score: float = 0.3,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return (
        db.query(AIAnalysis)
        .filter(AIAnalysis.anomaly_score >= min_anomaly_score)
        .order_by(AIAnalysis.anomaly_score.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
