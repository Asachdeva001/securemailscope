from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.blockchain import BlockchainLedger
from app.schemas.schemas import BlockchainLedgerResponse
from app.services.blockchain.blockchain_service import BlockchainService

router = APIRouter()

@router.get("/", response_model=List[BlockchainLedgerResponse])
def list_blockchain_records(
    investigation_id: Optional[str] = None,
    record_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(BlockchainLedger)
    if investigation_id:
        query = query.filter(BlockchainLedger.investigation_id == investigation_id)
    if record_type:
        query = query.filter(BlockchainLedger.record_type == record_type)

    return query.order_by(BlockchainLedger.timestamp.desc()).offset(skip).limit(limit).all()

@router.post("/verify")
def verify_blockchain_record(
    entity_id: str,
    hash_value: str,
    db: Session = Depends(get_db)
):
    return BlockchainService.verify_hash(db, entity_id=entity_id, current_hash=hash_value)
