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
      icon: <CheckCircle2 className="w-5 h-5 text-mat-secondary" />,
      bg: 'bg-white border-gray-200',
      textColor: 'text-mat-secondary',
    },
    {
      title: 'Avg Resolution Time',
      value: '4.2 hrs',
      subtext: 'Target SLA: < 6.0 hrs',
      icon: <Clock className="w-5 h-5 text-mat-low" />,
      bg: 'bg-white border-gray-200',
      textColor: 'text-mat-low',
    },
    {
      title: 'Critical Hazards',
      value: `${criticalCount}`,
      subtext: 'Immediate action required',
      icon: <AlertTriangle className="w-5 h-5 text-mat-critical" />,
      bg: 'bg-white border-gray-200',
      textColor: 'text-mat-critical',
    },
    {
      title: 'Top Problem Ward',
      value: topWard[0].split('-')[1]?.trim() || topWard[0],
      subtext: `${topWard[1]} active complaints`,
      icon: <TrendingUp className="w-5 h-5 text-mat-high" />,
      bg: 'bg-white border-gray-200',
      textColor: 'text-mat-high',
    },
    {
      title: 'Citizen Satisfaction',
      value: '94.8%',
      subtext: 'Based on 420 ratings',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      bg: 'bg-white border-gray-200',
      textColor: 'text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-4 rounded border shadow-elevation-1 transition-all hover:shadow-elevation-2 ${card.bg}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-mat-text-secondary uppercase tracking-wider">{card.title}</span>
            <div className="p-1.5 rounded bg-gray-50 border border-gray-100">{card.icon}</div>
          </div>
          <div className="mt-2">
            <h3 className={`text-xl sm:text-2xl font-bold ${card.textColor}`}>{card.value}</h3>
            <p className="text-[11px] text-mat-text-secondary font-normal mt-0.5">{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
