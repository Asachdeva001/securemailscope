import os
import pytest
from datetime import datetime
from app.services.tls.tls_service import TLSService
from app.services.certificates.cert_service import CertService
from app.services.ai.ai_engine import ai_engine
from app.services.blockchain.blockchain_service import BlockchainService
from app.services.reporting.report_generator import ReportGenerator

def test_tls_binary_parser():
    # Construct a minimal TLS Record Header for ContentType 22 (Handshake), Version 0x0303 (TLS 1.2)
    fake_tls_record = b"\x16\x03\x03\x00\x10\x01\x00\x00\x0c\x03\x03\x01\x02\x03\x04" + b"\x00"*10
    parsed = TLSService.parse_tls_handshake(fake_tls_record)
    assert "tls_version" in parsed
    assert "cipher_suite" in parsed
    assert "extensions" in parsed

def test_cert_service_parsing():
    cert_info = CertService.parse_x509_bytes(b"", fallback_sni="smtp.production.org")
    assert cert_info["subject"] == "CN=smtp.production.org"
    assert cert_info["public_key_algorithm"] == "RSA"
    assert cert_info["expiration_status"] in ["Valid", "Expiring Soon", "Expired"]

def test_ai_engine_baseline_model():
    # Verify trained baseline model file exists
    model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app", "services", "ai", "isolation_forest_model.joblib")
    assert os.path.exists(model_path)

    # Run inference against persistent baseline model
    session_data = {
        "protocol": "SMTP",
        "encryption_state": "ENCRYPTED",
        "tls_version": "TLS 1.3",
        "cipher_suite": "TLS_AES_256_GCM_SHA384"
    }
    features, risk_prob, anomaly_score, risk_lvl, explanation = ai_engine.analyze(session_data)
    assert 0.0 <= anomaly_score <= 1.0
    assert 0.0 <= risk_prob <= 1.0

def test_merkle_tree_and_worm_ledger():
    leaf_hashes = ["1111"*16, "2222"*16, "3333"*16, "4444"*16]
    merkle_root, levels = BlockchainService.build_merkle_tree(leaf_hashes)
    assert len(merkle_root) == 64
    assert len(levels) >= 2

    # Test WORM ledger append
    worm_receipt = BlockchainService.append_to_worm_ledger({
        "test": "integration",
        "timestamp": datetime.utcnow().isoformat(),
        "merkle_root": merkle_root
    })
    assert len(worm_receipt) == 64

def test_pdf_report_generation():
    inv_data = {"id": "inv-test-pdf", "name": "PDF Production Test", "analyst": "Forensic Specialist"}
    sessions = [{"protocol": "SMTP", "src": "10.0.0.1:25", "dst": "10.0.0.2:25", "tls": "TLS 1.3", "cipher": "TLS_AES_256_GCM_SHA384", "risk": "Low"}]
    findings = [{"severity": "Medium", "title": "Missing PFS", "category": "Crypto", "recommendation": "Use ECDHE"}]
    certs = []
    posture = {"overall_score": 85, "breakdown": {"tls_security": 90, "certificate_security": 80, "cryptographic_strength": 85}}
    blockchain_records = [{"hash": "abc"*20}]

    filepath, pdf_hash = ReportGenerator.generate_pdf_report(inv_data, sessions, findings, certs, posture, blockchain_records)
    assert os.path.exists(filepath)
    assert filepath.endswith(".pdf")
    assert len(pdf_hash) == 64
