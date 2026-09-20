from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Investigation Schemas ---
class InvestigationBase(BaseModel):
    name: str
    description: Optional[str] = None
    analyst: Optional[str] = "SOC Analyst"

class InvestigationCreate(InvestigationBase):
    pass

class InvestigationResponse(InvestigationBase):
    id: str
    created_at: datetime
    updated_at: datetime
    status: str
    source_type: str
    overall_security_score: float

    model_config = ConfigDict(from_attributes=True)

# --- Evidence Schemas ---
class EvidenceResponse(BaseModel):
    id: str
    investigation_id: str
    filename: str
    file_path: str
    file_size: int
    sha256: str
    upload_timestamp: datetime
    capture_timestamp: Optional[datetime] = None
    analyzer_version: str
    integrity_status: str

    model_config = ConfigDict(from_attributes=True)

# --- Certificate Schemas ---
class CertificateResponse(BaseModel):
    id: str
    subject: str
    issuer: str
    serial_number: str
    validity_start: datetime
    validity_end: datetime
    public_key_algorithm: str
    public_key_size: int
    signature_algorithm: str
    sans: List[str]
    certificate_chain_status: str
    expiration_status: str
    trust_findings: List[str]

    model_config = ConfigDict(from_attributes=True)

# --- TLS Handshake Schemas ---
class TLSHandshakeResponse(BaseModel):
    id: str
    session_id: str
    tls_version: Optional[str] = None
    cipher_suite: Optional[str] = None
    supported_versions: Optional[List[str]] = None
    key_exchange: Optional[str] = None
    signature_algorithm: Optional[str] = None
    extensions: Optional[Dict[str, Any]] = None
    sni: Optional[str] = None
    alpn: Optional[str] = None
    anomalies: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True)

# --- Email Session Schemas ---
class EmailSessionResponse(BaseModel):
    id: str
    investigation_id: str
    protocol: str
    source_ip: str
    source_port: int
    destination_ip: str
    destination_port: int
    start_time: datetime
    end_time: datetime
    encryption_state: str
    tls_version: Optional[str] = None
    cipher_suite: Optional[str] = None
    key_exchange: Optional[str] = None
    certificate_id: Optional[str] = None
    anomaly_score: float
    risk_score: float
    risk_level: str
    certificate: Optional[CertificateResponse] = None
    tls_handshake: Optional[TLSHandshakeResponse] = None

    model_config = ConfigDict(from_attributes=True)

# --- Finding Schemas ---
class FindingResponse(BaseModel):
    id: str
    investigation_id: str
    session_id: Optional[str] = None
    category: str
    severity: str
    title: str
    description: str
    evidence: str
    recommendation: str
    confidence: float
    created_at: datetime
    hash: str
    blockchain_status: str

    model_config = ConfigDict(from_attributes=True)

# --- AI Analysis Schemas ---
class AIAnalysisResponse(BaseModel):
    id: str
    session_id: str
    model_version: str
    features: Dict[str, Any]
    risk_probability: float
    anomaly_score: float
    classification: str
    explanation: Dict[str, Any]
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Report Schemas ---
class ReportResponse(BaseModel):
    id: str
    investigation_id: str
    report_type: str
    generated_at: datetime
    report_hash: str
    file_path: str
    blockchain_reference: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# --- Blockchain Schemas ---
class BlockchainLedgerResponse(BaseModel):
    id: str
    record_type: str
    entity_id: str
    investigation_id: str
    hash_value: str
    previous_block_hash: str
    block_index: str
    timestamp: datetime
    analyzer_version: str
    transaction_tx: str
    metadata_json: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

# --- Dashboard Summary Schemas ---
class DashboardSummaryResponse(BaseModel):
    investigation_id: str
    investigation_name: str
    overall_score: float
    score_breakdown: Dict[str, float]
    total_sessions: int
    protocol_distribution: Dict[str, int]
    tls_distribution: Dict[str, int]
    cipher_strength_distribution: Dict[str, int]
    risk_distribution: Dict[str, int]
    certificate_health: Dict[str, int]
    critical_findings_count: int
    high_findings_count: int
    medium_findings_count: int
    low_findings_count: int
    anomalous_sessions_count: int
    evidence_verification_status: str
