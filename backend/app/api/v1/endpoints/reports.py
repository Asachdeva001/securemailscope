from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os

from app.core.database import get_db
from app.models.investigation import Investigation
from app.models.session import EmailSession, Certificate
from app.models.finding import Finding, Report
from app.models.blockchain import BlockchainLedger
from app.schemas.schemas import ReportResponse
from app.services.reporting.report_generator import ReportGenerator
from app.services.scoring.posture_calculator import PostureCalculator
from app.services.blockchain.blockchain_service import BlockchainService

router = APIRouter()

@router.post("/generate", response_model=ReportResponse)
def generate_report(
    investigation_id: str = Form(...),
    report_type: str = Form("HTML"), # JSON, HTML
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")

    sessions = db.query(EmailSession).filter(EmailSession.investigation_id == inv.id).all()
    findings = db.query(Finding).filter(Finding.investigation_id == inv.id).all()
    certs = db.query(Certificate).all()
    blockchain_records = db.query(BlockchainLedger).filter(BlockchainLedger.investigation_id == inv.id).all()

    score, breakdown = PostureCalculator.calculate_posture(sessions, findings, certs)
    posture_data = {"overall_score": score, "breakdown": breakdown}

    inv_data = {"id": inv.id, "name": inv.name, "analyst": inv.analyst}
    s_dicts = [{"id": s.id, "protocol": s.protocol, "src": f"{s.source_ip}:{s.source_port}", "dst": f"{s.destination_ip}:{s.destination_port}", "tls": s.tls_version, "cipher": s.cipher_suite, "risk": s.risk_level} for s in sessions]
    f_dicts = [{"id": f.id, "severity": f.severity, "category": f.category, "title": f.title, "evidence": f.evidence, "recommendation": f.recommendation} for f in findings]
    c_dicts = [{"subject": c.subject, "issuer": c.issuer, "exp": c.expiration_status, "chain": c.certificate_chain_status} for c in certs]
    b_dicts = [{"index": b.block_index, "tx": b.transaction_tx, "type": b.record_type, "hash": b.hash_value} for b in blockchain_records]

    if report_type.upper() == "JSON":
        filepath, report_hash = ReportGenerator.generate_json_report(inv_data, s_dicts, f_dicts, c_dicts, posture_data, b_dicts)
    elif report_type.upper() == "PDF":
        filepath, report_hash = ReportGenerator.generate_pdf_report(inv_data, s_dicts, f_dicts, c_dicts, posture_data, b_dicts)
    else:
        filepath, report_hash = ReportGenerator.generate_html_report(inv_data, s_dicts, f_dicts, c_dicts, posture_data, b_dicts)

    report_rec = Report(
        investigation_id=inv.id,
        report_type=report_type.upper(),
        report_hash=report_hash,
        file_path=filepath,
        blockchain_reference="REGISTERED"
    )
    db.add(report_rec)
    db.commit()
    db.refresh(report_rec)

    # Register Report Hash on Blockchain
    BlockchainService.register_record(
        db=db, record_type="REPORT", entity_id=report_rec.id, investigation_id=inv.id,
        payload={"report_type": report_rec.report_type, "report_hash": report_hash, "file_path": filepath}
    )

    return report_rec

@router.get("/{id}")
def download_report(id: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report or not os.path.exists(report.file_path):
        raise HTTPException(status_code=404, detail="Report file not found")

    if report.report_type == "JSON":
        media_type = "application/json"
    elif report.report_type == "PDF":
        media_type = "application/pdf"
    else:
        media_type = "text/html"

    return FileResponse(path=report.file_path, filename=os.path.basename(report.file_path), media_type=media_type)

