import React from 'react';
import { Settings as SettingsIcon, Sliders, Database, ShieldAlert, Cpu } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-3">
        <div>
          <h1 className="text-base font-bold font-mono text-slate-100 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-blue-400" />
            ENGINE CONFIGURATION & POLICY CONTROL
          </h1>
          <p className="text-slate-400 text-xs mt-0.5 font-mono">
            Cryptographic risk engine thresholds, isolation forest vectors, and evidentiary integrity parameters
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 uppercase font-semibold">
          POLICY ENFORCED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cryptographic Risk Rules Panel */}
        <div className="bg-cyber-panel border border-cyber-border rounded p-4 space-y-3">
          <h3 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-cyber-border pb-2">
            <Sliders className="w-3.5 h-3.5 text-blue-400" /> Cryptographic Policy Thresholds
          </h3>
          
          <div className="space-y-2 text-xs font-mono">
            <div className="bg-cyber-bg p-2.5 rounded border border-cyber-border flex justify-between items-center">
              <div>
                <span className="text-slate-300 font-medium block">Minimum Accepted TLS Version</span>
                <span className="text-[10px] text-slate-500">Flags connections using TLS 1.0 / 1.1 / SSLv3</span>
              </div>
              <span className="text-blue-400 font-semibold bg-blue-950/60 px-2 py-1 rounded border border-blue-800/40">TLS 1.2</span>
            </div>

            <div className="bg-cyber-bg p-2.5 rounded border border-cyber-border flex justify-between items-center">
              <div>
                <span className="text-slate-300 font-medium block">Minimum RSA Key Length</span>
                <span className="text-[10px] text-slate-500">Flags certificates under 2048-bit modulus</span>
              </div>
              <span className="text-blue-400 font-semibold bg-blue-950/60 px-2 py-1 rounded border border-blue-800/40">2048 bits</span>
            </div>

            <div className="bg-cyber-bg p-2.5 rounded border border-cyber-border flex justify-between items-center">
              <div>
                <span className="text-slate-300 font-medium block">Strict Certificate Revocation (OCSP)</span>
                <span className="text-[10px] text-slate-500">Enforce real-time OCSP stapling verification</span>
              </div>
              <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/40">ENABLED</span>
            </div>
          </div>
        </div>

        {/* Isolation Forest Model Sensitivity Panel */}
        <div className="bg-cyber-panel border border-cyber-border rounded p-4 space-y-3">
          <h3 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-cyber-border pb-2">
            <Database className="w-3.5 h-3.5 text-blue-400" /> Isolation Forest ML Hyperparameters
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="bg-cyber-bg p-2.5 rounded border border-cyber-border flex justify-between items-center">
              <div>
                <span className="text-slate-300 font-medium block">Contamination Rate (Expected Anomaly %)</span>
                <span className="text-[10px] text-slate-500">Baseline proportion of expected outlier streams</span>
              </div>
              <span className="text-blue-400 font-semibold bg-blue-950/60 px-2 py-1 rounded border border-blue-800/40">15.0%</span>
            </div>

            <div className="bg-cyber-bg p-2.5 rounded border border-cyber-border flex justify-between items-center">
              <div>
                <span className="text-slate-300 font-medium block">Decision Cutoff Threshold</span>
                <span className="text-[10px] text-slate-[10px] text-slate-500">Scores below threshold trigger SOC alerts</span>
              </div>
              <span className="text-blue-400 font-semibold bg-blue-950/60 px-2 py-1 rounded border border-blue-800/40">0.30</span>
            </div>

            <div className="bg-cyber-bg p-2.5 rounded border border-cyber-border flex justify-between items-center">
              <div>
                <span className="text-slate-300 font-medium block font-mono">Feature Vector Space</span>
                <span className="text-[10px] text-slate-500">TLS ver, Cipher strength, SAN count, Lifetime</span>
              </div>
              <span className="text-slate-300 font-semibold bg-slate-800 px-2 py-1 rounded border border-slate-700">4D VECTOR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Engine Status Info */}
      <div className="bg-cyber-panel border border-cyber-border rounded p-3 text-xs font-mono flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-slate-500" />
          <span>Rule Engine Engine Build: <strong className="text-slate-200">v2.4.0-SOC-ENTERPRISE</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-500" />
          <span>Integrity Chain Standard: <strong className="text-slate-200">SHA-256 HMAC-LEDGER</strong></span>
        </div>
      </div>
    </div>
  );
};

