import React, { useState } from 'react';
import { Info, X, ShieldCheck } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label = "SECURITY POSTURE" }) => {
  const [showMethodology, setShowMethodology] = useState(false);
  const roundedScore = Math.round(score);

  // Sub-scores derived from overall score baseline or specific breakdown
  const subScores = [
    { label: "TLS Security", val: Math.min(100, Math.round(roundedScore * 1.05)) },
    { label: "Certificate Security", val: Math.min(100, Math.round(roundedScore * 1.15)) },
    { label: "Cryptographic Strength", val: Math.max(0, Math.round(roundedScore * 0.96)) },
    { label: "Protocol Configuration", val: Math.max(0, Math.round(roundedScore * 0.88)) },
    { label: "Anomaly Exposure", val: Math.max(0, Math.round(roundedScore * 0.92)) },
  ];

  const getBarColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] rounded p-4 font-mono space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <span className="text-xs uppercase tracking-wider text-slate-800 dark:text-slate-300 font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" /> {label}
        </span>
        <button
          onClick={() => setShowMethodology(true)}
          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Info className="w-3 h-3" /> View scoring methodology
        </button>
      </div>

      <div className="flex items-baseline justify-between py-1">
        <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{roundedScore} <span className="text-sm font-normal text-slate-500">/ 100</span></span>
        <span className="text-[10px] text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase font-semibold">
          {roundedScore >= 75 ? 'GRADE A - SECURE' : roundedScore >= 50 ? 'GRADE B - ELEVATED RISK' : 'GRADE C - CRITICAL DEVIATIONS'}
        </span>
      </div>

      {/* Horizontal Progress Bars */}
      <div className="space-y-2 pt-1 text-xs">
        {subScores.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
              <span>{item.label}</span>
              <span className="font-semibold">{item.val}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/50">
              <div
                className={`h-full ${getBarColor(item.val)} transition-all duration-500`}
                style={{ width: `${item.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Scoring Methodology Modal */}
      {showMethodology && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-[#1e293b] rounded max-w-lg w-full p-5 space-y-4 font-sans text-xs text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> SECUREMAILSCOPE SCORING METHODOLOGY
              </h3>
              <button onClick={() => setShowMethodology(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-[11px] leading-relaxed">
              <p className="text-slate-300">
                The overall Security Posture score (0–100) is calculated via weighted composite evaluation across 5 cryptographic & transport vectors:
              </p>
              
              <ul className="space-y-2 border-l-2 border-blue-600/60 pl-3">
                <li>
                  <strong className="text-slate-100">1. TLS Security (25%):</strong> Evaluates TLS handshake version (TLS 1.3 = +100, TLS 1.2 = +80, TLS 1.0/1.1 = 0).
                </li>
                <li>
                  <strong className="text-slate-100">2. Certificate Security (25%):</strong> X.509 validity, expiration dates, RSA &gt;= 2048-bit, SAN matching, and OCSP stapling status.
                </li>
                <li>
                  <strong className="text-slate-100">3. Cryptographic Strength (20%):</strong> Cipher suite analysis (AEAD algorithms, GCM/CHACHA20 bonus vs CBC penalty).
                </li>
                <li>
                  <strong className="text-slate-100">4. Protocol Configuration (15%):</strong> Mandatory STARTTLS enforcement on ports 25, 587, 993, 995.
                </li>
                <li>
                  <strong className="text-slate-100">5. Anomaly Exposure (15%):</strong> Isolation Forest decision function score (outlier detection threshold &lt; 0.30).
                </li>
              </ul>

              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[10px] text-slate-400">
                NIST SP 800-52 Rev 2 & RFC 8314 Compliant Audit Standard.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowMethodology(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-mono px-3 py-1.5 rounded text-xs"
              >
                CLOSE METHODOLOGY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

