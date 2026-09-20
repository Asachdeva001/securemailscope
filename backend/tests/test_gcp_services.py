import os
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.gcp.gcs_storage_service import GCSStorageService
from app.services.gcp.vertex_ai_service import VertexAIService
from app.services.gcp.kms_service import KMSService
from app.services.gcp.gcp_sensor import GCPSensorService

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert "gcp_enabled" in data

def test_gcs_storage_fallback():
    # Test uploading temporary file with local fallback
    tmp_path = os.path.join(os.path.dirname(__file__), "test_sample.txt")
    with open(tmp_path, "w") as f:
        f.write("GCP GCS Evidence Test")
    
    result = GCSStorageService.upload_file(tmp_path, "evidence/test_sample.txt")
    assert result["storage_type"] in ["GCS", "LOCAL"]
    assert "uri" in result

    if os.path.exists(tmp_path):
        os.remove(tmp_path)

def test_vertex_ai_fallback():
    # Vector: [tls_score, cipher_score, key_score, cert_score, proto_score, duration_s, starttls_ok]
    sample_vector = [1.0, 1.0, 1.0, 1.0, 1.0, 2.5, 1.0]
    res = VertexAIService.predict_anomaly(sample_vector)
    # Returns None or dict depending on GCP credentials presence
    if res is not None:
        assert "anomaly_score" in res

def test_kms_service_signing():
    sha256_sample = "a"*64
    kms_res = KMSService.sign_digest(sha256_sample)
    assert "signer" in kms_res
    assert "signature" in kms_res
    assert len(kms_res["signature"]) > 0

def test_gcp_sensor_service():
    sensor = GCPSensorService()
    assert sensor.interface == "eth0"
    assert "backend_url" in sensor.__dict__

def test_iap_middleware_auth():
    # Test request with simulated Cloud IAP header
    headers = {"x-goog-authenticated-user-email": "accounts.google.com:soc_lead@enterprise.gcp"}
    response = client.get("/", headers=headers)
    assert response.status_code == 200
