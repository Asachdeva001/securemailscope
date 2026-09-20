export interface Investigation {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  status: string;
  source_type: string;
  analyst: string;
  overall_security_score: number;
}

export interface Evidence {
  id: string;
  investigation_id: string;
  filename: string;
  file_path: string;
  file_size: number;
  sha256: string;
  upload_timestamp: string;
  capture_timestamp?: string;
  analyzer_version: string;
  integrity_status: string;
}

export interface Certificate {
  id: string;
  subject: string;
  issuer: string;
  serial_number: string;
  validity_start: string;
  validity_end: string;
  public_key_algorithm: string;
  public_key_size: number;
  signature_algorithm: string;
  sans: string[];
  certificate_chain_status: string;
  expiration_status: string;
  trust_findings: string[];
}

export interface TLSHandshake {
  id: string;
  session_id: string;
  tls_version?: string;
  cipher_suite?: string;
  supported_versions?: string[];
  key_exchange?: string;
  signature_algorithm?: string;
  extensions?: Record<string, any>;
  sni?: string;
  alpn?: string;
  anomalies?: string[];
}

export interface EmailSession {
  id: string;
  investigation_id: string;
  protocol: 'SMTP' | 'IMAP' | 'POP3';
  source_ip: string;
  source_port: number;
  destination_ip: string;
  destination_port: number;
  start_time: string;
  end_time: string;
  encryption_state: 'PLAINTEXT' | 'STARTTLS_INITIATED' | 'TLS_HANDSHAKE' | 'ENCRYPTED';
  tls_version?: string;
  cipher_suite?: string;
  key_exchange?: string;
  certificate_id?: string;
  anomaly_score: number;
  risk_score: number;
  risk_level: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  certificate?: Certificate;
  tls_handshake?: TLSHandshake;
}

export interface Finding {
  id: string;
  investigation_id: string;
  session_id?: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  title: string;
  description: string;
  evidence: string;
  recommendation: string;
  confidence: number;
  created_at: string;
  hash: string;
  blockchain_status: string;
}

export interface AIAnalysis {
  id: string;
  session_id: string;
  model_version: string;
  features: Record<string, any>;
  risk_probability: number;
  anomaly_score: number;
  classification: string;
  explanation: {
    model: string;
    top_risk_contributors: Array<{
      feature: string;
      weight: number;
      impact: string;
    }>;
    anomaly_explanation: string;
  };
  timestamp: string;
}

export interface DashboardSummary {
  investigation_id: string;
  investigation_name: string;
  overall_score: number;
  score_breakdown: {
    tls_security: number;
    certificate_security: number;
    cryptographic_strength: number;
    protocol_configuration: number;
    anomaly_exposure: number;
    evidence_integrity: number;
  };
  total_sessions: number;
  protocol_distribution: Record<string, number>;
  tls_distribution: Record<string, number>;
  cipher_strength_distribution: Record<string, number>;
  risk_distribution: Record<string, number>;
  certificate_health: Record<string, number>;
  critical_findings_count: number;
  high_findings_count: number;
  medium_findings_count: number;
  low_findings_count: number;
  anomalous_sessions_count: number;
  evidence_verification_status: string;
}

export interface BlockchainRecord {
  id: string;
  record_type: string;
  entity_id: string;
  investigation_id: string;
  hash_value: string;
  previous_block_hash: string;
  block_index: string;
  timestamp: string;
  analyzer_version: string;
  transaction_tx: string;
  metadata_json?: Record<string, any>;
}

export interface Report {
  id: string;
  investigation_id: string;
  report_type: string;
  generated_at: string;
  report_hash: string;
  file_path: string;
  blockchain_reference?: string;
}
