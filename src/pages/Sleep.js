import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

export default function Sleep() {
  const { sleep, logSleep } = useApp();
  const [hours, setHours] = useState('');
  const [logged, setLogged] = useState(false);

  const avg = sleep.history.length > 0 ? (sleep.history.reduce((s, h) => s + h.hours, 0) / sleep.history.length).toFixed(1) : 0;
  const chartData = sleep.history.length > 0 ? sleep.history.slice(-7) : [{ date: 'Mon', hours: 7 }, { date: 'Tue', hours: 6.5 }, { date: 'Wed', hours: 8 }, { date: 'Thu', hours: 7.5 }, { date: 'Fri', hours: 6 }, { date: 'Sat', hours: 9 }, { date: 'Sun', hours: sleep.last || 7 }];

  const handleLog = () => {
    if (hours) { logSleep(parseFloat(hours)); setLogged(true); setHours(''); }
  };

  const quality = sleep.last >= 8 ? { label: 'Excellent 🌟', color: '#10b981' } : sleep.last >= 7 ? { label: 'Good 👍', color: '#6366f1' } : sleep.last >= 6 ? { label: 'Fair 😐', color: '#f59e0b' } : { label: 'Poor 😴', color: '#ef4444' };

  return (
    <div className="page fade-in">
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>😴 Sleep</h2>
      <p style={{ color: '#666680', fontSize: 14, marginBottom: 28 }}>Understand your sleep patterns</p>

      {/* Last Night */}
      <div className="card card-glow" style={{ textAlign: 'center', padding: '28px 20px' }}>
        <div style={{ fontSize: 13, color: '#a855f7', fontWeight: 600, marginBottom: 8 }}>LAST NIGHT</div>
        <div style={{ fontSize: 64, fontWeight: 800 }} className="gradient-text">{sleep.last || '--'}</div>
        <div style={{ fontSize: 18, color: '#666680', marginBottom: 12 }}>hours</div>
        {sleep.last > 0 && <div style={{ display: 'inline-block', background: quality.color + '20', border: `1px solid ${quality.color}`, borderRadius: 20, padding: '6px 16px', color: quality.color, fontSize: 14, fontWeight: 600 }}>{quality.label}</div>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
          <div><div style={{ fontSize: 13, color: '#666680' }}>Weekly Avg</div><div style={{ fontSize: 20, fontWeight: 700 }}>{avg}h</div></div>
          <div><div style={{ fontSize: 13, color: '#666680' }}>Goal</div><div style={{ fontSize: 20, fontWeight: 700 }}>8h</div></div>
        </div>
      </div>

      {/* Log Sleep */}
      <div className="card">
        <div style={{ fontSize: 14, color: '#a0a0c0', fontWeight: 600, marginBottom: 14 }}>Log Last Night's Sleep</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="number" step="0.5" min="0" max="24" placeholder="Hours (e.g. 7.5)" value={hours} onChange={e => setHours(e.target.value)} style={{ flex: 1 }} />
          <button className="btn-primary" style={{ width: 'auto', padding: '14px 20px' }} onClick={handleLog}>Log</button>
        </div>
        {logged && <p style={{ color: '#10b981', fontSize: 13, marginTop: 8 }}>✓ Sleep logged successfully!</p>}
      </div>

      {/* Chart */}
      <div className="card">
        <div style={{ fontSize: 14, color: '#a0a0c0', fontWeight: 600, marginBottom: 14 }}>Weekly Trend</div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData} barSize={20}>
              <XAxis dataKey="date" tick={{ fill: '#555570', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: '#555570', fontSize: 11 }} axisLine={false} tickLine={false} width={25} />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => <Cell key={i} fill={i === chartData.length - 1 ? '#6366f1' : '#2a2a4a'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight */}
      <div className="insight-card">
        <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, marginBottom: 8 }}>💡 SLEEP INSIGHT</div>
        <p style={{ fontSize: 14, color: '#d0d0f0', lineHeight: 1.6 }}>
          {sleep.last >= 7 ? "You slept well! Consistent sleep improves memory, mood, and energy." : "Try going to bed 30 minutes earlier tonight for better rest."}
        </p>
      </div>
    </div>
  );
}
