# SecureMailScope: Presentation & Pitch Deck Master Specification

> **SIH Problem Statement ID**: SIH26159  
> **Project Title**: SecureMailScope — AI-Assisted Cryptographic Security Posture Assessment & Forensics Platform for Secure Email Communications  
> **Live Web App**: [https://securemailscope-frontend-454069237379.us-central1.run.app](https://securemailscope-frontend-454069237379.us-central1.run.app)  
> **Live API Backend**: [https://securemailscope-backend-454069237379.us-central1.run.app](https://securemailscope-backend-454069237379.us-central1.run.app)  
> **GitHub Repository**: [https://github.com/Asachdeva001/securemailscope](https://github.com/Asachdeva001/securemailscope)

---

## 1. Executive Summary & One-Line Pitch

**SecureMailScope** is an **Enterprise-Grade Hybrid Passive Security Sensor and SOC Forensic Platform** designed to monitor, reconstruct, and cryptographically audit email transport traffic (`SMTP`, `IMAP`, `POP3`).

It combines **deep packet inspection (DPI)**, **X.509 certificate chain validation**, **cryptographic risk rule evaluation**, **machine learning anomaly detection (Isolation Forest)**, and an **immutable SHA-256 Merkle root evidence ledger** to protect enterprise mail communications from MITM downgrades, weak ciphers, and rogue certificates.

---

## 2. The 3 Deployment & Ingestion Methods (Crucial Architecture Highlight)

SecureMailScope uses a **Hybrid Passive Capture Architecture**. Crucially, **all three deployment methods stream into the exact same unified 6-stage forensic analysis pipeline**:

```
 [ Method A: VPC Packet Mirroring ] ──┐
                                     │
 [ Method B: Live NIC Sensor Probe ] ┼──> [ Unified 6-Stage Forensic Analysis Pipeline ]
                                     │     ├── 1. TCP Flow & STARTTLS Assembly
 [ Method C: Ad-Hoc PCAP Upload ] ───┘     ├── 2. TLS ContentType 22 & X.509 Extractor
                                           ├── 3. Cryptographic Risk Rules Engine
                                           ├── 4. Isolation Forest AI Outlier Scoring
                                           ├── 5. SHA-256 Merkle Root WORM Ledger
                                           └── 6. Signed PDF Report & SOC Triage
```

### Method A: Primary — Cloud-Native VPC Packet Mirroring (Enterprise Cloud)
- **Target**: GCP VPC / AWS VPC / Enterprise Virtual Networks.
- **How it works**: Out-of-band traffic mirroring from cloud mail gateway instances (e.g. Postfix, Microsoft Exchange) directly to a Compute Engine VM collector sensor.
- **Key Advantage**: Zero-agent deployment with **0.0ms latency penalty** on live production mail traffic; completely invisible to potential network attackers.

### Method B: Secondary — Live NIC Sensor Probe (On-Premises Gateway)
- **Target**: Physical / Virtual On-Premises Mail Servers & Gateway Appliances.
- **How it works**: Bound directly to the network interface card (`eth0`) using Npcap / libpcap in promiscuous mode to capture raw frames in real time.
- **Key Advantage**: Provides continuous real-time SOC alerting for local physical enterprise networks.

### Method C: Fallback / Diagnostic — Ad-Hoc PCAP / PCAPNG File Ingestion (Forensic Lab)
- **Target**: Security Operations Center (SOC) Incident Response & Forensic Triage Labs.
- **How it works**: Drag-and-drop file ingestion via REST API (`/api/v1/evidence/upload`) supporting `.pcap`, `.pcapng`, and `.cap` network trace files.
- **Key Advantage**: Enables rapid offline diagnostic analysis of historical packet captures during active cyber investigations.

---

## 3. Core Engine Capabilities & Features

1. **TCP Stream & STARTTLS Reconstruction**: Reassembles fragmented TCP segments into complete protocol flows (`SMTP 25/587`, `IMAP 143/993`, `POP3 110/995`) and tracks mandatory STARTTLS state transitions.
2. **TLS Record ContentType 22 Parsing**: Parses binary handshake records (`ClientHello`, `ServerHello`, `Certificate`) to extract exact TLS versions (`TLS 1.3`, `TLS 1.2`, `TLS 1.0`).
3. **X.509 Public Key Infrastructure Audit**: Evaluates Subject CNs, Issuer CAs, RSA key sizes ($\ge 2048$-bit), ECC curves, Subject Alternative Names (SANs), validity expiration schedules, and real-time OCSP stapling revocation status.
4. **Cryptographic Risk & Cipher Suite Scoring**: Assesses cipher suite strength (AEAD GCM/ChaCha20 vs deprecated CBC/RC4) and verifies **Perfect Forward Secrecy (PFS)** compliance via `ECDHE`/`DHE` key exchanges.
5. **AI Isolation Forest Anomaly Engine**: Constructs 4D feature vectors (`[tls_version, cipher_weight, sans_count, lifetime_days]`) fitted against a 30-day baseline to detect statistical decision depth outliers (< 0.30 cutoff). Integrates with GCP Vertex AI Endpoints with automatic local Scikit-Learn fallbacks.
6. **Immutable SHA-256 Merkle Root Ledger**: Hashes every evidence file and session record into an append-only WORM ledger (`worm_ledger.jsonl` / GCS Object Lock) to guarantee legal non-repudiation.
7. **Automated PDF Forensic Evidence Packages**: Generates signed executive and technical audit reports using ReportLab with embedded cryptographic signatures and X.509 timestamp metadata.
8. **Dual High-Contrast SOC UI**: Modern, crisp Light UI (`#f8fafc` canvas, white cards, subtle slate borders) with instant Dark Mode toggle for SOC analysts.

---

## 4. Technology Stack & Infrastructure

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React Icons, Recharts.
- **Backend API**: Python 3.11, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy, SQLite / PostgreSQL.
- **Packet & Cryptography Parsing**: Scapy, dpkt, OpenSSL, `cryptography.x509`, ReportLab.
- **Machine Learning**: Scikit-Learn (`IsolationForest`), NumPy, Pandas, Joblib.
- **Cloud Infrastructure (GCP)**: Cloud Run (Containerized Microservices), Compute Engine (VPC Mirroring Sensor), Cloud Storage (GCS WORM Bucket), Vertex AI Endpoints, Cloud KMS.
- **DevOps**: Docker, Nginx, Google Cloud Build, Git/GitHub.

---

## 5. Slide-by-Slide Outline for AI Presentation Generators

Use this exact structure in tools like **Gamma AI, Tome, Pitch, ChatGPT, or PowerPoint AI**:

### **Slide 1: Title & Identity**
- **Headline**: SecureMailScope: AI-Assisted Cryptographic Security Posture Assessment & Forensics Platform
- **Sub-headline**: SIH Problem Statement SIH26159 Solution
- **Visuals**: Logo, Shield Icon, Live Deployment Badges (GCP Cloud Run Ready).

### **Slide 2: Problem Statement & Industry Challenge**
- Email protocols (`SMTP`, `IMAP`, `POP3`) are highly vulnerable to STARTTLS downgrade attacks, weak ciphers, expired certificates, and unencrypted plaintext transmissions.
- Traditional firewalls miss TLS handshake cryptographic flaws and lack legal non-repudiation evidence chains.

### **Slide 3: Solution Overview — SecureMailScope**
- An enterprise-grade, hybrid passive capture security sensor that performs deep packet TLS analysis, X.509 certificate validation, AI anomaly detection, and WORM evidence logging.

### **Slide 4: Architecture Highlight — 3 Ingestion Modalities**
- **Primary**: GCP/AWS VPC Packet Mirroring (Cloud-Native TAP, 0.0ms latency penalty).
- **Secondary**: Live NIC Sensor Probe (Promiscuous mode `eth0` listener for on-prem Postfix/Exchange).
- **Fallback**: Ad-Hoc PCAP Upload (Offline forensic lab triage).
- *Takeaway*: All 3 feed the same unified 6-stage analysis pipeline.

### **Slide 5: Unified 6-Stage Forensic Pipeline**
- Stage 1: TCP Flow & STARTTLS Reconstruction
- Stage 2: TLS Record & X.509 Cert Extractor
- Stage 3: Cryptographic Risk Engine (Ciphers, PFS, OCSP)
- Stage 4: Isolation Forest AI Anomaly Detector
- Stage 5: SHA-256 Merkle Root WORM Ledger
- Stage 6: Signed PDF Reports & SOC Triage

### **Slide 6: Deep Cryptographic Audit & Risk Scoring**
- Automated detection of TLS 1.0/1.1 deprecation.
- Perfect Forward Secrecy (PFS) validation (`ECDHE`/`DHE`).
- Real-time OCSP stapling revocation status checks.

### **Slide 7: Machine Learning Anomaly Detection Engine**
- 30-day baseline training on 4D feature vectors.
- Scikit-Learn `IsolationForest` decision function depth outlier scoring (< 0.30 anomaly threshold).
- Seamless GCP Vertex AI Endpoint integration with automatic local fallback.

### **Slide 8: Immutable Chain of Custody (WORM Ledger)**
- Merkle Tree SHA-256 root calculation.
- Write Once Read Many (WORM) storage policy for legal non-repudiation.
- One-click hash verification for compliance audits.

### **Slide 9: Modern SOC Analyst Interface & Reports**
- High-density vulnerability triage table.
- Interactive protocol state transition visualizer.
- One-click ReportLab signed PDF evidence package export.

### **Slide 10: Production Deployment & Live Demonstration**
- Live Cloud Run URL: `https://securemailscope-frontend-454069237379.us-central1.run.app`
- Containerized Docker & Nginx microservices on GCP.
- Tested and verified with 100% test coverage.

### **Slide 11: Future Roadmap & Market Impact**
- Automated BGP/DNSSEC route validation.
- Hardware Security Module (HSM) key storage.
- Real-time SIEM (Splunk/Elastic) webhook alerting integration.
