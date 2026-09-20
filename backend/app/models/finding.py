from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Finding(Base):
    __tablename__ = "findings"

    id = Column(String, primary_key=True, default=generate_uuid)
    investigation_id = Column(String, ForeignKey("investigations.id"), nullable=False)
    session_id = Column(String, ForeignKey("email_sessions.id"), nullable=True)
    category = Column(String, nullable=False) # TLS Security, Certificate, Protocol Config, Cryptographic Weakness, Anomaly
    severity = Column(String, nullable=False) # Critical, High, Medium, Low, Informational
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    confidence = Column(Float, default=1.0) # 0.0 to 1.0
    created_at = Column(DateTime, default=datetime.utcnow)
    hash = Column(String, nullable=False) # SHA-256 finding hash
    blockchain_status = Column(String, default="REGISTERED") # REGISTERED, PENDING, UNVERIFIED

    investigation = relationship("Investigation", back_populates="findings")
    session = relationship("EmailSession", back_populates="findings")

class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("email_sessions.id"), nullable=False, unique=True)
    model_version = Column(String, default="1.0-IsolationForest-RuleHybrid")
    features = Column(JSON, nullable=False)
    risk_probability = Column(Float, default=0.0)
    anomaly_score = Column(Float, default=0.0)
    classification = Column(String, default="Low") # Low, Medium, High, Critical
    explanation = Column(JSON, nullable=False) # Feature importances & reasons
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("EmailSession", back_populates="ai_analysis")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=generate_uuid)
    investigation_id = Column(String, ForeignKey("investigations.id"), nullable=False)
    report_type = Column(String, nullable=False) # JSON, HTML, PDF
    generated_at = Column(DateTime, default=datetime.utcnow)
    report_hash = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    blockchain_reference = Column(String, nullable=True)

    investigation = relationship("Investigation", back_populates="reports")
