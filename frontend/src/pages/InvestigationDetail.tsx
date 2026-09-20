import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Investigation, DashboardSummary } from '../types';
import { ScoreGauge } from '../components/visualizations/ScoreGauge';
import { ArrowLeft, Shield, Network, AlertTriangle, Layers, Clock, UserCheck } from 'lucide-react';

export const InvestigationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.getInvestigation(id).then(setInvestigation);
      api.getDashboardSummary(id).then(setSummary);
    }
  }, [id]);

  if (!investigation || !summary) return null;

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Back button */}
      <button
        onClick={() => navigate('/investigations')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-mono transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> [RETURN TO CASE INDEX]
      </button>

      {/* Primary Investigation Header */}
      <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 uppercase font-semibold">
              {investigation.source_type}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/60 uppercase">
              STATUS: CLOSED / RECORDED
            </span>
          </div>
          <h1 className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tracking-tight">{investigation.name}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs max-w-2xl">{investigation.description}</p>
          
          <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Analyst: <strong className="text-slate-800 dark:text-slate-200">{investigation.analyst}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Opened: <strong className="text-slate-800 dark:text-slate-200">{new Date(investigation.created_at).toISOString().split('T')[0]}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> Case ID: <strong className="text-slate-800 dark:text-slate-200">{investigation.id}</strong>
            </span>
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 flex items-center justify-center">
          <ScoreGauge score={investigation.overall_security_score} label="Security Score" size={110} />
        </div>
      </div>

      {/* Forensic Metrics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="uppercase tracking-wider text-[11px]">Email Sessions</span>
            <Network className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 block">{summary.total_sessions}</span>
          <span className="text-[11px] text-slate-500 block font-mono">Reconstructed TCP/SMTP streams</span>
        </div>

        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="uppercase tracking-wider text-[11px]">Critical Vulnerabilities</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-red-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-rose-600 dark:text-red-400 block">{summary.critical_findings_count}</span>
          <span className="text-[11px] text-slate-500 block font-mono">Severe cryptographic flaws flagged</span>
        </div>

        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="uppercase tracking-wider text-[11px]">Ledger Verification</span>
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block">{summary.evidence_verification_status}</span>
          <span className="text-[11px] text-slate-500 block font-mono">SHA-256 evidence chain integrity</span>
        </div>
      </div>
    </div>
  );
};

