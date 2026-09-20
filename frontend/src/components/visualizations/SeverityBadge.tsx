import React from 'react';

interface SeverityBadgeProps {
  severity: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  let badgeStyle = "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700";
  
  const s = severity.toLowerCase();
  if (s === 'critical') {
    badgeStyle = "bg-rose-100 dark:bg-red-950/60 text-rose-700 dark:text-red-400 border-rose-300 dark:border-red-800/80 font-bold";
  } else if (s === 'high') {
    badgeStyle = "bg-amber-100 dark:bg-orange-950/60 text-amber-800 dark:text-orange-400 border-amber-300 dark:border-orange-800/80 font-medium";
  } else if (s === 'medium') {
    badgeStyle = "bg-yellow-100 dark:bg-amber-950/60 text-yellow-800 dark:text-amber-400 border-yellow-300 dark:border-amber-800/80";
  } else if (s === 'low') {
    badgeStyle = "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800/80";
  } else if (s === 'informational' || s === 'info') {
    badgeStyle = "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700";
  }

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border font-mono uppercase tracking-tight ${badgeStyle}`}>
      {severity}
    </span>
  );
};
