import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Home from './pages/Home';
import Hydration from './pages/Hydration';
import Sleep from './pages/Sleep';
import Habits from './pages/Habits';
import Nutrition from './pages/Nutrition';
import Companion from './pages/Companion';
import BottomNav from './components/BottomNav';
import './index.css';

function AppContent() {
  const { currentPage } = useApp();
  const pages = { splash: <Splash />, onboarding: <Onboarding />, login: <Login />, home: <Home />, hydration: <Hydration />, sleep: <Sleep />, habits: <Habits />, nutrition: <Nutrition />, companion: <Companion /> };
  return (
    <div className="app-container">
      {pages[currentPage] || <Home />}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}
