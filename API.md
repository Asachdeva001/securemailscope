# API Endpoint Documentation — SecureMailScope

Base URL: `http://localhost:8000/api/v1`

## Endpoints

### 1. Investigations
- `GET /investigations/` — List all audit investigations.
- `GET /investigations/{id}` — Get investigation details.
- `POST /investigations/` — Create new investigation.

### 2. Evidence & PCAP Ingestion
- `POST /evidence/upload` — Ingest `.pcap` or `.pcapng` file and run analysis pipeline.
- `GET /evidence/{id}` — Get evidence metadata.
- `GET /evidence/{id}/verify` — Verify evidence SHA-256 hash on blockchain ledger.

### 3. Email Sessions
- `GET /sessions/` — List reconstructed email sessions (Filter by protocol, risk_level, tls_version).
- `GET /sessions/{id}` — Detailed session view (TLS handshake, certificate, encryption timeline).

### 4. Findings
- `GET /findings/` — List prioritized threat findings and recommendations.

### 5. Certificates
- `GET /certificates/` — List X.509 certificates and chain validation findings.

### 6. AI & Anomalies
- `GET /ai/risk` — Get supervised risk classification list.
- `GET /ai/anomalies` — Get Isolation Forest anomaly scores.

### 7. SOC Dashboard
- `GET /dashboard/` — Get active investigation summary metrics.

### 8. Forensic Reports
- `POST /reports/generate` — Generate JSON or HTML forensic report.
- `GET /reports/{id}` — Download report file.

### 9. Blockchain Provenance
- `GET /blockchain/` — Query immutable hash ledger records.
- `POST /blockchain/verify` — Verify hash against ledger block.

### 10. Demo Mode
- `POST /demo/load` — Instantly load predefined 12-scenario synthetic audit dataset.
