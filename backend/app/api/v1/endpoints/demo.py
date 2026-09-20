from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.schemas import InvestigationResponse
from app.services.demo.demo_generator import DemoGeneratorService

router = APIRouter()

@router.post("/load", response_model=InvestigationResponse)
def load_demo(db: Session = Depends(get_db)):
    inv = DemoGeneratorService.load_demo_dataset(db)
    return inv
