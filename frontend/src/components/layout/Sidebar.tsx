import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderLock,
  UploadCloud,
  Network,
  AlertTriangle,
  Award,
  Cpu,
  Link2,
  FileSpreadsheet,
  Settings,
  Home
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const sections = [
    {
      title: 'INVESTIGATIONS',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/investigations', label: 'Investigations', icon: FolderLock },
        { to: '/sessions', label: 'Sessions', icon: Network },
        { to: '/findings', label: 'Findings', icon: AlertTriangle },
        { to: '/certificates', label: 'Certificates', icon: Award }
      ]
    },
    {
      title: 'ANALYSIS',
      items: [
        { to: '/ai', label: 'AI Analysis', icon: Cpu },
        { to: '/evidence', label: 'Evidence', icon: Link2 },
        { to: '/reports', label: 'Reports', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { to: '/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-56 bg-slate-900/90 dark:bg-[#0d131f] border-r border-slate-200 dark:border-[#1e293b] flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 shrink-0 transition-colors">
      <div className="p-3 pb-2">
        <NavLink to="/" className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase px-2 hover:text-white transition-colors">
          SECUREMAILSCOPE
        </NavLink>
      </div>

      <nav className="flex-1 px-2 py-1 space-y-4 overflow-y-auto text-xs">
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider px-2 block">
              {sec.title}
            </span>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors ${
                        isActive
                          ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-semibold border-l-2 border-blue-600 dark:border-blue-500'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-[#1e293b] text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
        <div className="flex justify-between">
          <span>Digest:</span>
          <span className="text-slate-300">SHA-256</span>
        </div>
        <div className="flex justify-between">
          <span>Engine:</span>
          <span className="text-emerald-500">READY</span>
        </div>
      </div>
    </aside>
  );
};
