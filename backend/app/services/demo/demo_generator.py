import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.investigation import Investigation, Evidence
from app.models.session import EmailSession, TLSHandshake, Certificate
from app.models.finding import Finding, AIAnalysis
from app.services.crypto.risk_rules import CryptoRiskRules
from app.services.ai.ai_engine import ai_engine
from app.services.scoring.posture_calculator import PostureCalculator
from app.services.blockchain.blockchain_service import BlockchainService

class DemoGeneratorService:
    @classmethod
    def load_demo_dataset(cls, db: Session) -> Investigation:
        inv_id = str(uuid.uuid4())
        
        # 1. Main Investigation
        inv = Investigation(
            id=inv_id,
            name="Enterprise Global Mail Security Forensics Audit (Demo PCAP)",
            description="Synthetic multi-protocol email security posture assessment containing 12 distinct cryptographic scenarios.",
            status="Analysis Complete",
            source_type="Synthetic Demo Dataset",
            analyst="Senior SOC Lead",
            created_at=datetime.utcnow()
        )
        db.add(inv)
        db.flush()

        # 2. Evidence
        evidence = Evidence(
            id=str(uuid.uuid4()),
            investigation_id=inv.id,
            filename="synthetic_enterprise_email_dump.pcapng",
            file_path="/data/demo/synthetic_enterprise_email_dump.pcapng",
            file_size=15428912, # 15.4 MB
            sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            upload_timestamp=datetime.utcnow() - timedelta(minutes=15),
            capture_timestamp=datetime.utcnow() - timedelta(hours=2),
            analyzer_version="1.0.0",
            integrity_status="VERIFIED"
        )
        db.add(evidence)
        db.flush()

        BlockchainService.register_record(
            db=db, record_type="EVIDENCE", entity_id=evidence.id, investigation_id=inv.id,
            payload={"filename": evidence.filename, "sha256": evidence.sha256, "file_size": evidence.file_size}
        )

        # 12 Predefined Scenarios
        scenarios = [
            # 1. Secure SMTP (TLS 1.3, AES-256-GCM, Valid Cert)
            {
                "protocol": "SMTP", "src_ip": "10.0.12.45", "src_port": 54102, "dst_ip": "192.168.1.10", "dst_port": 587,
                "encryption_state": "ENCRYPTED", "tls_version": "TLS 1.3", "cipher_suite": "TLS_AES_256_GCM_SHA384", "key_exchange": "ECDHE-X25519",
                "cert": {"subject": "CN=smtp.enterprise.com", "issuer": "CN=DigiCert Global Root CA", "serial": "91823901", "val_start": datetime.utcnow() - timedelta(days=60), "val_end": datetime.utcnow() + timedelta(days=300), "pk_alg": "RSA", "pk_size": 3072, "sig_alg": "sha256WithRSAEncryption", "chain": "Valid", "exp": "Valid", "sans": ["smtp.enterprise.com"]}
            },
            # 2. Secure IMAP (TLS 1.3, CHACHA20-POLY1305, Valid Cert)
            {
                "protocol": "IMAP", "src_ip": "10.0.12.88", "src_port": 61204, "dst_ip": "192.168.1.12", "dst_port": 993,
                "encryption_state": "ENCRYPTED", "tls_version": "TLS 1.3", "cipher_suite": "TLS_CHACHA20_POLY1305_SHA256", "key_exchange": "ECDHE-P256",
                "cert": {"subject": "CN=imap.enterprise.com", "issuer": "CN=DigiCert Global Root CA", "serial": "91823902", "val_start": datetime.utcnow() - timedelta(days=30), "val_end": datetime.utcnow() + timedelta(days=330), "pk_alg": "ECDSA", "pk_size": 256, "sig_alg": "ecdsa-with-SHA256", "chain": "Valid", "exp": "Valid", "sans": ["imap.enterprise.com"]}
            },
            # 3. Secure POP3 (TLS 1.2, ECDHE-RSA-AES128-GCM)
            {
                "protocol": "POP3", "src_ip": "10.0.14.12", "src_port": 49150, "dst_ip": "192.168.1.14", "dst_port": 995,
                "encryption_state": "ENCRYPTED", "tls_version": "TLS 1.2", "cipher_suite": "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256", "key_exchange": "ECDHE-P256",
                "cert": {"subject": "CN=pop3.enterprise.com", "issuer": "CN=Sectigo RSA CA", "serial": "91823903", "val_start": datetime.utcnow() - timedelta(days=90), "val_end": datetime.utcnow() + timedelta(days=270), "pk_alg": "RSA", "pk_size": 2048, "sig_alg": "sha256WithRSAEncryption", "chain": "Valid", "exp": "Valid", "sans": ["pop3.enterprise.com"]}
            },
            # 4. Deprecated TLS (TLS 1.0 on SMTP)
            {
                "protocol": "SMTP", "src_ip": "10.0.15.99", "src_port": 50112, "dst_ip": "192.168.1.20", "dst_port": 25,
                "encryption_state": "ENCRYPTED", "tls_version": "TLS 1.0", "cipher_suite": "TLS_RSA_WITH_AES_128_CBC_SHA", "key_exchange": "RSA",
                "cert": {"subject": "CN=legacy-mail.enterprise.com", "issuer": "CN=Internal Enterprise SubCA", "serial": "91823904", "val_start": datetime.utcnow() - timedelta(days=400), "val_end": datetime.utcnow() + timedelta(days=100), "pk_alg": "RSA", "pk_size": 2048, "sig_alg": "sha256WithRSAEncryption", "chain": "Valid", "exp": "Valid", "sans": ["legacy-mail.enterprise.com"]}
            },
            # 5. Weak Cipher (RC4 on IMAP)
            {
                "protocol": "IMAP", "src_ip": "10.0.18.22", "src_port": 53001, "dst_ip": "192.168.1.22", "dst_port": 143,
                "encryption_state": "ENCRYPTED", "tls_version": "TLS 1.0", "cipher_suite": "TLS_RSA_WITH_RC4_128_SHA", "key_exchange": "RSA",
                "cert": {"subject": "CN=old-imap.enterprise.com", "issuer": "CN=Internal Enterprise SubCA", "serial": "91823905", "val_start": datetime.utcnow() - timedelta(days=200), "val_end": datetime.utcnow() + timedelta(days=165), "pk_alg": "RSA", "pk_size": 2048, "sig_alg": "sha1WithRSAEncryption", "chain": "Valid", "exp": "Valid", "sans": ["old-imap.enterprise.com"]}
            },
            # 6. Expired Certificate
            {
                "protocol": "SMTP", "src_ip": "10.0.20.10", "src_port": 51000, "dst_ip": "192.168.1.30", "dst_port": 587,
                "encryption_state": "ENCRYPTED", "tls_version": "TLS 1.2", "cipher_suite": "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384", "key_exchange": "ECDHE-P256",
                "cert": {"subject": "CN=expired-smtp.enterprise.com", "issuer": "CN=Let's Encrypt Authority X3", "serial": "91823906", "val_start": datetime.utcnow() - timedelta(days=180), "val_end": datetime.utcnow() - timedelta(days=15), "pk_alg": "RSA", "pk_size": 2048, "sig_alg": "sha256WithRSAEncryption", "chain": "Valid", "exp": "Expired", "sans": ["expired-smtp.enterprise.com"]}
            },
            # 7. Invalid Certificate (Self-Signed)
            {
                "protocol": "POP3", "src_ip": "10.0.22.44", "src_port": 52110, "dst_ip": "192.168.1.32", "dst_port": 110,
                "encryption_state": "ENCRYPTED", "tls_version": "TLS 1.2", "cipher_suite": "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256", "key_exchange": "ECDHE-P256",
                "cert": {"subject": "CN=selfsigned.local", "issuer": "CN=selfsigned.local", "serial": "91823907", "val_start": datetime.utcnow() - timedelta(days=10), "val_end": datetime.utcnow() + timedelta(days=350), "pk_alg": "RSA", "pk_size": 2048, "sig_alg": "sha256WithRSAEncryption", "chain": "Self-Signed", "exp": "Valid", "sans": ["selfsigned.local"]}
            },
            # 8. Weak Key (RSA 1024-bit)
            {
                "protocol": "SMTP", "src_ip": "10.0.25.11", "src_port": 55100, "dst_ip": "192.168.1.40", "dst_port": 25,
                "encryption_state": "ENCRYPTED", "tls_version": "TLS 1.2", "cipher_suite": "TLS_RSA_WITH_AES_128_GCM_SHA256", "key_exchange": "RSA",
                "cert": {"subject": "CN=weak-key.enterprise.com", "issuer": "CN=Legacy CA", "serial": "91823908", "val_start": datetime.utcnow() - timedelta(days=50), "val_end": datetime.utcnow() + timedelta(days=300), "pk_alg": "RSA", "pk_size": 1024, "sig_alg": "sha1WithRSAEncryption", "chain": "Valid", "exp": "Valid", "sans": ["weak-key.enterprise.com"]}
            },
            # 9. Missing Forward Secrecy (Static RSA)
            {
                "protocol": "IMAP", "src_ip": "10.0.30.15", "src_port": 58900, "dst_ip": "192.168.1.50", "dst_port": 993,
                "encryption_state": "ENCRYPTED", "tls_version": "TLS 1.2", "cipher_suite": "TLS_RSA_WITH_AES_256_GCM_SHA384", "key_exchange": "RSA",
                "cert": {"subject": "CN=static-rsa.enterprise.com", "issuer": "CN=DigiCert Global Root CA", "serial": "91823909", "val_start": datetime.utcnow() - timedelta(days=20), "val_end": datetime.utcnow() + timedelta(days=340), "pk_alg": "RSA", "pk_size": 2048, "sig_alg": "sha256WithRSAEncryption", "chain": "Valid", "exp": "Valid", "sans": ["static-rsa.enterprise.com"]}
            },
            # 10. Suspicious TLS Anomaly (Plaintext Unencrypted Transmission)
            {
                "protocol": "SMTP", "src_ip": "192.168.100.5", "src_port": 41200, "dst_ip": "192.168.1.60", "dst_port": 25,
                "encryption_state": "PLAINTEXT", "tls_version": None, "cipher_suite": None, "key_exchange": None,
                "cert": None
            },
            # 11. Mixed Security (3DES Cipher)
            {
                "protocol": "POP3", "src_ip": "10.0.35.80", "src_port": 49800, "dst_ip": "192.168.1.70", "dst_port": 995,
                "encryption_state": "ENCRYPTED", "tls_version": "TLS 1.1", "cipher_suite": "TLS_RSA_WITH_3DES_EDE_CBC_SHA", "key_exchange": "RSA",
                "cert": {"subject": "CN=pop3-legacy.enterprise.com", "issuer": "CN=Sectigo RSA CA", "serial": "91823911", "val_start": datetime.utcnow() - timedelta(days=120), "val_end": datetime.utcnow() + timedelta(days=240), "pk_alg": "RSA", "pk_size": 2048, "sig_alg": "sha256WithRSAEncryption", "chain": "Valid", "exp": "Valid", "sans": ["pop3-legacy.enterprise.com"]}
            },
            # 12. Clean Enterprise Baseline (TLS 1.3 ECDSA P-384)
            {
                "protocol": "SMTP", "src_ip": "10.0.40.100", "src_port": 62000, "dst_ip": "192.168.1.10", "dst_port": 587,
                "encryption_state": "ENCRYPTED", "tls_version": "TLS 1.3", "cipher_suite": "TLS_AES_256_GCM_SHA384", "key_exchange": "ECDHE-P384",
                "cert": {"subject": "CN=smtp-cloud.enterprise.com", "issuer": "CN=DigiCert Global Root CA", "serial": "91823912", "val_start": datetime.utcnow() - timedelta(days=10), "val_end": datetime.utcnow() + timedelta(days=355), "pk_alg": "ECDSA", "pk_size": 384, "sig_alg": "ecdsa-with-SHA384", "chain": "Valid", "exp": "Valid", "sans": ["smtp-cloud.enterprise.com"]}
            }
        ]

        all_findings = []
        all_certs = []
        all_sessions = []

        for sc in scenarios:
            cert_obj = None
            if sc.get("cert"):
                cd = sc["cert"]
                cert_obj = Certificate(
                    id=str(uuid.uuid4()),
                    subject=cd["subject"],
                    issuer=cd["issuer"],
                    serial_number=cd["serial"],
                    validity_start=cd["val_start"],
                    validity_end=cd["val_end"],
                    public_key_algorithm=cd["pk_alg"],
                    public_key_size=cd["pk_size"],
                    signature_algorithm=cd["sig_alg"],
                    sans=cd["sans"],
                    certificate_chain_status=cd["chain"],
                    expiration_status=cd["exp"],
                    trust_findings=[]
                )
                db.add(cert_obj)
                db.flush()
                all_certs.append(cert_obj)

            sess_obj = EmailSession(
                id=str(uuid.uuid4()),
                investigation_id=inv.id,
                protocol=sc["protocol"],
                source_ip=sc["src_ip"],
                source_port=sc["src_port"],
                destination_ip=sc["dst_ip"],
                destination_port=sc["dst_port"],
                start_time=datetime.utcnow() - timedelta(minutes=5),
                end_time=datetime.utcnow(),
                encryption_state=sc["encryption_state"],
                tls_version=sc["tls_version"],
                cipher_suite=sc["cipher_suite"],
                key_exchange=sc["key_exchange"],
                certificate_id=cert_obj.id if cert_obj else None,
            )
            db.add(sess_obj)
            db.flush()

            if sc["tls_version"]:
                tls_handshake = TLSHandshake(
                    id=str(uuid.uuid4()),
                    session_id=sess_obj.id,
                    tls_version=sc["tls_version"],
                    cipher_suite=sc["cipher_suite"],
                    supported_versions=[sc["tls_version"]],
                    key_exchange=sc["key_exchange"],
                    signature_algorithm="rsa_pss_rsae_sha256" if "RSA" in sc.get("cipher_suite", "") else "ecdsa_secp256r1_sha256",
                    extensions={"sni": cert_obj.sans[0] if cert_obj else "mail.local"},
                    sni=cert_obj.sans[0] if cert_obj else "mail.local",
                    anomalies=[]
                )
                db.add(tls_handshake)
                db.flush()

            # Rule Findings
            s_dict = {
                "investigation_id": inv.id, "id": sess_obj.id, "protocol": sess_obj.protocol,
                "encryption_state": sess_obj.encryption_state, "tls_version": sess_obj.tls_version,
                "cipher_suite": sess_obj.cipher_suite, "key_exchange": sess_obj.key_exchange,
                "source_ip": sess_obj.source_ip, "source_port": sess_obj.source_port,
                "destination_ip": sess_obj.destination_ip, "destination_port": sess_obj.destination_port
            }
            c_dict = {
                "subject": cert_obj.subject, "issuer": cert_obj.issuer, "serial_number": cert_obj.serial_number,
                "validity_end": cert_obj.validity_end.strftime("%Y-%m-%d"), "public_key_algorithm": cert_obj.public_key_algorithm,
                "public_key_size": cert_obj.public_key_size, "signature_algorithm": cert_obj.signature_algorithm,
                "certificate_chain_status": cert_obj.certificate_chain_status, "expiration_status": cert_obj.expiration_status
            } if cert_obj else None

            session_findings = CryptoRiskRules.evaluate_session(s_dict, c_dict)

            for f in session_findings:
                finding_obj = Finding(**f)
                db.add(finding_obj)
                db.flush()
                all_findings.append(finding_obj)
                BlockchainService.register_record(
                    db=db, record_type="FINDING", entity_id=finding_obj.id, investigation_id=inv.id, payload=f
                )

            # AI Analysis
            features, risk_prob, anomaly_score, risk_lvl, explanation = ai_engine.analyze(
                session_data=s_dict, cert_data=c_dict, findings_count=len(session_findings)
            )

            sess_obj.anomaly_score = anomaly_score
            sess_obj.risk_score = round(risk_prob * 100.0, 1)
            sess_obj.risk_level = risk_lvl

            ai_rec = AIAnalysis(
                id=str(uuid.uuid4()),
                session_id=sess_obj.id,
                model_version="1.0-IsolationForest-RuleHybrid",
                features=features,
                risk_probability=risk_prob,
                anomaly_score=anomaly_score,
                classification=risk_lvl,
                explanation=explanation,
                timestamp=datetime.utcnow()
            )
            db.add(ai_rec)
            all_sessions.append(sess_obj)

        # Calculate Overall Security Posture
        posture_score, _ = PostureCalculator.calculate_posture(all_sessions, all_findings, all_certs)
        inv.overall_security_score = posture_score

        db.commit()
        db.refresh(inv)
        return inv
