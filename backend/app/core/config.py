import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SecureMailScope"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Storage
    DATA_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
    PCAP_DIR: str = os.path.join(DATA_DIR, "pcaps")
    REPORTS_DIR: str = os.path.join(DATA_DIR, "reports")
    LEDGER_DIR: str = os.path.join(DATA_DIR, "ledger")
    KEYS_DIR: str = os.path.join(DATA_DIR, "keys")
    WORM_LEDGER_PATH: str = os.path.join(LEDGER_DIR, "worm_ledger.jsonl")

    # Blockchain / Web3 Settings (Optional)
    WEB3_PROVIDER_URI: str = os.getenv("WEB3_PROVIDER_URI", "")
    CONTRACT_ADDRESS: str = os.getenv("CONTRACT_ADDRESS", "")
    ETH_PRIVATE_KEY: str = os.getenv("ETH_PRIVATE_KEY", "")

    # GCP Infrastructure & Managed Services Config
    GCP_PROJECT_ID: str = os.getenv("GCP_PROJECT_ID", "")
    GCP_REGION: str = os.getenv("GCP_REGION", "us-central1")
    GCS_BUCKET_NAME: str = os.getenv("GCS_BUCKET_NAME", "")
    VERTEX_AI_ENDPOINT_ID: str = os.getenv("VERTEX_AI_ENDPOINT_ID", "")
    KMS_KEY_ID: str = os.getenv("KMS_KEY_ID", "")
    ENABLE_GCP_INTEGRATION: bool = os.getenv("ENABLE_GCP_INTEGRATION", "false").lower() == "true"


    # Database
    DATABASE_URL: str = "sqlite:///./securemailscope.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]

    class Config:
        case_sensitive = True

settings = Settings()

# Ensure directories exist
os.makedirs(settings.PCAP_DIR, exist_ok=True)
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
os.makedirs(settings.LEDGER_DIR, exist_ok=True)
os.makedirs(settings.KEYS_DIR, exist_ok=True)

