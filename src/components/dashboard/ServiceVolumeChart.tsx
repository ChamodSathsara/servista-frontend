'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { serviceVolume } from '../../data/serviceVolume';

export function ServiceVolumeChart() {
  const latest = serviceVolume[serviceVolume.length - 1];
  const previous = serviceVolume[serviceVolume.length - 2];
  const breakdownChange = Math.round((latest.breakdowns - previous.breakdowns) / previous.breakdowns * 100);

  return (
    <section aria-labelledby="volume-heading" className="rounded-xl border border-line bg-white p-6 lg:col-span-3">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 id="volume-heading" className="text-base font-semibold text-ink">
            Service volume
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">Jobs completed per month, last 6 months</p>
        </div>
        <p className="text-sm text-ink-muted">
          Breakdowns{' '}
          <span className={`font-medium ${breakdownChange <= 0 ? 'text-success-700' : 'text-danger-700'}`}>
            {breakdownChange > 0 ? '+' : ''}
            {breakdownChange}%
          </span>{' '}
          vs last month
        </p>
      </div>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={serviceVolume} barGap={4} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#E3E8EF" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#8A96A5', fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8A96A5', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: '#F5F7FA' }}
              contentStyle={{ borderRadius: 8, border: '1px solid #E3E8EF', fontSize: 12, boxShadow: '0 4px 12px rgba(15,27,45,0.08)' }} />
            
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="serviceVisits" name="Service visits" fill="#1B64B5" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="breakdowns" name="Breakdowns" fill="#E0301E" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="installations" name="Installations" fill="#AECDEF" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>);

}