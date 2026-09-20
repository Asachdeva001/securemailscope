from sqlalchemy import Column, String, DateTime, Text, JSON
from datetime import datetime
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class BlockchainLedger(Base):
    __tablename__ = "blockchain_ledger"

    id = Column(String, primary_key=True, default=generate_uuid)
    record_type = Column(String, nullable=False) # EVIDENCE, FINDING, REPORT, INVESTIGATION
    entity_id = Column(String, nullable=False, index=True)
    investigation_id = Column(String, nullable=False, index=True)
    hash_value = Column(String, nullable=False, index=True)
    previous_block_hash = Column(String, nullable=False)
    block_index = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    analyzer_version = Column(String, default="1.0.0")
    metadata_json = Column(JSON, nullable=True)
    transaction_tx = Column(String, nullable=False) # Mock or EVM TX Hash
