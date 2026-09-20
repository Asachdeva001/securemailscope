import hashlib
import uuid
from typing import List, Dict, Any

class CryptoRiskRules:
    @staticmethod
    def evaluate_session(session_data: dict, cert_data: dict = None) -> List[dict]:
        findings = []
        investigation_id = session_data.get("investigation_id")
        session_id = session_data.get("id")
        protocol = session_data.get("protocol", "SMTP")
        encryption_state = session_data.get("encryption_state", "PLAINTEXT")
        tls_version = session_data.get("tls_version")
        cipher_suite = session_data.get("cipher_suite")
        key_exchange = session_data.get("key_exchange")

        # 1. Plaintext Email Transmission
        if encryption_state == "PLAINTEXT" or tls_version is None:
            findings.append({
                "id": str(uuid.uuid4()),
                "investigation_id": investigation_id,
                "session_id": session_id,
                "category": "Protocol Config",
                "severity": "Critical",
                "title": f"Unencrypted Plaintext {protocol} Transmission",
                "description": f"Email session on port {session_data.get('destination_port')} transmits credentials and email payloads over unencrypted plaintext.",
                "evidence": f"Protocol: {protocol}, Endpoints: {session_data.get('source_ip')}:{session_data.get('source_port')} -> {session_data.get('destination_ip')}:{session_data.get('destination_port')}, STARTTLS: Not executed.",
                "recommendation": f"Enforce mandatory STARTTLS or use implicit TLS/SSL wrapper (Port 465 for SMTPS, 993 for IMAPS, 995 for POP3S).",
                "confidence": 1.0,
                "hash": hashlib.sha256(f"PLAINTEXT-{session_id}".encode()).hexdigest(),
                "blockchain_status": "REGISTERED"
            })

        # 2. Deprecated TLS Versions (TLS 1.0 / TLS 1.1)
        if tls_version in ["TLS 1.0", "TLS 1.1"]:
            findings.append({
                "id": str(uuid.uuid4()),
                "investigation_id": investigation_id,
                "session_id": session_id,
                "category": "TLS Security",
                "severity": "High",
                "title": f"Deprecated Protocol Version ({tls_version})",
                "description": f"Session uses deprecated {tls_version} which is vulnerable to POODLE, BEAST, and cryptographic downgrades.",
                "evidence": f"Negotiated TLS Version: {tls_version}, Cipher: {cipher_suite or 'Unknown'}.",
                "recommendation": "Disable TLS 1.0 and TLS 1.1 on mail server configuration. Upgrade endpoint to support minimum TLS 1.2 or TLS 1.3.",
                "confidence": 1.0,
                "hash": hashlib.sha256(f"DEPRECATED_TLS-{session_id}-{tls_version}".encode()).hexdigest(),
                "blockchain_status": "REGISTERED"
            })

        # 3. Weak Cipher Suite
        weak_ciphers = ["RC4", "3DES", "DES", "NULL", "EXPORT", "MD5", "Anon", "RC2"]
        if cipher_suite and any(w in cipher_suite.upper() for w in weak_ciphers):
            findings.append({
                "id": str(uuid.uuid4()),
                "investigation_id": investigation_id,
                "session_id": session_id,
                "category": "Cryptographic Weakness",
                "severity": "High",
                "title": "Insecure or Weak Cipher Suite Negotiated",
                "description": f"Negotiated cipher suite '{cipher_suite}' relies on legacy or broken encryption primitives.",
                "evidence": f"Cipher Suite: {cipher_suite}.",
                "recommendation": "Reconfigure server cipher suite preferences to restrict support to modern AEAD ciphers (e.g. AES-GCM, CHACHA20-POLY1305).",
                "confidence": 0.95,
                "hash": hashlib.sha256(f"WEAK_CIPHER-{session_id}-{cipher_suite}".encode()).hexdigest(),
                "blockchain_status": "REGISTERED"
            })

        # 4. Lack of Perfect Forward Secrecy (PFS)
        if tls_version in ["TLS 1.2", "TLS 1.1", "TLS 1.0"] and cipher_suite:
            if not any(pfs in (key_exchange or cipher_suite).upper() for pfs in ["ECDHE", "DHE"]):
                findings.append({
                    "id": str(uuid.uuid4()),
                    "investigation_id": investigation_id,
                    "session_id": session_id,
                    "category": "Cryptographic Weakness",
                    "severity": "Medium",
                    "title": "Lack of Perfect Forward Secrecy (PFS)",
                    "description": "Session key exchange does not utilize Ephemeral Diffie-Hellman (ECDHE/DHE). If server private key is compromised in the future, past recorded email traffic can be decrypted.",
                    "evidence": f"Key Exchange: {key_exchange or 'Static RSA'}, Cipher: {cipher_suite}.",
                    "recommendation": "Prioritize ECDHE/DHE key exchange algorithms in server TLS configuration.",
                    "confidence": 0.90,
                    "hash": hashlib.sha256(f"NO_PFS-{session_id}".encode()).hexdigest(),
                    "blockchain_status": "REGISTERED"
                })

        # 5. Certificate Findings
        if cert_data:
            # Expired Certificate
            if cert_data.get("expiration_status") == "Expired":
                findings.append({
                    "id": str(uuid.uuid4()),
                    "investigation_id": investigation_id,
                    "session_id": session_id,
                    "category": "Certificate",
                    "severity": "Critical",
                    "title": "Expired X.509 Digital Certificate",
                    "description": f"Server presented an expired TLS certificate (Expired on {cert_data.get('validity_end')}).",
                    "evidence": f"Subject: {cert_data.get('subject')}, Serial: {cert_data.get('serial_number')}, Valid Until: {cert_data.get('validity_end')}.",
                    "recommendation": "Renew and re-install a valid X.509 certificate immediately.",
                    "confidence": 1.0,
                    "hash": hashlib.sha256(f"CERT_EXPIRED-{session_id}".encode()).hexdigest(),
                    "blockchain_status": "REGISTERED"
                })

            # Weak Public Key (RSA < 2048 bit)
            if cert_data.get("public_key_algorithm") == "RSA" and cert_data.get("public_key_size", 2048) < 2048:
                findings.append({
                    "id": str(uuid.uuid4()),
                    "investigation_id": investigation_id,
                    "session_id": session_id,
                    "category": "Certificate",
                    "severity": "High",
                    "title": f"Weak Public Key Length ({cert_data.get('public_key_size')}-bit RSA)",
                    "description": f"Public key size of {cert_data.get('public_key_size')} bits is vulnerable to mathematical factorization attacks.",
                    "evidence": f"Public Key: RSA {cert_data.get('public_key_size')} bits.",
                    "recommendation": "Re-issue certificate using at least RSA 2048-bit or ECDSA P-256 key.",
                    "confidence": 1.0,
                    "hash": hashlib.sha256(f"WEAK_KEY-{session_id}".encode()).hexdigest(),
                    "blockchain_status": "REGISTERED"
                })

            # Weak Signature Algorithm (SHA1 / MD5)
            sig_alg = cert_data.get("signature_algorithm", "").lower()
            if "sha1" in sig_alg or "md5" in sig_alg:
                findings.append({
                    "id": str(uuid.uuid4()),
                    "investigation_id": investigation_id,
                    "session_id": session_id,
                    "category": "Certificate",
                    "severity": "High",
                    "title": f"Deprecated Certificate Signature Algorithm ({cert_data.get('signature_algorithm')})",
                    "description": f"Certificate signature uses collision-vulnerable hash algorithm {cert_data.get('signature_algorithm')}.",
                    "evidence": f"Signature Algorithm: {cert_data.get('signature_algorithm')}.",
                    "recommendation": "Re-issue certificate signed using SHA-256 or stronger digest algorithm.",
                    "confidence": 1.0,
                    "hash": hashlib.sha256(f"WEAK_SIG-{session_id}".encode()).hexdigest(),
                    "blockchain_status": "REGISTERED"
                })

            # Self-Signed / Untrusted Chain
            if cert_data.get("certificate_chain_status") in ["Self-Signed", "Untrusted"]:
                findings.append({
                    "id": str(uuid.uuid4()),
                    "investigation_id": investigation_id,
                    "session_id": session_id,
                    "category": "Certificate",
                    "severity": "Medium",
                    "title": f"Untrusted or Self-Signed Certificate ({cert_data.get('certificate_chain_status')})",
                    "description": "Certificate is not signed by a trusted public Certificate Authority (CA) or intermediate chain is incomplete.",
                    "evidence": f"Issuer: {cert_data.get('issuer')}, Subject: {cert_data.get('subject')}.",
                    "recommendation": "Replace self-signed certificates with certificates from a publicly trusted CA or deploy enterprise root CA to trust store.",
                    "confidence": 0.95,
                    "hash": hashlib.sha256(f"UNTRUSTED_CERT-{session_id}".encode()).hexdigest(),
                    "blockchain_status": "REGISTERED"
                })

        return findings
