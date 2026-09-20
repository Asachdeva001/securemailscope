# SIH Jury Demonstration Script — SecureMailScope (SIH26159)

## Predefined 12-Scenario Synthetic Dataset

The system includes 12 realistic synthetic email traffic scenarios:

1. **Secure SMTP**: TLS 1.3, AES-256-GCM, Valid DigiCert X.509 cert.
2. **Secure IMAP**: TLS 1.3, CHACHA20-POLY1305, Valid ECDSA cert.
3. **Secure POP3**: TLS 1.2, ECDHE-RSA-AES128-GCM.
4. **Deprecated TLS**: Deprecated TLS 1.0 negotiated on SMTP Port 25.
5. **Weak Cipher**: RC4-128 cipher negotiated on IMAP Port 143.
6. **Expired Certificate**: X.509 certificate expired 15 days ago.
7. **Invalid Certificate**: Self-signed untrusted certificate.
8. **Weak Public Key**: RSA 1024-bit public key.
9. **Missing Forward Secrecy**: Static RSA key exchange (No ECDHE/DHE).
10. **Plaintext Unencrypted Anomaly**: Plaintext SMTP email payload without STARTTLS upgrade.
11. **Legacy Cipher**: 3DES cipher negotiated on POP3 Port 110.
12. **Clean Enterprise Baseline**: TLS 1.3 ECDSA P-384 modern baseline.

---

## 5-Minute Jury Presentation Steps

1. Launch application and click **"Load Demo Investigation"**.
2. Show **Overall Security Posture Score (78/100)** and categorical breakdown cards.
3. Scroll to **Prioritized Cryptographic Findings** table showing Critical/High threats.
4. Click **"Email Sessions"** in sidebar and inspect a specific session to visualize the `PLAINTEXT -> STARTTLS -> TLS HANDSHAKE -> ENCRYPTED` timeline.
5. Click **"AI Risk & Anomalies"** to demonstrate the explainable Scikit-Learn Isolation Forest feature weight matrix.
6. Click **"Evidence Integrity"** to click **"Verify Hash"** and prove non-repudiation on the immutable SHA-256 blockchain ledger.
7. Click **"Forensic Reports"** to generate and download an HTML forensic report.
