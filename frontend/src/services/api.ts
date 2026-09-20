import axios from 'axios';
import {
  Investigation,
  EmailSession,
  Finding,
  Certificate,
  AIAnalysis,
  DashboardSummary,
  BlockchainRecord,
  Report,
  Evidence
} from '../types';

const API_BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string) || '/api/v1';



export const api = {
  // Investigations
  getInvestigations: async (): Promise<Investigation[]> => {
    const res = await axios.get(`${API_BASE_URL}/investigations/`);
    return res.data;
  },

  getInvestigation: async (id: string): Promise<Investigation> => {
    const res = await axios.get(`${API_BASE_URL}/investigations/${id}`);
    return res.data;
  },

  // Dashboard
  getDashboardSummary: async (investigationId?: string): Promise<DashboardSummary> => {
    const url = investigationId
      ? `${API_BASE_URL}/dashboard/${investigationId}`
      : `${API_BASE_URL}/dashboard/`;
    const res = await axios.get(url);
    return res.data;
  },

  // Demo Dataset Trigger
  loadDemoDataset: async (): Promise<Investigation> => {
    const res = await axios.post(`${API_BASE_URL}/demo/load`);
    return res.data;
  },

  // PCAP Upload
  uploadPCAP: async (file: File, investigationName?: string): Promise<Investigation> => {
    const formData = new FormData();
    formData.append('file', file);
    if (investigationName) {
      formData.append('investigation_name', investigationName);
    }
    const res = await axios.post(`${API_BASE_URL}/evidence/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Sessions
  getSessions: async (params?: { investigation_id?: string; protocol?: string; tls_version?: string; risk_level?: string }): Promise<EmailSession[]> => {
    const res = await axios.get(`${API_BASE_URL}/sessions/`, { params });
    return res.data;
  },

  getSession: async (id: string): Promise<EmailSession> => {
    const res = await axios.get(`${API_BASE_URL}/sessions/${id}`);
    return res.data;
  },

  // Findings
  getFindings: async (params?: { investigation_id?: string; category?: string; severity?: string }): Promise<Finding[]> => {
    const res = await axios.get(`${API_BASE_URL}/findings/`, { params });
    return res.data;
  },

  // Certificates
  getCertificates: async (params?: { expiration_status?: string; chain_status?: string }): Promise<Certificate[]> => {
    const res = await axios.get(`${API_BASE_URL}/certificates/`, { params });
    return res.data;
  },

  // AI Center
  getRiskAnalyses: async (): Promise<AIAnalysis[]> => {
    const res = await axios.get(`${API_BASE_URL}/ai/risk`);
    return res.data;
  },

  getAnomalies: async (): Promise<AIAnalysis[]> => {
    const res = await axios.get(`${API_BASE_URL}/ai/anomalies`);
    return res.data;
  },

  // Blockchain Ledger
  getBlockchainRecords: async (investigationId?: string): Promise<BlockchainRecord[]> => {
    const res = await axios.get(`${API_BASE_URL}/blockchain/`, {
      params: { investigation_id: investigationId }
    });
    return res.data;
  },

  verifyEvidenceHash: async (entityId: string, hashValue: string) => {
    const res = await axios.post(`${API_BASE_URL}/blockchain/verify`, null, {
      params: { entity_id: entityId, hash_value: hashValue }
    });
    return res.data;
  },

  // Reports
  generateReport: async (investigationId: string, reportType: 'HTML' | 'JSON'): Promise<Report> => {
    const formData = new FormData();
    formData.append('investigation_id', investigationId);
    formData.append('report_type', reportType);
    const res = await axios.post(`${API_BASE_URL}/reports/generate`, formData);
    return res.data;
  },

  getReportDownloadUrl: (reportId: string): string => {
    return `${API_BASE_URL}/reports/${reportId}`;
  }
};
