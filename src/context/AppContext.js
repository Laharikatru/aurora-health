import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('splash');
  const [hydration, setHydration] = useState({ current: 0, goal: 2500, history: [] });
  const [sleep, setSleep] = useState({ last: 0, history: [], goal: 8 });
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Meditation', icon: '🧘', done: false, streak: 3 },
    { id: 2, name: 'Evening Walk', icon: '🚶', done: false, streak: 7 },
    { id: 3, name: 'Read 20 mins', icon: '📚', done: false, streak: 1 },
    { id: 4, name: 'Take Vitamins', icon: '💊', done: true, streak: 5 },
  ]);
  const [meals, setMeals] = useState({ breakfast: null, lunch: null, dinner: null, snacks: [], calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Aurora, your personal health companion 🌟 How are you feeling today? You can ask me about your health progress, log water intake, sleep, or habits — just speak or type!" }
  ]);

  // Load from Firestore when user logs in
  useEffect(() => {
    const savedUser = localStorage.getItem('aurora_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      loadFromFirestore(u.uid || u.email);
    }
  }, []);
  const loadFromFirestore = async (userId) => {
    try {
      const snap = await getDoc(doc(db, 'users', userId, 'healthData', 'current'));
      if (snap.exists()) {
        const d = snap.data();
        if (d.hydration) setHydration(d.hydration);
        if (d.sleep) setSleep(d.sleep);
        if (d.habits) setHabits(d.habits);
        if (d.meals) setMeals(d.meals);
      }
    } catch (e) { console.log('Load error:', e); }
  };

  const saveToFirestore = async (userId, data) => {
    try {
      await setDoc(doc(db, 'users', userId, 'healthData', 'current'), {
        ...data, updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) { console.log('Save error:', e); }
  };

  const getUserId = () => {
    const u = JSON.parse(localStorage.getItem('aurora_user') || '{}');
    return u.uid || u.email || 'guest';
  };

  const addWater = (amount) => {
    setHydration(h => {
      const updated = { ...h, current: Math.min(h.current + amount, h.goal) };
      saveToFirestore(getUserId(), { hydration: updated });
      return updated;
    });
  };

  const logSleep = (hours) => {
    setSleep(s => {
      const updated = { ...s, last: hours, history: [...s.history.slice(-6), { date: new Date().toLocaleDateString(), hours }] };
      saveToFirestore(getUserId(), { sleep: updated });
      return updated;
    });
  };

  const toggleHabit = (id) => {
    setHabits(h => {
      const updated = h.map(habit => habit.id === id ? { ...habit, done: !habit.done, streak: !habit.done ? habit.streak + 1 : habit.streak } : habit);
      saveToFirestore(getUserId(), { habits: updated });
      return updated;
    });
  };

  const addHabit = (name, icon) => {
    setHabits(h => {
      const updated = [...h, { id: Date.now(), name, icon, done: false, streak: 0 }];
      saveToFirestore(getUserId(), { habits: updated });
      return updated;
    });
  };

  const logMeal = (type, name, calories, protein, carbs, fat) => {
    setMeals(m => {
      const updated = { ...m, [type]: name, calories: m.calories + calories, protein: m.protein + protein, carbs: m.carbs + carbs, fat: m.fat + fat };
      saveToFirestore(getUserId(), { meals: updated });
      return updated;
    });
  };

  const handleSetUser = (userData) => {
    const uid = userData.email?.replace(/[^a-zA-Z0-9]/g, '_') || 'guest';
    const userWithId = { ...userData, uid };
    localStorage.setItem('aurora_user', JSON.stringify(userWithId));
    setUser(userWithId);
    saveToFirestore(uid, { profile: userWithId });
  };

  return (
    <AppContext.Provider value={{
      user, setUser: handleSetUser, currentPage, setCurrentPage,
      hydration, addWater, sleep, logSleep,
      habits, toggleHabit, addHabit,
      meals, logMeal,
      aiMessages, setAiMessages
    }}>
      {children}
    </AppContext.Provider>
  );
};
