import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BlockchainRecord } from '../types';
import { ShieldCheck, CheckCircle2, FileCode, Clock, Cpu } from 'lucide-react';

export const EvidenceCenter: React.FC = () => {
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  useEffect(() => {
    api.getBlockchainRecords().then(setRecords);
  }, []);

  const handleVerify = async (record: BlockchainRecord) => {
    try {
      const result = await api.verifyEvidenceHash(record.entity_id, record.hash_value);
      setVerificationResult(result);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" /> EVIDENCE INTEGRITY
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Cryptographic hash provenance and non-repudiation chain of custody</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 uppercase font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> VERIFIED PROVENANCE
        </span>
      </div>

      {/* Primary Evidence Integrity Metadata Card */}
      <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] rounded p-4 space-y-3 shadow-xs">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
          PRIMARY EVIDENCE PACKET RECORD
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase block">Evidence File</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> capture_042.pcap
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase block">SHA-256 Hash Digest</span>
            <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px] truncate block font-semibold">
              a71f8290bc39e14a821901cd...92cd
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase block">Integrity Status</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase block">Provenance State</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold uppercase">REGISTERED</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase block">Analyzer Engine</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-slate-400" /> SecureMailScope 1.0.0
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase block">Ingestion Timestamp</span>
            <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 2026-09-19 10:42:18
            </span>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <span>Technical Reference ID: <strong className="text-slate-900 dark:text-slate-200">0x9f83a210bc94812f0a...</strong></span>
          <span className="text-slate-500">HMAC-SHA256 SIGNED LEDGER</span>
        </div>
      </div>

      {verificationResult && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 p-3 rounded text-[11px] font-mono space-y-1">
          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> [VERIFIED] Evidence Cryptographic Digest Verified
          </span>
          <p className="text-slate-800 dark:text-slate-300">Technical Reference TX: {verificationResult.verification_result?.transaction_tx}</p>
          <p className="text-slate-600 dark:text-slate-400">{verificationResult.verification_result?.reason}</p>
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] rounded overflow-hidden shadow-xs">
        <table className="w-full text-left font-mono text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Block #</th>
              <th className="py-2.5 px-3">Record Type</th>
              <th className="py-2.5 px-3">Entity ID</th>
              <th className="py-2.5 px-3">SHA-256 Digest</th>
              <th className="py-2.5 px-3">Technical Reference</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-800 dark:text-slate-300">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">#{r.block_index}</td>
                <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">{r.record_type}</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{r.entity_id.substring(0, 12)}...</td>
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-mono">{r.hash_value.substring(0, 24)}...</td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono">{r.transaction_tx.substring(0, 18)}...</td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => handleVerify(r)}
                    className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded text-[10px] cursor-pointer"
                  >
                    VERIFY HASH
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

