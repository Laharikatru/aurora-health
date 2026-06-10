import React from 'react';
import { useApp } from '../context/AppContext';

const tabs = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'hydration', icon: '💧', label: 'Water' },
  { id: 'sleep', icon: '😴', label: 'Sleep' },
  { id: 'habits', icon: '✅', label: 'Habits' },
  { id: 'companion', icon: '🎙️', label: 'Aurora' },
];

export default function BottomNav() {
  const { currentPage, setCurrentPage } = useApp();
  if (['splash', 'onboarding', 'login'].includes(currentPage)) return null;
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button key={t.id} className={`nav-item ${currentPage === t.id ? 'active' : ''}`} onClick={() => setCurrentPage(t.id)}>
          <span className="nav-icon">{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
