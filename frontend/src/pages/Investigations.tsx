import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Investigation } from '../types';
import { FolderLock, ArrowRight, ShieldCheck, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Investigations: React.FC = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvestigations();
  }, []);

  const fetchInvestigations = async () => {
    try {
      const data = await api.getInvestigations();
      setInvestigations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-4 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div>
          <h1 className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
            EMAIL FORENSIC AUDIT INVESTIGATIONS
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Audit cases, PCAP network captures, and synthetic test datasets.</p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          NEW INVESTIGATION
        </button>
      </div>

      <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] rounded overflow-hidden shadow-xs">
        <table className="w-full text-left font-mono text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
              <th className="py-2.5 px-3">Case ID</th>
              <th className="py-2.5 px-3">Audit Target / Description</th>
              <th className="py-2.5 px-3">Source</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Security Score</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
            {investigations.map((inv) => (
              <tr
                key={inv.id}
                onClick={() => navigate(`/investigations/${inv.id}`)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">{inv.id.substring(0, 14)}</td>
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 font-sans">{inv.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans line-clamp-1">{inv.description}</div>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                    {inv.source_type}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{inv.status}</span>
                </td>
                <td className="py-2.5 px-3 font-bold">
                  <span className={inv.overall_security_score < 70 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                    {Math.round(inv.overall_security_score)} / 100
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer">
                    OPEN <ArrowRight className="w-3 h-3" />
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
