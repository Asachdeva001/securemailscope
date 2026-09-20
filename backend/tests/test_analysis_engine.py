import pytest
from app.services.crypto.risk_rules import CryptoRiskRules
from app.services.ai.ai_engine import ai_engine
from app.services.scoring.posture_calculator import PostureCalculator
from app.services.blockchain.blockchain_service import BlockchainService

def test_crypto_risk_rules_plaintext():
    session_data = {
        "investigation_id": "test-inv-1",
        "id": "session-1",
        "protocol": "SMTP",
        "encryption_state": "PLAINTEXT",
        "destination_port": 25,
        "source_ip": "10.0.0.1",
        "source_port": 5000,
        "destination_ip": "10.0.0.2"
    }
    findings = CryptoRiskRules.evaluate_session(session_data)
    assert len(findings) >= 1
    assert any(f["severity"] == "Critical" and "Plaintext" in f["title"] for f in findings)

def test_deprecated_tls_finding():
    session_data = {
        "investigation_id": "test-inv-2",
        "id": "session-2",
        "protocol": "IMAP",
        "encryption_state": "ENCRYPTED",
        "tls_version": "TLS 1.0",
        "cipher_suite": "TLS_RSA_WITH_AES_128_CBC_SHA",
        "destination_port": 143,
        "source_ip": "10.0.0.1",
        "source_port": 5001,
        "destination_ip": "10.0.0.2"
    }
    findings = CryptoRiskRules.evaluate_session(session_data)
    assert any(f["severity"] == "High" and "Deprecated" in f["title"] for f in findings)

def test_ai_engine_analysis():
    session_data = {
        "protocol": "SMTP",
        "encryption_state": "ENCRYPTED",
        "tls_version": "TLS 1.3",
        "cipher_suite": "TLS_AES_256_GCM_SHA384"
    }
    features, risk_prob, anomaly_score, risk_lvl, explanation = ai_engine.analyze(session_data)
    assert "tls_version_score" in features
    assert 0.0 <= anomaly_score <= 1.0
    assert risk_lvl in ["Low", "Medium", "High", "Critical"]

def test_blockchain_hash_calculation():
    payload = {"filename": "test.pcap", "sha256": "abcdef1234567890"}
    h1 = BlockchainService.calculate_hash(payload)
    h2 = BlockchainService.calculate_hash(payload)
    assert h1 == h2
    assert len(h1) == 64
