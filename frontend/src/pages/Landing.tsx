import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Shield, Play, FolderOpen } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    try {
      await api.loadDemoDataset();
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 font-mono text-xs">
      <div className="bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1e293b] p-8 rounded max-w-lg w-full space-y-6 text-center shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center p-2.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 mb-2">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tracking-tight">SecureMailScope</h1>
          <p className="text-slate-600 dark:text-slate-400 font-sans text-xs leading-relaxed max-w-md mx-auto">
            Cryptographic security assessment for secure email communications.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs rounded transition-colors cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
            [Open Investigation]
          </button>

          <button
            onClick={handleDemoClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs rounded border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            [Load Demo Investigation]
          </button>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
          <span>CONSOLE BUILD: v2.4.0-SOC</span>
          <span>RFC1918 FORENSICS ENGINE</span>
        </div>
      </div>
    </div>
  );
};

