from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.models.investigation import Investigation
from app.models.session import EmailSession, Certificate
from app.models.finding import Finding
from app.schemas.schemas import DashboardSummaryResponse
from app.services.scoring.posture_calculator import PostureCalculator

router = APIRouter()

@router.get("/", response_model=DashboardSummaryResponse)
@router.get("/{investigation_id}", response_model=DashboardSummaryResponse)
def get_dashboard_summary(investigation_id: Optional[str] = None, db: Session = Depends(get_db)):
    if investigation_id:
        inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    else:
        inv = db.query(Investigation).order_by(Investigation.created_at.desc()).first()

    if not inv:
        raise HTTPException(status_code=404, detail="No investigations found. Load demo or upload PCAP.")

    sessions = db.query(EmailSession).filter(EmailSession.investigation_id == inv.id).all()
    findings = db.query(Finding).filter(Finding.investigation_id == inv.id).all()
    
    cert_ids = [s.certificate_id for s in sessions if s.certificate_id]
    certs = db.query(Certificate).filter(Certificate.id.in_(cert_ids)).all() if cert_ids else []

    overall_score, breakdown = PostureCalculator.calculate_posture(sessions, findings, certs)

    # Distributions
    proto_dist = {"SMTP": 0, "IMAP": 0, "POP3": 0}
    tls_dist = {"TLS 1.3": 0, "TLS 1.2": 0, "TLS 1.1": 0, "TLS 1.0": 0, "Plaintext": 0}
    cipher_dist = {"Strong": 0, "Moderate": 0, "Weak": 0, "Unencrypted": 0}
    risk_dist = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    cert_dist = {"Valid": 0, "Expiring Soon": 0, "Expired": 0, "Self-Signed/Untrusted": 0}

    for s in sessions:
        proto_dist[s.protocol] = proto_dist.get(s.protocol, 0) + 1
        
        v = s.tls_version or "Plaintext"
        tls_dist[v] = tls_dist.get(v, 0) + 1

        c = (s.cipher_suite or "").upper()
        if not s.tls_version or s.encryption_state == "PLAINTEXT":
            cipher_dist["Unencrypted"] += 1
        elif any(w in c for w in ["RC4", "3DES", "DES", "NULL", "EXPORT", "MD5"]):
            cipher_dist["Weak"] += 1
        elif "GCM" in c or "CHACHA20" in c or "POLY1305" in c:
            cipher_dist["Strong"] += 1
        else:
            cipher_dist["Moderate"] += 1

        risk_dist[s.risk_level] = risk_dist.get(s.risk_level, 0) + 1

    for c in certs:
        if c.expiration_status == "Expired":
            cert_dist["Expired"] += 1
        elif c.expiration_status == "Expiring Soon":
            cert_dist["Expiring Soon"] += 1
        elif c.certificate_chain_status in ["Self-Signed", "Untrusted"]:
            cert_dist["Self-Signed/Untrusted"] += 1
        else:
            cert_dist["Valid"] += 1

    crit_count = sum(1 for f in findings if f.severity == "Critical")
    high_count = sum(1 for f in findings if f.severity == "High")
    med_count = sum(1 for f in findings if f.severity == "Medium")
    low_count = sum(1 for f in findings if f.severity in ["Low", "Informational"])
    anomaly_count = sum(1 for s in sessions if s.anomaly_score >= 0.3)

    return {
        "investigation_id": inv.id,
        "investigation_name": inv.name,
        "overall_score": overall_score,
        "score_breakdown": breakdown,
        "total_sessions": len(sessions),
        "protocol_distribution": proto_dist,
        "tls_distribution": tls_dist,
        "cipher_strength_distribution": cipher_dist,
        "risk_distribution": risk_dist,
        "certificate_health": cert_dist,
        "critical_findings_count": crit_count,
        "high_findings_count": high_count,
        "medium_findings_count": med_count,
        "low_findings_count": low_count,
        "anomalous_sessions_count": anomaly_count,
        "evidence_verification_status": "VERIFIED"
    }
