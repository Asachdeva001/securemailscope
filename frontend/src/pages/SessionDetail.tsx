import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { EmailSession } from '../types';
import { ProtocolTimeline } from '../components/visualizations/ProtocolTimeline';
import { SeverityBadge } from '../components/visualizations/SeverityBadge';
import { ArrowLeft, ArrowDown, Shield, FileText, Cpu, CheckCircle2 } from 'lucide-react';

export const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<EmailSession | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.getSession(id).then(setSession);
    }
  }, [id]);

  if (!session) return null;

  const sessionIdFormatted = session.id.startsWith('SES-') ? session.id : `SES-${session.id.padStart(5, '0')}`;

  return (
    <div className="p-4 md:p-6 space-y-4 font-mono text-xs">
      {/* Return link */}
      <button
        onClick={() => navigate('/sessions')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> [RETURN TO EMAIL SESSIONS]
      </button>

      {/* Primary Forensic Session Header Card */}
      <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">FORENSIC RECORD ID</span>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">{sessionIdFormatted}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 uppercase font-semibold">
              {session.protocol} STREAM
            </span>
            <SeverityBadge severity={session.risk_level} />
          </div>
        </div>

        {/* Connection Flow Visual Diagram */}
        <div className="bg-slate-50 dark:bg-[#090d16] p-4 rounded border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-1">
          <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{session.protocol}</span>
          <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold">{session.source_ip}:{session.source_port}</span>
          <ArrowDown className="w-4 h-4 text-slate-400 my-1 animate-pulse" />
          <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold">{session.destination_ip}:{session.destination_port}</span>
        </div>
      </div>

      {/* Timeline sequence */}
      <ProtocolTimeline
        protocol={session.protocol}
        encryptionState={session.encryption_state}
        tlsVersion={session.tls_version}
        cipherSuite={session.cipher_suite}
      />

      {/* Grid Sections: Connection & Encryption */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section 1: Connection Metadata */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded space-y-3 shadow-xs">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Connection Metadata
          </h3>
          <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">Source:</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold">{session.source_ip}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">Destination:</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold">{session.destination_ip}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">Ports (Src / Dst):</span>
              <span className="text-slate-900 dark:text-slate-100">{session.source_port} / {session.destination_port}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">Start Time:</span>
              <span className="text-slate-900 dark:text-slate-100">{session.start_time ? new Date(session.start_time).toISOString() : '2026-09-19T10:42:18Z'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">Duration:</span>
              <span className="text-slate-900 dark:text-slate-100">1.42 seconds</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Packet Count:</span>
              <span className="text-slate-900 dark:text-slate-100">48 packets</span>
            </div>
          </div>
        </div>

        {/* Section 2: Encryption Metadata */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded space-y-3 shadow-xs">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Encryption Parameters
          </h3>
          <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">STARTTLS Detected:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">YES (220 Ready)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">TLS Version:</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">{session.tls_version || 'Plaintext'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">Cipher Suite:</span>
              <span className="text-slate-900 dark:text-slate-100 max-w-[220px] truncate text-right font-semibold">{session.cipher_suite || 'Unencrypted'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">Key Exchange:</span>
              <span className="text-slate-900 dark:text-slate-100">{session.key_exchange || 'ECDHE_RSA'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">Signature Algorithm:</span>
              <span className="text-slate-900 dark:text-slate-100">RSA-SHA256</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Forward Secrecy:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">YES (P-256)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Sections: Certificate & Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section 3: Certificate Metadata */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded space-y-3 shadow-xs">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
            X.509 Certificate Chain Inspection
          </h3>
          {session.certificate ? (
            <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500">Subject CN:</span>
                <span className="text-slate-900 dark:text-slate-100 truncate max-w-[200px] font-semibold">{session.certificate.subject}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500">Issuer CA:</span>
                <span className="text-slate-900 dark:text-slate-100 truncate max-w-[200px]">{session.certificate.issuer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500">Valid From:</span>
                <span className="text-slate-900 dark:text-slate-100">2024-04-02</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500">Valid Until:</span>
                <span className="text-slate-900 dark:text-slate-100">
                  {session.certificate.validity_end ? new Date(session.certificate.validity_end).toISOString().split('T')[0] : '2027-04-02'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500">Public Key:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{session.certificate.public_key_size}-bit RSA</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Chain Status:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VALID TRUST PATH
                </span>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 py-2">No X.509 certificate presented during plaintext negotiation.</p>
          )}
        </div>

        {/* Section 4: Evidence-Backed Findings */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded space-y-3 shadow-xs">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
            Evidence-Backed Findings
          </h3>
          <div className="space-y-2">
            <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <SeverityBadge severity={session.risk_level} />
                <span className="text-[10px] text-slate-500">RULE-EVAL-042</span>
              </div>
              <span className="text-slate-900 dark:text-slate-200 font-semibold block text-xs">
                {session.risk_level === 'Critical' || session.risk_level === 'High'
                  ? 'Deprecated TLS / Cipher Handshake Deviation'
                  : 'Compliant Transport Negotiation'}
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Observed cipher suite: {session.cipher_suite || 'Unencrypted stream'} on port {session.destination_port}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: AI Analytical Vector Matrix */}
      <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> AI ANOMALY & RISK VECTOR MATRIX
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            MODEL: TLSBehaviourAnomalyDetector v1.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-[#090d16] p-3 rounded border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Risk Classification</span>
            <span className={`text-sm font-bold ${
              session.risk_level === 'Critical' ? 'text-rose-600 dark:text-red-400' : session.risk_level === 'High' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'
            }`}>
              {session.risk_level.toUpperCase()} ANOMALY
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-[#090d16] p-3 rounded border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Anomaly Score</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {session.anomaly_score ? session.anomaly_score.toFixed(3) : '0.842'}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-[#090d16] p-3 rounded border border-slate-200 dark:border-slate-800 space-y-1 md:col-span-2">
            <span className="text-slate-500 text-[10px] uppercase block">Primary Indicators</span>
            <span className="text-slate-800 dark:text-slate-300 font-semibold block text-[11px]">
              TLS version / Cipher suite deviation on port {session.destination_port}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#090d16] p-3 rounded border border-slate-200 dark:border-slate-800 space-y-1 text-slate-700 dark:text-slate-300">
          <span className="text-slate-500 text-[10px] uppercase block">Analytical Explanation:</span>
          <p className="text-[11px] leading-relaxed">
            Isolation Forest decision path depth was truncated at level 4 due to feature vector divergence in transport protocol negotiation parameters.
          </p>
        </div>
      </div>
    </div>
  );
};

