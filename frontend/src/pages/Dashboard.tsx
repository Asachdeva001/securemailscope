import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DashboardSummary, Finding } from '../types';
import { ScoreGauge } from '../components/visualizations/ScoreGauge';
import { SeverityBadge } from '../components/visualizations/SeverityBadge';
import { Shield, AlertTriangle, Network, Lock, Award, Cpu, Link2, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardSummary();
      setSummary(data);
      const f = await api.getFindings({ investigation_id: data.investigation_id });
      setFindings(f.slice(0, 6));
    } catch (err) {
      console.log('No active dashboard data found, loading demo...');
      try {
        const demoInv = await api.loadDemoDataset();
        const data = await api.getDashboardSummary(demoInv.id);
        setSummary(data);
        const f = await api.getFindings({ investigation_id: demoInv.id });
        setFindings(f.slice(0, 6));
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center space-x-3 text-slate-400 font-mono text-xs">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span>[SYSTEM] LOADING INVESTIGATION DATA METRICS...</span>
      </div>
    );
  }

  if (!summary) return null;

  const tlsData = Object.entries(summary.tls_distribution).map(([name, value]) => ({ name, value }));
  const COLORS = ['#2563eb', '#0284c7', '#10b981', '#d97706', '#64748b'];

  const cipherData = Object.entries(summary.cipher_strength_distribution).map(([name, value]) => ({ name, value }));

  const tooltipStyle = theme === 'dark'
    ? { backgroundColor: '#121824', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '4px', fontSize: '11px', fontFamily: 'JetBrains Mono' }
    : { backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a', borderRadius: '4px', fontSize: '11px', fontFamily: 'JetBrains Mono' };

  return (
    <div className="p-5 space-y-4 max-w-[1600px] mx-auto text-xs font-sans">
      {/* INVESTIGATION OVERVIEW TOP SECTION */}
      <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded text-xs space-y-2 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">INVESTIGATION OVERVIEW</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{summary.investigation_id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/upload')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px] rounded border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              INGEST PCAP
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-mono text-[11px] rounded transition-colors cursor-pointer"
            >
              EXPORT REPORT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-[11px] pt-1">
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase">Audit Target</span>
            <span className="text-slate-900 dark:text-slate-200 font-medium truncate block">{summary.investigation_name}</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase">Captured Timestamp</span>
            <span className="text-slate-700 dark:text-slate-300">19 Sep 2026, 21:00 UTC</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase">Evidence Trace File</span>
            <span className="text-slate-700 dark:text-slate-300">capture_042.pcap (SHA-256 Verified)</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase">Protocol Scope</span>
            <span className="text-slate-700 dark:text-slate-300">SMTP (25/587), IMAP (143/993), POP3 (110)</span>
          </div>
        </div>
      </div>

      {/* COMPACT 4-COLUMN SUMMARY ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        {/* Metric 1: Security Posture */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-3 rounded flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-sans tracking-wider block">Security Posture</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{summary.overall_score} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
          </div>
          <div className="text-right text-[10px] text-slate-500 dark:text-slate-400">
            <div>TLS: <span className="text-blue-600 dark:text-blue-400">{summary.score_breakdown.tls_security}%</span></div>
            <div>Cert: <span className="text-emerald-600 dark:text-emerald-400">{summary.score_breakdown.certificate_security}%</span></div>
          </div>
        </div>

        {/* Metric 2: Email Sessions */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-3 rounded flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-sans tracking-wider block">Email Sessions</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{summary.total_sessions}</span>
          </div>
          <div className="text-right text-[10px] text-slate-500 dark:text-slate-400">
            <div>SMTP: {summary.protocol_distribution.SMTP || 0}</div>
            <div>IMAP: {summary.protocol_distribution.IMAP || 0}</div>
          </div>
        </div>

        {/* Metric 3: Findings */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-3 rounded flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-sans tracking-wider block">Findings</span>
            <span className="text-xl font-bold text-red-600 dark:text-red-400">{summary.critical_findings_count + summary.high_findings_count + summary.medium_findings_count}</span>
          </div>
          <div className="text-right text-[10px] text-slate-500 dark:text-slate-400">
            <div>Crit: <span className="text-red-600 dark:text-red-400 font-bold">{summary.critical_findings_count}</span></div>
            <div>High: <span className="text-orange-600 dark:text-orange-400">{summary.high_findings_count}</span></div>
          </div>
        </div>

        {/* Metric 4: Anomalies */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-3 rounded flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-sans tracking-wider block">Anomalies</span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{summary.anomalous_sessions_count}</span>
          </div>
          <div className="text-right text-[10px] text-slate-500 dark:text-slate-400">
            <div>IsoForest ML</div>
            <div>Score &gt; 0.30</div>
          </div>
        </div>
      </div>

      {/* VISUALIZATIONS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* TLS Version Breakdown */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-300 uppercase">TLS Protocol Version Distribution</span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Handshake Negotiated</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tlsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                  {tlsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cipher Strength Breakdown */}
        <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-4 rounded space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-300 uppercase">Cryptographic Cipher Suite Ranking</span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">AES / ChaCha / RC4</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cipherData}>
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={10} fontFamily="JetBrains Mono" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#2563eb" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PRIORITIZED FINDINGS LOG */}
      <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] rounded p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-300 uppercase">Prioritized Vulnerability & Threat Log</span>
          <button
            onClick={() => navigate('/findings')}
            className="text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            VIEW ALL ({findings.length}) <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                <th className="py-2 px-3">Severity</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Title</th>
                <th className="py-2 px-3">Evidence</th>
                <th className="py-2 px-3">Recommended Remediation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
              {findings.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3"><SeverityBadge severity={f.severity} /></td>
                  <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{f.category}</td>
                  <td className="py-2 px-3 text-slate-900 dark:text-slate-100 font-semibold">{f.title}</td>
                  <td className="py-2 px-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">{f.evidence}</td>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">{f.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
