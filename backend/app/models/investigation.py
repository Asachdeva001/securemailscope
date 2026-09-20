from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = Column(String, default="Analysis Complete") # Pending, Processing, Analysis Complete, Failed
    source_type = Column(String, default="PCAP Upload") # PCAP Upload, Synthetic Demo
    analyst = Column(String, default="SOC Analyst")
    overall_security_score = Column(Float, default=100.0)

    evidence_items = relationship("Evidence", back_populates="investigation", cascade="all, delete-orphan")
    email_sessions = relationship("EmailSession", back_populates="investigation", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="investigation", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="investigation", cascade="all, delete-orphan")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, default=generate_uuid)
    investigation_id = Column(String, ForeignKey("investigations.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    sha256 = Column(String, nullable=False, index=True)
    upload_timestamp = Column(DateTime, default=datetime.utcnow)
    capture_timestamp = Column(DateTime, nullable=True)
    analyzer_version = Column(String, default="1.0.0")
    integrity_status = Column(String, default="VERIFIED") # VERIFIED, UNVERIFIED, TAMPERED

    investigation = relationship("Investigation", back_populates="evidence_items")
