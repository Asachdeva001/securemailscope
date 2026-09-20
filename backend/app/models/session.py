from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class EmailSession(Base):
    __tablename__ = "email_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    investigation_id = Column(String, ForeignKey("investigations.id"), nullable=False)
    protocol = Column(String, nullable=False) # SMTP, IMAP, POP3
    source_ip = Column(String, nullable=False)
    source_port = Column(Integer, nullable=False)
    destination_ip = Column(String, nullable=False)
    destination_port = Column(Integer, nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, default=datetime.utcnow)
    encryption_state = Column(String, default="PLAINTEXT") # PLAINTEXT, STARTTLS_INITIATED, TLS_HANDSHAKE, ENCRYPTED
    tls_version = Column(String, nullable=True) # TLS 1.0, TLS 1.1, TLS 1.2, TLS 1.3, None
    cipher_suite = Column(String, nullable=True)
    key_exchange = Column(String, nullable=True)
    certificate_id = Column(String, ForeignKey("certificates.id"), nullable=True)
    anomaly_score = Column(Float, default=0.0) # 0.0 to 1.0
    risk_score = Column(Float, default=0.0) # 0 to 100
    risk_level = Column(String, default="Low") # Critical, High, Medium, Low, Info

    investigation = relationship("Investigation", back_populates="email_sessions")
    tls_handshake = relationship("TLSHandshake", uselist=False, back_populates="session", cascade="all, delete-orphan")
    certificate = relationship("Certificate", back_populates="sessions")
    findings = relationship("Finding", back_populates="session", cascade="all, delete-orphan")
    ai_analysis = relationship("AIAnalysis", uselist=False, back_populates="session", cascade="all, delete-orphan")

class TLSHandshake(Base):
    __tablename__ = "tls_handshakes"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("email_sessions.id"), nullable=False, unique=True)
    tls_version = Column(String, nullable=True)
    cipher_suite = Column(String, nullable=True)
    supported_versions = Column(JSON, nullable=True)
    key_exchange = Column(String, nullable=True)
    signature_algorithm = Column(String, nullable=True)
    extensions = Column(JSON, nullable=True)
    sni = Column(String, nullable=True)
    alpn = Column(String, nullable=True)
    session_characteristics = Column(JSON, nullable=True)
    anomalies = Column(JSON, nullable=True)

    session = relationship("EmailSession", back_populates="tls_handshake")

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(String, primary_key=True, default=generate_uuid)
    subject = Column(String, nullable=False)
    issuer = Column(String, nullable=False)
    serial_number = Column(String, nullable=False)
    validity_start = Column(DateTime, nullable=False)
    validity_end = Column(DateTime, nullable=False)
    public_key_algorithm = Column(String, nullable=False)
    public_key_size = Column(Integer, nullable=False)
    signature_algorithm = Column(String, nullable=False)
    sans = Column(JSON, default=list) # Subject Alternative Names
    certificate_chain_status = Column(String, default="Valid") # Valid, Incomplete, Self-Signed, Untrusted
    expiration_status = Column(String, default="Valid") # Valid, Expiring Soon, Expired
    trust_findings = Column(JSON, default=list)

    sessions = relationship("EmailSession", back_populates="certificate")
