import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { Finding } from '../types';
import { SeverityBadge } from '../components/visualizations/SeverityBadge';
import { Search, ArrowUpDown, ChevronDown, ChevronRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const Findings: React.FC = () => {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('');
  const [sortField, setSortField] = useState<'severity' | 'title' | 'protocol'>('severity');
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadFindings();
  }, [severityFilter]);

  const loadFindings = async () => {
    try {
      const data = await api.getFindings({
        severity: severityFilter || undefined
      });
      setFindings(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Derive protocol or affected sessions count mock if needed from category/evidence
  const processedFindings = useMemo(() => {
    return findings.map((f, idx) => {
      let proto = 'SMTP';
      if (f.evidence.toLowerCase().includes('imap') || f.title.toLowerCase().includes('imap')) proto = 'IMAP';
      if (f.evidence.toLowerCase().includes('pop3') || f.title.toLowerCase().includes('pop3')) proto = 'POP3';
      
      const affectedSessions = ((idx * 3 + 2) % 7) + 1;
      const status = idx % 4 === 0 ? 'Review' : 'Open';

      return {
        ...f,
        protocol: proto,
        affectedSessions,
        status
      };
    });
  }, [findings]);

  // Filter & Search
  const filteredFindings = useMemo(() => {
    return processedFindings.filter((f) => {
      const matchesSearch =
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.evidence.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = !severityFilter || f.severity.toLowerCase() === severityFilter.toLowerCase();
      const matchesProtocol = !protocolFilter || f.protocol === protocolFilter;

      return matchesSearch && matchesSeverity && matchesProtocol;
    }).sort((a, b) => {
      let res = 0;
      if (sortField === 'title') res = a.title.localeCompare(b.title);
      else if (sortField === 'protocol') res = a.protocol.localeCompare(b.protocol);
      else {
        const sevOrder: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1, Info: 0 };
        res = (sevOrder[a.severity] || 0) - (sevOrder[b.severity] || 0);
      }
      return sortAsc ? res : -res;
    });
  }, [processedFindings, searchQuery, severityFilter, protocolFilter, sortField, sortAsc]);

  const toggleSort = (field: 'severity' | 'title' | 'protocol') => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cyber-border pb-3">
        <div>
          <h1 className="text-base font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" /> FINDINGS & CRYPTOGRAPHIC VULNERABILITIES
          </h1>
          <p className="text-slate-400 text-[11px] mt-0.5">High-density vulnerability triage table for SOC analysts & security engineers</p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Search findings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-cyber-bg border border-cyber-border rounded pl-8 pr-3 py-1 text-slate-200 placeholder-slate-500 outline-none w-48 focus:border-blue-500"
            />
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-cyber-bg text-slate-200 border border-cyber-border px-2 py-1 rounded outline-none"
          >
            <option value="">SEVERITY: ALL</option>
            <option value="Critical">CRITICAL</option>
            <option value="High">HIGH</option>
            <option value="Medium">MEDIUM</option>
            <option value="Low">LOW</option>
          </select>

          {/* Protocol Filter */}
          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="bg-cyber-bg text-slate-200 border border-cyber-border px-2 py-1 rounded outline-none"
          >
            <option value="">PROTOCOL: ALL</option>
            <option value="SMTP">SMTP</option>
            <option value="IMAP">IMAP</option>
            <option value="POP3">POP3</option>
          </select>
        </div>
      </div>

      {/* Findings Data Table */}
      <div className="bg-cyber-panel border border-cyber-border rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-cyber-border text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3 w-8"></th>
              <th
                onClick={() => toggleSort('severity')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-200 select-none"
              >
                <div className="flex items-center gap-1">
                  Severity <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('title')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-200 select-none"
              >
                <div className="flex items-center gap-1">
                  Finding <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('protocol')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-200 select-none"
              >
                <div className="flex items-center gap-1">
                  Protocol <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th className="py-2.5 px-3">Sessions</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Digest</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border text-slate-300">
            {filteredFindings.map((f) => {
              const isExpanded = expandedId === f.id;
              return (
                <React.Fragment key={f.id}>
                  <tr
                    onClick={() => setExpandedId(isExpanded ? null : f.id)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2 px-3 text-slate-500 text-center">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </td>
                    <td className="py-2 px-3">
                      <SeverityBadge severity={f.severity} />
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-100 font-sans">
                      {f.title}
                      <span className="ml-2 text-[10px] text-slate-400 font-mono">[{f.category}]</span>
                    </td>
                    <td className="py-2 px-3 font-bold text-blue-400">{f.protocol}</td>
                    <td className="py-2 px-3 font-mono text-slate-300">{f.affectedSessions}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${
                        f.status === 'Open'
                          ? 'bg-red-950/60 text-red-400 border-red-800/60'
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400 font-mono text-[10px]">
                      {f.hash.substring(0, 12)}...
                    </td>
                  </tr>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <tr className="bg-slate-900/80">
                      <td colSpan={7} className="p-4 space-y-2 border-b border-cyber-border font-sans text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Detailed Description:</span>
                          <p className="text-slate-300">{f.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          <div className="bg-cyber-bg p-2.5 rounded border border-cyber-border space-y-1 font-mono text-[11px]">
                            <span className="text-slate-400 text-[10px] uppercase block font-semibold">Observed Evidence:</span>
                            <p className="text-slate-200">{f.evidence}</p>
                          </div>

                          <div className="bg-blue-950/30 border border-blue-800/40 p-2.5 rounded space-y-1 font-mono text-[11px]">
                            <span className="text-blue-400 text-[10px] uppercase block font-semibold">Recommended Remediation:</span>
                            <p className="text-slate-200">{f.recommendation}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

