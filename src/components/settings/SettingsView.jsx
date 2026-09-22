import React, { useState } from 'react';
import { useTheme, AVAILABLE_THEMES } from '../../context/ThemeContext';
import { usePings } from '../../context/PingsContext';
import { Settings, Moon, Sun, Film, Bell, Shield, Bot, Palette, Check, Key, ExternalLink } from 'lucide-react';
import { AnimatedToggle } from '../smoothui/animated-toggle/AnimatedToggle';

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const { focusMode, toggleFocusMode } = usePings();
  const [activeTab, setActiveTab] = useState('appearance');
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => localStorage.getItem('pingx_gemini_api_key') || '');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const handleSaveGeminiKey = (e) => {
    e.preventDefault();
    const cleanKey = geminiKeyInput.trim();
    if (cleanKey) {
      localStorage.setItem('pingx_gemini_api_key', cleanKey);
    } else {
      localStorage.removeItem('pingx_gemini_api_key');
    }
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  const tabStyle = (id) => ({
    padding: '0.5rem 1.1rem',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.75rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
    backgroundColor: activeTab === id ? 'var(--accent)' : 'transparent',
    color: activeTab === id ? '#fff' : 'var(--text-secondary)',
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 animate-fadeIn">

      {/* Header card */}
      <div className="rounded-3xl p-6 flex items-center gap-4 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>
            Application Settings
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Configure themes, notifications, AI engine, and privacy.
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex p-1.5 rounded-2xl gap-1 border overflow-x-auto" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
        {[
          { id: 'appearance', label: 'Appearance' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'ai', label: 'AI Assistant' },
          { id: 'privacy', label: 'Privacy' },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={tabStyle(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="rounded-3xl p-6 border space-y-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>

        {/* ── APPEARANCE ── */}
        {activeTab === 'appearance' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Palette className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              Select Visual Theme
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {AVAILABLE_THEMES.map((t) => {
                const isSelected = theme === t.id;
                const Icon = t.id === 'dark' ? Moon : t.id === 'animation' ? Film : Sun;
                const desc = t.id === 'dark'
                  ? 'Deep slate dark interface'
                  : t.id === 'animation'
                  ? 'Live animated video background'
                  : 'Clean bright light interface';
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all hover-lift"
                    style={{
                      backgroundColor: isSelected ? 'var(--accent-soft)' : 'var(--bg-subtle)',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>{t.name}</h5>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Bell className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Notification Preferences
            </h3>
            <div className="rounded-2xl p-4 border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Focus Mode</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Mute all non-critical pings</p>
              </div>
              <AnimatedToggle
                checked={focusMode}
                onChange={toggleFocusMode}
                variant="morph"
                size="md"
                label="Toggle Focus Mode"
              />
            </div>
          </div>
        )}

        {/* ── AI ── */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Bot className="w-4 h-4" style={{ color: 'var(--accent)' }} /> AI Assistant Engine & Provider
            </h3>

            {/* Active Mode Status */}
            <div className="rounded-2xl p-4 border space-y-2" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-orange-500" />
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    {geminiKeyInput.trim() ? 'Google Gemini 2.0 / 1.5 Flash (Live Cloud API)' : 'PingX Autonomous Multi-Agent Brain (Built-in)'}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Active
                </span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {geminiKeyInput.trim() 
                  ? 'Connected directly to Google Generative AI for real-time streaming answers across all domains.'
                  : 'Zero-latency multi-agent routing: Executive Ghostwriter, Smart Shop Price Engine, Conversation Summarizer, and Code Architect.'}
              </p>
            </div>

            {/* Custom API Key Input */}
            <form onSubmit={handleSaveGeminiKey} className="rounded-2xl p-4 border space-y-3" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                  <Key className="w-3.5 h-3.5 text-orange-500" />
                  Optional: Google Gemini API Key
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold text-orange-500 hover:underline flex items-center gap-1"
                >
                  Get free key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border outline-none font-mono"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold btn-primary cursor-pointer transition-all shadow-sm"
                >
                  {apiKeySaved ? '✓ Saved' : 'Save Key'}
                </button>
              </div>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Your key is stored securely in your local browser storage and never sent to external third parties. Leave empty to use the built-in multi-agent engine.
              </p>
            </form>
          </div>
        )}

        {/* ── PRIVACY ── */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Shield className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Privacy & Security
            </h3>
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>End-to-End Encrypted Messaging</p>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>All direct messages are encrypted in transit and at rest.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
