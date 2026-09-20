import React, { useState } from 'react';
import { api } from '../services/api';
import { UploadCloud, AlertCircle, ArrowRight, FileCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [investigationName, setInvestigationName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
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
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4 text-xs font-mono">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-blue-600 dark:text-blue-400" /> NETWORK PACKET TRACE INGESTION (.PCAP / .PCAPNG)
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Ingest captured network traffic containing SMTP, IMAP, or POP3 email streams</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-red-950/60 border border-rose-300 dark:border-red-800 text-rose-800 dark:text-red-300 text-[11px] font-mono flex items-center gap-2 rounded">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-red-400 shrink-0" />
          <span>[ERROR] {error}</span>
        </div>
      )}

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

        {/* Drop Zone */}
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
          disabled={!file || uploading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 uppercase font-bold cursor-pointer"
        >
          {uploading ? (
            'EXECUTING FORENSIC INGESTION PIPELINE...'
          ) : (
            <>
              <span>START FORENSIC INGESTION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

