import React, { useState } from 'react';
import { Shield, Play, Upload, Activity, Sun, Moon } from 'lucide-react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  activeInvestigationName?: string;
  onDemoLoaded?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeInvestigationName, onDemoLoaded }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLoadDemo = async () => {
    setLoading(true);
    try {
      await api.loadDemoDataset();
      if (onDemoLoaded) onDemoLoaded();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to load demo dataset', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="h-14 bg-slate-900 dark:bg-[#090d16] border-b border-slate-200 dark:border-[#1e293b] px-4 flex items-center justify-between sticky top-0 z-40 transition-colors font-mono text-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="font-bold text-slate-900 dark:text-white tracking-wide">SecureMailScope</span>
        </div>

        <span className="text-slate-600 dark:text-slate-600">/</span>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Investigation:</span>
          <span className="text-slate-200 font-semibold bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/80 text-[11px] truncate max-w-[260px]">
            {activeInvestigationName || 'INV-2026-0042'}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
            [READY]
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-1.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors text-[11px] font-mono flex items-center gap-1"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>LIGHT</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span>DARK</span>
            </>
          )}
        </button>

        <button
          onClick={handleLoadDemo}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-mono text-[11px] rounded transition-colors disabled:opacity-50"
        >
          <Play className="w-3 h-3 fill-white" />
          {loading ? 'LOADING...' : 'LOAD DEMO'}
        </button>

        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] rounded border border-slate-700 transition-colors"
        >
          <Upload className="w-3 h-3 text-slate-400" />
          INGEST PCAP
        </button>

        <div className="pl-2 border-l border-slate-800 text-[11px] text-slate-400">
          Analyst: <span className="text-slate-200 font-semibold">SOC_LVL2</span>
        </div>
      </div>
    </header>
  );
};
