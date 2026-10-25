import React from 'react';

export const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtext,
  badgeText,
  badgeColor = 'sky',
  sparklineData = [10, 15, 8, 22, 18, 30, 25, 40],
  accentColor = 'sky' 
}) => {
  // Generate SVG path for micro sparkline chart
  const maxVal = Math.max(...sparklineData, 1);
  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * 90;
    const y = 35 - (val / maxVal) * 30;
    return `${x},${y}`;
  }).join(' ');

  const strokeMap = {
    sky: '#0284c7',
    emerald: '#10b981',
    amber: '#f59e0b',
    red: '#ef4444',
    purple: '#8b5cf6'
  };

  const bgIconMap = {
    sky: 'bg-sky-950/60 text-sky-400 border-sky-800',
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-800',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-800',
    red: 'bg-red-950/60 text-red-400 border-red-800',
    purple: 'bg-purple-950/60 text-purple-400 border-purple-800'
  };

  return (
    <div className="bg-[#111D3A] border border-[#1E293B] rounded-2xl p-5 shadow-sm transition-all duration-200 hover:border-sky-500 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider truncate">{title}</div>
          <div className="text-xl font-extrabold text-slate-100 font-mono tracking-tight truncate">{value}</div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border shrink-0 ${bgIconMap[accentColor] || bgIconMap.sky}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between gap-2">
        <div className="text-xs text-slate-400 font-mono font-medium truncate whitespace-nowrap">
          {subtext}
        </div>

        {/* Micro Sparkline Chart SVG */}
        <div className="w-20 h-8 shrink-0">
          <svg viewBox="0 0 90 35" className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={strokeMap[accentColor] || '#38bdf8'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
