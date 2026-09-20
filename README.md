# SecureMailScope — SIH26159

**AI-Assisted Cryptographic Security Posture Assessment & Digital Forensics Platform for Secure Email Communications**

> **Smart India Hackathon Problem Statement SIH26159**

SecureMailScope is a production-quality passive network-forensics platform that analyzes captured network traffic (.pcap / .pcapng files) containing **SMTP, IMAP, and POP3 communications** and automatically assesses the cryptographic security posture of enterprise email infrastructure.

---

## Key Features

1. **Passive Email Network Forensics**: Reconstructs TCP email streams across SMTP (25, 587, 465), IMAP (143, 993), and POP3 (110, 995).
2. **Encryption Transition Visualizer**: Tracks protocol state transitions: `PLAINTEXT -> STARTTLS -> TLS HANDSHAKE -> ENCRYPTED SESSION`.
3. **Cryptographic TLS & Cert Inspector**: Extracts ClientHello / ServerHello TLS parameters, cipher suites, key exchange algorithms, and X.509 certificate chains (SANs, validity, key length, signature algorithm).
4. **Explainable AI & Isolation Forest**: Combines baseline cybersecurity risk rules with Scikit-Learn Isolation Forest anomaly detection to identify abnormal TLS behaviors with transparent feature importances.
5. **0-100 Security Posture Calculator**: Multi-category weighted scoring across TLS Security, Certificate Health, Cryptographic Strength, Protocol Configuration, Anomaly Exposure, and Evidence Integrity.
6. **Blockchain Evidence Ledger**: Immutable SHA-256 evidence integrity ledger with hash verification endpoints for legal non-repudiation.
7. **Built-in 12-Scenario Demo Dataset**: Single-click "Load Demo Investigation" button populating instant SOC metrics across 12 distinct realistic scenarios.

---

## Tech Stack

- **Backend**: Python 3.11, FastAPI, SQLAlchemy, Pydantic, Scapy, Cryptography, Scikit-Learn, ReportLab.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (SOC Dark Theme), Recharts, Lucide Icons.
- **Database**: SQLite (Local Dev) / PostgreSQL (Production ready).

---

## Quickstart

```bash
# 1. Backend Setup
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# 2. Frontend Setup (in a separate terminal)
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` and click **"Load Demo Investigation"**.
