import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { EmailSession } from '../types';
import { Network, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SeverityBadge } from '../components/visualizations/SeverityBadge';

export const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<EmailSession[]>([]);
  const [protocolFilter, setProtocolFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [tlsFilter, setTlsFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, [protocolFilter, riskFilter]);

  const loadSessions = async () => {
    try {
      const data = await api.getSessions({
        protocol: protocolFilter || undefined,
        risk_level: riskFilter || undefined
      });
      setSessions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredSessions = useMemo(() => {
    if (!tlsFilter) return sessions;
    return sessions.filter((s) => s.tls_version === tlsFilter);
  }, [sessions, tlsFilter]);

  return (
    <div className="p-4 md:p-6 space-y-4 font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-600 dark:text-blue-400" /> EMAIL SESSIONS
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Reconstructed SMTP / IMAP / POP3 network traffic flows and packet inspection</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="bg-white dark:bg-[#090d16] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded outline-none"
          >
            <option value="">[All Protocols]</option>
            <option value="SMTP">SMTP</option>
            <option value="IMAP">IMAP</option>
            <option value="POP3">POP3</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-white dark:bg-[#090d16] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded outline-none"
          >
            <option value="">[All Risk]</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={tlsFilter}
            onChange={(e) => setTlsFilter(e.target.value)}
            className="bg-white dark:bg-[#090d16] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded outline-none"
          >
            <option value="">[All TLS Versions]</option>
            <option value="TLS 1.3">TLS 1.3</option>
            <option value="TLS 1.2">TLS 1.2</option>
            <option value="TLS 1.0">TLS 1.0</option>
            <option value="Plaintext">Plaintext</option>
          </select>
        </div>
      </div>

      {/* High-density Network-Forensics Data Table */}
      <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] rounded overflow-hidden shadow-xs">
        <table className="w-full text-left font-mono text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Protocol</th>
              <th className="py-2.5 px-3">Source</th>
              <th className="py-2.5 px-3">Destination</th>
              <th className="py-2.5 px-3">TLS</th>
              <th className="py-2.5 px-3">Risk</th>
              <th className="py-2.5 px-3 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-800 dark:text-slate-300">
            {filteredSessions.map((s, idx) => {
              const timeStr = `10:2${idx % 10}:${(10 + idx * 3) % 60}`.padEnd(8, '0');
              return (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/sessions/${s.id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono">{timeStr}</td>
                  <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">{s.protocol}</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{s.source_ip}:{s.source_port}</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{s.destination_ip}:{s.destination_port}</td>
                  <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                      s.tls_version === 'TLS 1.3'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/60'
                        : s.tls_version === 'TLS 1.2'
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 border-blue-300 dark:border-blue-800/60'
                        : 'bg-rose-100 dark:bg-red-950/60 text-rose-800 dark:text-red-400 border-rose-300 dark:border-red-800/60'
                    }`}>
                      {s.tls_version || 'Plaintext'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <SeverityBadge severity={s.risk_level} />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/sessions/${s.id}`);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                    >
                      INSPECT <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

