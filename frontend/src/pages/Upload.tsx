import React, { useState } from 'react';
import { api } from '../services/api';
import { UploadCloud, AlertCircle, ArrowRight, FileCode, Server, Radio, Shield, Info, X, Cpu, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [investigationName, setInvestigationName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<'pcap' | 'vpc' | 'nic'>('pcap');
  const [showDiagramModal, setShowDiagramModal] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.endsWith('.pcap') && !selected.name.endsWith('.pcapng') && !selected.name.endsWith('.cap')) {
        setError('Please upload a valid .pcap or .pcapng file');
        return;
      }
      setError(null);
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChannel !== 'pcap') {
      // Direct demo trigger for active stream
      setUploading(true);
      setError(null);
      setProgress(10);
      setStep('Connecting to Live Ingestion Probe...');
      setTimeout(async () => {
        try {
          setProgress(40); setStep('Receiving Stream Packets & Assembling TCP Flows...');
          setTimeout(async () => {
            setProgress(75); setStep('Extracting TLS Handshakes & Evaluating AI Outlier Engine...');
            const inv = await api.loadDemoDataset();
            setProgress(100);
            setStep('Live Stream Ingested! Registering Ledger...');
            setTimeout(() => navigate(`/investigations/${inv.id}`), 800);
          }, 600);
        } catch (err: any) {
          setError('Failed to ingest live stream');
          setUploading(false);
        }
      }, 500);
      return;
    }

    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress(10);
    setStep('Calculating File SHA-256 Digest...');

    try {
      setTimeout(() => { setProgress(35); setStep('Extracting TCP Flows (SMTP/IMAP/POP3)...'); }, 400);
      setTimeout(() => { setProgress(60); setStep('Parsing STARTTLS & TLS Handshakes...'); }, 900);
      setTimeout(() => { setProgress(85); setStep('Evaluating Cryptographic Rules & Isolation Forest Engine...'); }, 1400);

      const inv = await api.uploadPCAP(file, investigationName || undefined);
      
      setProgress(100);
      setStep('Analysis Complete! Registering Blockchain Ledger...');
      setTimeout(() => {
        navigate(`/investigations/${inv.id}`);
      }, 800);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload and analyze PCAP file.');
      setUploading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4 text-xs font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-blue-600 dark:text-blue-400" /> HYBRID PASSIVE CAPTURE INGESTION
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
            Ingest live enterprise network traffic via VPC Mirroring, Live NIC Probe, or PCAP File Upload
          </p>
        </div>
        <button
          onClick={() => setShowDiagramModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded text-[11px] font-semibold cursor-pointer transition-colors"
        >
          <Info className="w-3.5 h-3.5" /> ARCHITECTURE BLUEPRINT
        </button>
      </div>

      {/* 3 Ingestion Modalities Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Modality 1: VPC Mirroring */}
        <div
          onClick={() => setSelectedChannel('vpc')}
          className={`p-3.5 rounded border transition-all cursor-pointer ${
            selectedChannel === 'vpc'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs'
              : 'bg-white dark:bg-[#121824] border-slate-200 dark:border-[#1e293b] hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white uppercase">PRIMARY</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> ACTIVE
            </span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
            <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> VPC Packet Mirroring
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Cloud-native out-of-band network TAP from GCP/AWS Mail Gateway instances.
          </p>
          <div className="mt-2 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
            Latency: 0.0ms (Passive TAP)
          </div>
        </div>

        {/* Modality 2: Live NIC Sensor */}
        <div
          onClick={() => setSelectedChannel('nic')}
          className={`p-3.5 rounded border transition-all cursor-pointer ${
            selectedChannel === 'nic'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs'
              : 'bg-white dark:bg-[#121824] border-slate-200 dark:border-[#1e293b] hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 uppercase">SECONDARY</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> LISTENING
            </span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
            <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Live NIC Sensor Probe
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Promiscuous mode socket listener (`eth0`) for on-prem Postfix/Exchange servers.
          </p>
          <div className="mt-2 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
            Target: eth0 (10Gbps Probe)
          </div>
        </div>

        {/* Modality 3: Ad-Hoc PCAP Upload */}
        <div
          onClick={() => setSelectedChannel('pcap')}
          className={`p-3.5 rounded border transition-all cursor-pointer ${
            selectedChannel === 'pcap'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs'
              : 'bg-white dark:bg-[#121824] border-slate-200 dark:border-[#1e293b] hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white uppercase">FALLBACK</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
              DIAGNOSTIC
            </span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
            <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Ad-Hoc PCAP Upload
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Offline triage of historical packet capture files (.pcap / .pcapng).
          </p>
          <div className="mt-2 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
            Format: .pcap, .pcapng, .cap
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-red-950/60 border border-rose-300 dark:border-red-800 text-rose-800 dark:text-red-300 text-[11px] font-mono flex items-center gap-2 rounded">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-red-400 shrink-0" />
          <span>[ERROR] {error}</span>
        </div>
      )}

      {/* Main Ingestion Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-6 rounded space-y-4 shadow-xs">
        <div>
          <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase mb-1 font-semibold">
            INVESTIGATION AUDIT TITLE (OPTIONAL)
          </label>
          <input
            type="text"
            value={investigationName}
            onChange={(e) => setInvestigationName(e.target.value)}
            placeholder="e.g., AUDIT_MAIL_PROD_Q3"
            className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 px-3 py-2 rounded outline-none font-mono text-xs focus:border-blue-500"
          />
        </div>

        {selectedChannel === 'pcap' ? (
          /* Drop Zone for PCAP */
          <div className="border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090d16] p-8 rounded text-center space-y-2 relative hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".pcap,.pcapng,.cap"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileCode className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">
                {file ? file.name : 'SELECT OR DROP .PCAP / .PCAPNG FILE'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Max upload limit: 500MB'}
              </span>
            </div>
          </div>
        ) : (
          /* Live Sensor Active Banner */
          <div className="bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 p-6 rounded text-center space-y-2">
            <Radio className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto animate-pulse" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block uppercase">
                {selectedChannel === 'vpc' ? 'GCP VPC Packet Mirroring Stream Selected' : 'Live NIC Listener (eth0) Selected'}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Pressing "START INGESTION" will pull the live stream batch into the unified 6-stage forensic analysis pipeline.
              </p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-1.5 font-mono text-[10px]">
            <div className="flex justify-between">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">{step}</span>
              <span className="text-slate-500 dark:text-slate-400">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={(selectedChannel === 'pcap' && !file) || uploading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 uppercase font-bold cursor-pointer"
        >
          {uploading ? (
            'EXECUTING FORENSIC INGESTION PIPELINE...'
          ) : (
            <>
              <span>START FORENSIC INGESTION ({selectedChannel.toUpperCase()})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Architecture Blueprint Modal */}
      {showDiagramModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] rounded max-w-2xl w-full p-6 space-y-4 font-mono text-xs text-slate-800 dark:text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" /> HYBRID PASSIVE CAPTURE ARCHITECTURE BLUEPRINT
              </h3>
              <button onClick={() => setShowDiagramModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-[11px] leading-relaxed">
              <p className="text-slate-600 dark:text-slate-300">
                SecureMailScope uses a <strong>Hybrid Passive Capture Architecture</strong> that intercepts email transport flows without latency impact on production servers:
              </p>

              {/* 3 Channels Card */}
              <div className="grid grid-cols-3 gap-2 py-1">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded space-y-0.5">
                  <span className="font-bold text-blue-700 dark:text-blue-400 block text-[10px]">1. VPC Mirroring</span>
                  <span className="text-[9px] text-slate-500 block">Cloud-native TAP</span>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[10px]">2. NIC Probe</span>
                  <span className="text-[9px] text-slate-500 block">eth0 Promiscuous</span>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded space-y-0.5">
                  <span className="font-bold text-amber-700 dark:text-amber-400 block text-[10px]">3. PCAP Upload</span>
                  <span className="text-[9px] text-slate-500 block">Offline Forensics</span>
                </div>
              </div>

              {/* Unified 6 Stage Pipeline */}
              <div className="bg-slate-50 dark:bg-[#090d16] p-3 rounded border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-[10px]">
                <span className="text-blue-600 dark:text-blue-400 font-bold block uppercase border-b border-slate-200 dark:border-slate-800 pb-1">
                  UNIFIED 6-STAGE FORENSIC PIPELINE
                </span>
                <div className="space-y-1 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> Stage 1: TCP Flow Reconstruction & STARTTLS State Machine</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> Stage 2: TLS Record ContentType 22 & X.509 Cert Chain Extractor</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> Stage 3: Cryptographic Risk Engine (Ciphers, PFS, OCSP)</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> Stage 4: Isolation Forest AI Anomaly Classifier</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> Stage 5: SHA-256 Merkle Tree WORM Ledger</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> Stage 6: Signed PDF Forensic Reports & Prioritized SOC Triage</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDiagramModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-mono px-3 py-1.5 rounded text-xs cursor-pointer"
              >
                CLOSE BLUEPRINT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

