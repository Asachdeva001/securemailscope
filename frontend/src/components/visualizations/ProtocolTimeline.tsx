import React from 'react';
import { ArrowRight, ShieldCheck, Lock, Unlock, Zap } from 'lucide-react';

interface ProtocolTimelineProps {
  protocol: string;
  encryptionState: string;
  tlsVersion?: string;
  cipherSuite?: string;
}

export const ProtocolTimeline: React.FC<ProtocolTimelineProps> = ({
  protocol,
  encryptionState,
  tlsVersion,
  cipherSuite
}) => {
  const isPlaintext = encryptionState === 'PLAINTEXT';
  const isStartTLS = encryptionState === 'STARTTLS_INITIATED';
  const isEncrypted = encryptionState === 'ENCRYPTED' || encryptionState === 'TLS_HANDSHAKE';

  return (
    <div className="w-full bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] rounded p-4 text-xs font-mono shadow-xs">
      <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-2">
          Protocol State Transition Sequence
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
          Protocol: {protocol}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] py-1">
        {/* Step 1 */}
        <div className={`p-2.5 rounded border ${
          isPlaintext ? 'bg-rose-50 dark:bg-red-950/40 border-rose-300 dark:border-red-800/80 text-rose-800 dark:text-red-300' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400'
        }`}>
          <div className="font-semibold text-slate-900 dark:text-slate-200">1. TCP Handshake</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">PLAINTEXT ({protocol === 'SMTP' ? '25/587' : protocol === 'IMAP' ? '143' : '110'})</div>
        </div>

        {/* Step 2 */}
        <div className={`p-2.5 rounded border ${
          isStartTLS ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 text-amber-800 dark:text-amber-300' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400'
        }`}>
          <div className="font-semibold text-slate-900 dark:text-slate-200">2. STARTTLS Command</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Transition Request</div>
        </div>

        {/* Step 3 */}
        <div className={`p-2.5 rounded border ${
          isEncrypted ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800/80 text-blue-800 dark:text-blue-300' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400'
        }`}>
          <div className="font-semibold text-slate-900 dark:text-slate-200">3. TLS Negotiation</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{tlsVersion || 'None'}</div>
        </div>

        {/* Step 4 */}
        <div className={`p-2.5 rounded border ${
          isEncrypted ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400'
        }`}>
          <div className="font-semibold text-slate-900 dark:text-slate-200">4. Secure Session</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{cipherSuite ? cipherSuite.split('_')[1] || cipherSuite : 'Unencrypted'}</div>
        </div>
      </div>
    </div>
  );
};
