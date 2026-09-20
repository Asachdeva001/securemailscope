# System Architecture — SecureMailScope (SIH26159)

```
[ Upload PCAP / Demo Trigger ]
              │
              ▼
    ┌──────────────────┐
    │ Backend Ingestion│ ──► SHA-256 Hashing ──► Store Evidence Record
    └─────────┬────────┘
              │
              ▼
    ┌──────────────────┐
    │ Protocol & Flow  │ ──► Reconstruct TCP Streams (SMTP/IMAP/POP3)
    │ Engine (Scapy)   │ ──► Detect STARTTLS & Encryption Transitions
    └─────────┬────────┘
              │
              ▼
    ┌──────────────────┐
    │ Cryptographic &  │ ──► Parse TLS Handshakes (Cipher Suites, TLS 1.0-1.3)
    │ Cert Analyzer    │ ──► Extract & Validate X.509 Certificate Chains
    └─────────┬────────┘
              │
              ▼
    ┌──────────────────┐
    │ AI / ML Engine   │ ──► Layer 1: Rule-Based Cyber Risk Rules
    │ (Scikit-Learn)   │ ──► Layer 2: Isolation Forest Anomaly & Feature Weighting
    └─────────┬────────┘
              │
              ▼
    ┌──────────────────┐
    │ Scoring & Ledger │ ──► Security Posture Calculation (0-100)
    │ Integrity Engine │ ──► Blockchain Evidence Registration & Hash Verification
    └─────────┬────────┘
              │
              ▼
    ┌──────────────────┐
    │ SOC Dashboard    │ ──► Dark SOC Theme UI with Protocol Timelines, Cert Radar,
    │ (React + Vite)   │     Session Explorers, AI Explainability & Report Download
    └──────────────────┘
```

## Security Posture Scoring Weight Distribution
- TLS Security Score: **25%**
- Certificate Health Score: **20%**
- Cryptographic Strength Score: **20%**
- Protocol Configuration Score: **15%**
- Anomaly Exposure Score: **10%**
- Evidence Integrity Score: **10%**
