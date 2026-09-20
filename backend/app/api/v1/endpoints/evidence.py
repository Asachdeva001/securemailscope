import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.config import settings
from app.models.investigation import Evidence, Investigation
from app.schemas.schemas import EvidenceResponse, InvestigationResponse
from app.services.pcap.pcap_service import PCAPService
from app.services.blockchain.blockchain_service import BlockchainService

router = APIRouter()

@router.post("/upload", response_model=InvestigationResponse)
def upload_pcap(
    file: UploadFile = File(...),
    investigation_name: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(('.pcap', '.pcapng', '.cap')):
        raise HTTPException(status_code=400, detail="Invalid file type. File must be .pcap or .pcapng")

    save_path = os.path.join(settings.PCAP_DIR, f"{file.filename}")
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    inv = PCAPService.process_pcap(
        db=db,
        filepath=save_path,
        filename=file.filename,
        investigation_name=investigation_name
    )

    return inv

@router.get("/{id}", response_model=EvidenceResponse)
def get_evidence(id: str, db: Session = Depends(get_db)):
    ev = db.query(Evidence).filter(Evidence.id == id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found")
    return ev

@router.get("/{id}/verify")
def verify_evidence(id: str, db: Session = Depends(get_db)):
    ev = db.query(Evidence).filter(Evidence.id == id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found")

    # Recalculate file hash
    current_hash = PCAPService.calculate_file_hash(ev.file_path) if os.path.exists(ev.file_path) else ev.sha256
    verification = BlockchainService.verify_hash(db, entity_id=ev.id, current_hash=current_hash)

    return {
        "evidence_id": ev.id,
        "filename": ev.filename,
        "expected_sha256": ev.sha256,
        "calculated_sha256": current_hash,
        "verification_result": verification
    }
