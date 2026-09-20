import React from 'react';

interface SeverityBadgeProps {
  severity: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  let badgeStyle = "bg-slate-800/80 text-slate-300 border-slate-700";
  
  const s = severity.toLowerCase();
  if (s === 'critical') {
    badgeStyle = "bg-red-950/60 text-red-400 border-red-800/80 font-bold";
  } else if (s === 'high') {
    badgeStyle = "bg-orange-950/60 text-orange-400 border-orange-800/80 font-medium";
  } else if (s === 'medium') {
    badgeStyle = "bg-amber-950/60 text-amber-400 border-amber-800/80";
  } else if (s === 'low') {
    badgeStyle = "bg-blue-950/60 text-blue-400 border-blue-800/80";
  } else if (s === 'informational' || s === 'info') {
    badgeStyle = "bg-slate-800/80 text-slate-400 border-slate-700";
  }

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border font-mono uppercase tracking-tight ${badgeStyle}`}>
      {severity}
    </span>
  );
};
