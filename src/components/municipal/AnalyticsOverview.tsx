import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';

export const AnalyticsOverview: React.FC = () => {
  const { issues } = useApp();

  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;
  const criticalCount = issues.filter((i) => i.severity === 'Critical' && i.status !== 'Resolved').length;

  // Calculate top problem areas / wards
  const wardMap: Record<string, number> = {};
  issues.forEach((i) => {
    wardMap[i.location.ward] = (wardMap[i.location.ward] || 0) + 1;
  });
  const topWard = Object.entries(wardMap).sort((a, b) => b[1] - a[1])[0] || ['Indiranagar', 0];

  const cards = [
    {
      title: 'Issues Resolved',
      value: `${resolvedCount}`,
      subtext: '+12% vs last week',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-950',
    },
    {
      title: 'Avg Resolution Time',
      value: '4.2 hrs',
      subtext: 'Target SLA: < 6.0 hrs',
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-950',
    },
    {
      title: 'Critical Hazards',
      value: `${criticalCount}`,
      subtext: 'Immediate action required',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50 border-rose-200',
      textColor: 'text-rose-950',
    },
    {
      title: 'Top Problem Ward',
      value: topWard[0].split('-')[1]?.trim() || topWard[0],
      subtext: `${topWard[1]} active complaints`,
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-950',
    },
    {
      title: 'Citizen Satisfaction',
      value: '94.8%',
      subtext: 'Based on 420 ratings',
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
      bg: 'bg-teal-50 border-teal-200',
      textColor: 'text-teal-950',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-3xl border shadow-sm transition-all hover:shadow-md ${card.bg}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">{card.title}</span>
            <div className="p-2 rounded-xl bg-white/80 shadow-xs">{card.icon}</div>
          </div>
          <div className="mt-2">
            <h3 className={`text-xl sm:text-2xl font-black ${card.textColor}`}>{card.value}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
