# Smart India Hackathon (SIH) Official Idea Presentation Format

> **Mandatory Template Format**: 6 Slides  
> **Problem Statement ID**: SIH26159  
> **PS Title**: AI-Assisted Cryptographic Security Posture Assessment & Forensics Platform for Secure Email Communications  
> **Category**: Software  
> **Domain**: Cybersecurity / SOC Forensics  
> **Live Web App**: [https://securemailscope-frontend-454069237379.us-central1.run.app](https://securemailscope-frontend-454069237379.us-central1.run.app)  
> **Live API Backend**: [https://securemailscope-backend-454069237379.us-central1.run.app](https://securemailscope-backend-454069237379.us-central1.run.app)  
> **GitHub Repository**: [https://github.com/Asachdeva001/securemailscope](https://github.com/Asachdeva001/securemailscope)

---

## 📄 SLIDE 1: Title Page (Official Mandatory Header)

* **Problem Statement ID**: SIH26159
* **Problem Statement Title**: AI-Assisted Cryptographic Security Posture Assessment & Forensics Platform for Secure Email Communications
* **Team Name**: [Insert Your Team Name Here]
* **Category**: Software
* **Domain / Theme**: Cybersecurity & SOC Forensics
* **Institute / College Name**: [Insert Your College / Institute Name Here]
* **Team Leader & Members**: [Insert Names & Roles]

---

## 📄 SLIDE 2: Idea Title & Proposed Solution

### **Idea Title**: SecureMailScope — Enterprise Hybrid Passive Security Sensor & Forensic SOC Platform

### **The Problem Addressed**:
1. **Email Protocol Vulnerabilities**: Email transport protocols (`SMTP`, `IMAP`, `POP3`) are heavily targeted by Man-in-the-Middle (MITM) STARTTLS downgrade attacks, unencrypted plaintext exposures, weak ciphers, and rogue/expired certificates.
2. **SOC Visibility Blindspot**: Traditional perimeter firewalls check basic packet headers but lack deep TLS handshake analysis (`ClientHello`/`ServerHello`) and X.509 certificate validation.
3. **Lack of Legal Non-Repudiation**: Forensic evidence gathered during email security breaches often lacks a tamper-proof cryptographic audit trail admissible in legal or compliance proceedings.

### **Our Proposed Solution (SecureMailScope)**:
- An out-of-band **Hybrid Passive Capture Security Sensor** that intercept and reassemble email transport flows in real time.
- Performs **deep packet inspection**, **X.509 certificate chain validation**, **cryptographic risk rule scoring**, **machine learning anomaly detection**, and logs evidence to an **immutable SHA-256 Merkle tree WORM ledger**.

### **Uniqueness & Innovation (USP)**:
- **Zero Latency Penalty**: Operates out-of-band via VPC Packet Mirroring; completely invisible to attackers and does not delay live email delivery.
- **AI Anomaly Detection**: 30-day baseline Isolation Forest model detecting zero-day protocol downgrades and decision function depth outliers.
- **Cryptographic Chain of Custody**: SHA-256 Merkle root tree linked to Write-Once-Read-Many (WORM) storage for 100% tamper-evident audit packages.

---

## 📄 SLIDE 3: Technical Approach & Architecture

### **Hybrid Passive Capture Architecture (3 Deployment Modalities)**:
SecureMailScope supports three ingestion entry points, all feeding into the **exact same unified 6-stage forensic pipeline**:

```
[ Primary: Cloud VPC Packet Mirroring ] ──┐
                                          │
[ Secondary: Live NIC Sensor Probe ] ─────┼──> [ Unified 6-Stage Forensic Analysis Engine ]
                                          │     ├── 1. TCP Flow Assembly & STARTTLS
[ Fallback: Ad-Hoc PCAP File Upload ] ────┘     ├── 2. TLS ContentType 22 & X.509 Extractor
                                                ├── 3. Cryptographic Risk Engine (Ciphers/PFS)
                                                ├── 4. Isolation Forest AI Anomaly Detector
                                                ├── 5. SHA-256 Merkle Tree WORM Ledger
                                                └── 6. Signed PDF Report & SOC Triage
```

1. **Primary (Enterprise Cloud)**: **GCP / AWS VPC Packet Mirroring** — Out-of-band TAP mirroring from cloud mail gateways to Compute Engine collector with 0.0ms latency.
2. **Secondary (On-Premises)**: **Live NIC Sensor Probe** — Promiscuous mode socket listener (`eth0`) bound to physical/virtual mail gateways.
3. **Fallback (Forensic Lab)**: **Ad-Hoc PCAP/PCAPNG Upload** — Drag-and-drop diagnostic file upload for offline triage of historical network captures.

### **Technology Stack**:
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons.
- **Backend API**: Python 3.11, FastAPI, Uvicorn, Scapy, dpkt, OpenSSL, `cryptography.x509`.
- **Machine Learning**: Scikit-Learn (`IsolationForest`), NumPy, GCP Vertex AI Endpoints.
- **Cloud Infrastructure**: GCP Cloud Run, Compute Engine, Cloud Storage (GCS WORM Bucket), Cloud KMS.

---

## 📄 SLIDE 4: Feasibility & Viability

### **Technical Feasibility**:
- **Proven Microservices Architecture**: Fully built, tested, and containerized using Docker & Nginx.
- **Live GCP Deployment**: Currently running live on GCP Cloud Run (`securemailscope-frontend-454069237379.us-central1.run.app`).
- **High Throughput & Scalability**: Asynchronous FastAPI backend capable of processing thousands of TCP email flows per second.

### **Risk Analysis & Mitigation Strategies**:

| Potential Risk / Challenge | Mitigation Strategy Implemented in SecureMailScope |
| :--- | :--- |
| **High Latency Impact on Live Mail** | Passive out-of-band VPC packet mirroring ensures **0.0ms latency penalty** on mail delivery. |
| **GCP Cloud Service Downtime** | Automatic local fallbacks for AI (Scikit-Learn `IsolationForest`), KMS (Local RSA OpenSSL signing), and WORM storage (`worm_ledger.jsonl`). |
| **Encrypted Payload Inspection Privacy** | Inspects only transport layer handshakes (`ClientHello`/`ServerHello`) and X.509 certificates without decrypting email body contents. |

---

## 📄 SLIDE 5: Impact & Benefits

### **Impact on Target Audience (SOC Teams & Enterprises)**:
- **Instant Cryptographic Visibility**: Provides Security Operations Center (SOC) analysts with a high-density vulnerability triage dashboard.
- **Mitigates STARTTLS Downgrade Attacks**: Automatically flags plaintext fallbacks, weak ciphers (e.g. RC4, 3DES), and deprecated TLS versions (1.0/1.1).
- **Automated Compliance Auditing**: One-click generation of NIST SP 800-52 & RFC 8314 compliant signed ReportLab PDF forensic packages.

### **Broader Benefits**:
- **Legal Non-Repudiation**: SHA-256 Merkle root WORM ledger ensures evidence presented during security breaches is 100% tamper-evident and court-admissible.
- **Zero Hardware Lock-In**: Deploys seamlessly on GCP, AWS, or on-premises linux servers.

---

## 📄 SLIDE 6: Research, References & Proof of Work

### **Proof of Work & Working Prototype**:
- 🌐 **Live Web Application**: [https://securemailscope-frontend-454069237379.us-central1.run.app](https://securemailscope-frontend-454069237379.us-central1.run.app)
- ⚙️ **Live API Engine**: [https://securemailscope-backend-454069237379.us-central1.run.app](https://securemailscope-backend-454069237379.us-central1.run.app)
- 💻 **GitHub Code Repository**: [https://github.com/Asachdeva001/securemailscope](https://github.com/Asachdeva001/securemailscope)

### **Standards & References**:
1. **RFC 8314**: Cleartext Considered Obsolete — Use of Transport Layer Security (TLS) for Email Submission and Access.
2. **NIST SP 800-52 Rev. 2**: Guidelines for the Selection, Configuration, and Use of Transport Layer Security (TLS) Implementations.
3. **Scikit-Learn Isolation Forest Algorithm**: Liu, Ting, and Zhou (2008) — Isolation-based Anomaly Detection.
