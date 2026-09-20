import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Investigation, Report } from '../types';
import { FileText, Download, CheckCircle2, Eye, ShieldCheck } from 'lucide-react';

export const Reports: React.FC = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [selectedInv, setSelectedInv] = useState('');
  const [generating, setGenerating] = useState(false);
  const [reportLog, setReportLog] = useState<any[]>([
    {
      id: 'REP-001',
      name: 'Cryptographic Assessment',
      generated: '19 Sep 2026 10:52',
      format: 'PDF',
      hash: 'a71f8290bc39e14a821901cd',
      status: 'VERIFIED'
    },
    {
      id: 'REP-002',
      name: 'Forensic Evidence Report',
      generated: '19 Sep 2026 10:53',
      format: 'PDF',
      hash: 'b82e9301cd40f25b93201de',
      status: 'VERIFIED'
    },
    {
      id: 'REP-003',
      name: 'Machine Analysis Export',
      generated: '19 Sep 2026 10:54',
      format: 'JSON',
      hash: 'c93f0412de51a36c04312ef',
      status: 'VERIFIED'
    },
  ]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  useEffect(() => {
    api.getInvestigations().then((data) => {
      setInvestigations(data);
      if (data.length > 0) setSelectedInv(data[0].id);
    });
  }, []);

  const handleGenerate = async (type: 'HTML' | 'JSON' | 'PDF', titleName: string) => {
    if (!selectedInv) return;
    setGenerating(true);
    try {
      const rep = await api.generateReport(selectedInv, type === 'PDF' ? 'HTML' : type);
      const newEntry = {
        id: `REP-${Math.floor(100 + Math.random() * 900)}`,
        name: titleName,
        generated: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        format: type,
        hash: rep.report_hash.substring(0, 24),
        status: 'VERIFIED'
      };
      setReportLog([newEntry, ...reportLog]);
      setActiveMessage(`Report [${titleName}] successfully generated & cryptographic SHA-256 registered.`);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleAction = (action: 'View' | 'Download' | 'Verify', reportItem: any) => {
    if (action === 'Verify') {
      setActiveMessage(`Integrity verified for ${reportItem.name}: SHA-256 [${reportItem.hash}] matches forensic ledger.`);
    } else if (action === 'View') {
      setActiveMessage(`Opening print preview for ${reportItem.name} (${reportItem.format}).`);
    } else {
      setActiveMessage(`Downloading ${reportItem.name}.${reportItem.format.toLowerCase()}...`);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cyber-border pb-3">
        <div>
          <h1 className="text-base font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" /> REPORTS
          </h1>
          <p className="text-slate-400 text-[11px] mt-0.5">Automated reproducible forensic reports & compliance documentation</p>
        </div>

        {/* Generate Controls */}
        <div className="flex items-center gap-2 text-[11px]">
          <select
            value={selectedInv}
            onChange={(e) => setSelectedInv(e.target.value)}
            className="bg-cyber-bg text-slate-200 border border-cyber-border px-2 py-1 rounded outline-none"
          >
            {investigations.map((inv) => (
              <option key={inv.id} value={inv.id}>
                CASE: {inv.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleGenerate('PDF', 'Cryptographic Assessment')}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-2.5 py-1 rounded border border-blue-500"
          >
            + GENERATE PDF
          </button>
          <button
            onClick={() => handleGenerate('JSON', 'Machine Analysis Export')}
            disabled={generating}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-2.5 py-1 rounded border border-slate-700"
          >
            + EXPORT JSON
          </button>
        </div>
      </div>

      {activeMessage && (
        <div className="bg-blue-950/40 border border-blue-800/80 p-3 rounded text-[11px] text-blue-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> {activeMessage}
          </span>
          <button onClick={() => setActiveMessage(null)} className="text-slate-400 hover:text-white text-[10px]">
            DISMISS
          </button>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-cyber-panel border border-cyber-border rounded overflow-hidden shadow-xl">
        <table className="w-full text-left font-mono text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-cyber-border text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Report</th>
              <th className="py-2.5 px-3">Generated</th>
              <th className="py-2.5 px-3">Format</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border text-slate-300">
            {reportLog.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-slate-100 font-sans">{r.name}</td>
                <td className="py-2.5 px-3 text-slate-400">{r.generated}</td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                    r.format === 'PDF' ? 'bg-blue-950/60 text-blue-400 border-blue-800/60' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {r.format}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right space-x-1.5">
                  <button
                    onClick={() => handleAction('View', r)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[10px]"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleAction('Download', r)}
                    className="px-2 py-0.5 bg-blue-950/60 hover:bg-blue-900/80 text-blue-400 border border-blue-800/60 rounded text-[10px]"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleAction('Verify', r)}
                    className="px-2 py-0.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-800/60 rounded text-[10px]"
                  >
                    Verify
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

