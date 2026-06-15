import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const AI_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
export default function Companion() {
  const { aiMessages, setAiMessages, hydration, sleep, habits, meals, addWater, logSleep, toggleHabit } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const messagesEnd = useRef(null);
  const recognition = useRef(null);
  const user = JSON.parse(localStorage.getItem('aurora_user') || '{}');

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages]);

  const getSystemPrompt = () => `You are Aurora, a warm and intelligent personal health companion. 
User: ${user.name || 'Friend'}, Age: ${user.age}, Goals: ${user.goals?.join(', ')}.
Current data: Hydration: ${hydration.current}/${hydration.goal}ml (${Math.round(hydration.current/hydration.goal*100)}%). Sleep last night: ${sleep.last}h. Habits done: ${habits.filter(h=>h.done).length}/${habits.length}. Calories: ${meals.calories} kcal.
Be warm, encouraging, concise (2-3 sentences max). Always reference the user's actual numbers.
If user wants to log water/sleep/habits, include ACTION tags:
[ADD_WATER:500] to add 500ml water
[LOG_SLEEP:7] to log 7 hours sleep  
[COMPLETE_HABIT:habit_name] to complete a habit
Always respond in English. Be supportive and personal.`;

  const processActions = (text) => {
    const waterMatch = text.match(/\[ADD_WATER:(\d+)\]/);
    if (waterMatch) addWater(parseInt(waterMatch[1]));
    const sleepMatch = text.match(/\[LOG_SLEEP:([\d.]+)\]/);
    if (sleepMatch) logSleep(parseFloat(sleepMatch[1]));
    return text.replace(/\[ADD_WATER:\d+\]/g, '').replace(/\[LOG_SLEEP:[\d.]+\]/g, '').replace(/\[COMPLETE_HABIT:[^\]]+\]/g, '').trim();
  };

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[🌟💧😴✅🎯💡🔥⭐]/g, '');
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.95; utt.pitch = 1.1; utt.volume = 1;

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const female = voices.find(v =>
        v.name.includes('Female') ||
        v.name.includes('Samantha') ||
        v.name.includes('Google UK English Female') ||
        v.name.includes('Microsoft Zira')
      );
      if (female) utt.voice = female;
      utt.onstart = () => setSpeaking(true);
      utt.onend = () => setSpeaking(false);
      utt.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utt);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      trySpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => trySpeak();
    }
  };

  const sendMessage = async (msg) => {
    const userMsg = msg || input.trim();
    if (!userMsg) return;
    setInput('');
    const updated = [...aiMessages, { role: 'user', content: userMsg }];
    setAiMessages(updated);
    setLoading(true);
    try {
      const res = await axios.post(AI_URL, {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: getSystemPrompt() }, ...updated.map(m => ({ role: m.role, content: m.content }))],
        max_tokens: 200,
        temperature: 0.8
      }, {
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const raw = res.data.choices[0].message.content;
      const clean = processActions(raw);
      setAiMessages(prev => [...prev, { role: 'assistant', content: clean }]);
      speak(clean);

    } catch (e) {
      console.error('Aurora AI Error:', e.response?.status, e.response?.data || e.message);
      const fallback = "I'm having trouble connecting. Error: " + (e.response?.status || e.message);
      setAiMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
    }
    setLoading(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice not supported in this browser. Please use Chrome.'); return;
    }
    const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition.current = new SR();
    recognition.current.continuous = false; recognition.current.interimResults = false; recognition.current.lang = 'en-US';
    recognition.current.onstart = () => setListening(true);
    recognition.current.onresult = (e) => { const t = e.results[0][0].transcript; setInput(t); sendMessage(t); };
    recognition.current.onend = () => setListening(false);
    recognition.current.onerror = () => setListening(false);
    recognition.current.start();
  };

  const stopListening = () => { recognition.current?.stop(); setListening(false); };

  const quickPrompts = ["How am I doing today?", "I drank 500ml water", "I slept 7 hours", "Give me a health tip"];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a0f' }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 16px', background: '#13131f', borderBottom: '1px solid #1e1e3a', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 0 20px rgba(99,102,241,0.5)', animation: speaking ? 'pulse 1s infinite' : 'none' }}>🎙️</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Aurora</div>
            <div style={{ fontSize: 12, color: speaking ? '#10b981' : '#6366f1' }}>{speaking ? '🔊 Speaking...' : listening ? '🎤 Listening...' : '● Online'}</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {aiMessages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginRight: 10, flexShrink: 0, alignSelf: 'flex-end' }}>🌟</div>}
            <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : '#1e1e3a', fontSize: 14, lineHeight: 1.6, color: 'white' }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌟</div>
            <div style={{ background: '#1e1e3a', borderRadius: '18px 18px 18px 4px', padding: '14px 18px' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: 'pulse 1s infinite', animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Quick Prompts */}
      <div style={{ padding: '8px 16px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
        {quickPrompts.map(p => (
          <button key={p} onClick={() => sendMessage(p)} style={{ background: '#1e1e3a', border: '1px solid #3a3a6a', borderRadius: 20, padding: '8px 14px', color: '#a0a0c0', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{p}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 100px', background: '#13131f', borderTop: '1px solid #1e1e3a', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask Aurora anything..." style={{ flex: 1, borderRadius: 20, padding: '12px 16px', background: '#1e1e3a', border: '1px solid #3a3a6a', color: 'white', outline: 'none', fontSize: 14 }} />
        <button onClick={listening ? stopListening : startListening} style={{ width: 48, height: 48, fontSize: 20, flexShrink: 0, background: listening ? '#ef4444' : '#1e1e3a', border: '1px solid #3a3a6a', borderRadius: '50%', cursor: 'pointer' }}>
          {listening ? '⏹️' : '🎤'}
        </button>
        <button onClick={() => sendMessage()} style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none', borderRadius: '50%', width: 48, height: 48, color: 'white', fontSize: 20, cursor: 'pointer', flexShrink: 0 }}>→</button>
      </div>
    </div>
  );
}
