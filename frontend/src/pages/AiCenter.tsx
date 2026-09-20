import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AIAnalysis } from '../types';
import { Cpu, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AiCenter: React.FC = () => {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);

  useEffect(() => {
    api.getRiskAnalyses().then(setAnalyses);
  }, []);

  const anomalySessions = [
    { session: 'SES-0042', score: 0.91, indicators: 'TLS version / cipher deviation' },
    { session: 'SES-0051', score: 0.87, indicators: 'Handshake characteristics' },
    { session: 'SES-0012', score: 0.82, indicators: 'Certificate chain mismatch' },
    { session: 'SES-0089', score: 0.79, indicators: 'Unexpected STARTTLS response timing' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-3">
        <div>
          <h1 className="text-base font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" /> ANALYSIS
          </h1>
          <p className="text-slate-400 text-[11px] mt-0.5">Automated statistical decision vectors and behavior anomaly classifiers</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/50 uppercase font-semibold">
          ANALYTICAL ENGINE ACTIVE
        </span>
      </div>

      {/* Section 1: Risk Classification */}
      <div className="bg-cyber-panel border border-cyber-border rounded p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyber-border pb-2">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Risk Classification
          </h3>
          <span className="text-[10px] text-slate-400">
            Model: <strong className="text-slate-200">CryptographicRiskClassifier v1.0</strong>
          </span>
        </div>

        <div className="flex items-center justify-between py-1 text-slate-300">
          <span>Sessions analysed: <strong className="text-slate-100 font-bold">67</strong></span>
        </div>

        {/* Breakdown Stat Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-cyber-bg p-3 rounded border border-cyber-border space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Low</span>
            <span className="text-xl font-bold text-blue-400 block">42</span>
          </div>

          <div className="bg-cyber-bg p-3 rounded border border-cyber-border space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Medium</span>
            <span className="text-xl font-bold text-amber-400 block">16</span>
          </div>

          <div className="bg-cyber-bg p-3 rounded border border-cyber-border space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">High</span>
            <span className="text-xl font-bold text-orange-400 block">7</span>
          </div>

          <div className="bg-cyber-bg p-3 rounded border border-cyber-border space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Critical</span>
            <span className="text-xl font-bold text-red-400 block">2</span>
          </div>
        </div>
      </div>

      {/* Section 2: Anomaly Detection */}
      <div className="bg-cyber-panel border border-cyber-border rounded p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyber-border pb-2">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-blue-400" /> ANOMALY DETECTION
          </h3>
          <span className="text-[10px] text-slate-400">
            Model: <strong className="text-slate-200">TLSBehaviourAnomalyDetector v1.0</strong>
          </span>
        </div>

        <div className="flex items-center justify-between py-1 text-slate-300">
          <span>Anomalous sessions: <strong className="text-red-400 font-bold">4</strong></span>
        </div>

        {/* Anomaly Detection Data Table */}
        <div className="bg-cyber-bg border border-cyber-border rounded overflow-hidden">
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-cyber-border text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Session</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Primary indicators</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border text-slate-300">
              {anomalySessions.map((item) => (
                <tr key={item.session} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-blue-400">{item.session}</td>
                  <td className="py-2.5 px-3 font-bold text-red-400">{item.score.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-slate-200">{item.indicators}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

