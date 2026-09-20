import React from 'react';
import { Settings as SettingsIcon, Sliders, Database, ShieldAlert, Cpu } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="p-4 md:p-6 space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ENGINE CONFIGURATION & POLICY CONTROL
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
            Cryptographic risk engine thresholds, isolation forest vectors, and evidentiary integrity parameters
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 uppercase font-semibold">
          POLICY ENFORCED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cryptographic Risk Rules Panel */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] rounded p-4 space-y-3 shadow-xs">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Cryptographic Policy Thresholds
          </h3>
          
          <div className="space-y-2 text-xs">
            <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-900 dark:text-slate-300 font-medium block">Minimum Accepted TLS Version</span>
                <span className="text-[10px] text-slate-500">Flags connections using TLS 1.0 / 1.1 / SSLv3</span>
              </div>
              <span className="text-blue-700 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded border border-blue-200 dark:border-blue-800/40">TLS 1.2</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-900 dark:text-slate-300 font-medium block">Minimum RSA Key Length</span>
                <span className="text-[10px] text-slate-500">Flags certificates under 2048-bit modulus</span>
              </div>
              <span className="text-blue-700 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded border border-blue-200 dark:border-blue-800/40">2048 bits</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-900 dark:text-slate-300 font-medium block">Strict Certificate Revocation (OCSP)</span>
                <span className="text-[10px] text-slate-500">Enforce real-time OCSP stapling verification</span>
              </div>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/40">ENABLED</span>
            </div>
          </div>
        </div>

        {/* Isolation Forest Model Sensitivity Panel */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] rounded p-4 space-y-3 shadow-xs">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Isolation Forest ML Hyperparameters
          </h3>

          <div className="space-y-2 text-xs">
            <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-900 dark:text-slate-300 font-medium block">Contamination Rate (Expected Anomaly %)</span>
                <span className="text-[10px] text-slate-500">Baseline proportion of expected outlier streams</span>
              </div>
              <span className="text-blue-700 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded border border-blue-200 dark:border-blue-800/40">15.0%</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-900 dark:text-slate-300 font-medium block">Decision Cutoff Threshold</span>
                <span className="text-[10px] text-slate-500">Scores below threshold trigger SOC alerts</span>
              </div>
              <span className="text-blue-700 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded border border-blue-200 dark:border-blue-800/40">0.30</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#090d16] p-2.5 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-900 dark:text-slate-300 font-medium block">Feature Vector Space</span>
                <span className="text-[10px] text-slate-500">TLS ver, Cipher strength, SAN count, Lifetime</span>
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-300 dark:border-slate-700">4D VECTOR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Engine Status Info */}
      <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] rounded p-3 text-xs flex items-center justify-between text-slate-500 dark:text-slate-400 shadow-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-slate-400" />
          <span>Rule Engine Build: <strong className="text-slate-800 dark:text-slate-200">v2.4.0-SOC-ENTERPRISE</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-400" />
          <span>Integrity Chain Standard: <strong className="text-slate-800 dark:text-slate-200">SHA-256 HMAC-LEDGER</strong></span>
        </div>
      </div>
    </div>
  );
};
