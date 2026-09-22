import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAI } from '../../context/AIContext';
import { 
  X, 
  Send, 
  Mic, 
  Wand2, 
  FileText, 
  Globe, 
  ShoppingBag, 
  MessageSquare,
  RefreshCw,
  CheckCheck,
  Bot
} from 'lucide-react';

export function AIPopupPanel() {
  const { 
    isAIPopupOpen, 
    setIsAIPopupOpen, 
    aiMessages, 
    sendAIMessage, 
    isAiLoading, 
    contextType, 
    contextItem, 
    contextPrompts,
    aiMode,
    setAiMode
  } = useAI();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const panelRef = useRef(null);

  // Auto-close/minimize when clicking outside the panel
  useEffect(() => {
    if (!isAIPopupOpen) return;

    const handlePointerDownOutside = (event) => {
      // If clicking inside the assistant panel, ignore
      if (panelRef.current && panelRef.current.contains(event.target)) {
        return;
      }
      // If clicking the launcher toggle button, ignore (it toggles separately)
      if (event.target && event.target.closest && event.target.closest('#floating-ai-launcher')) {
        return;
      }
      setIsAIPopupOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside);
    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
    };
  }, [isAIPopupOpen, setIsAIPopupOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  if (!isAIPopupOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isAiLoading) return;
    sendAIMessage(input);
    setInput('');
  };

  const handleSelectPrompt = (promptText) => {
    sendAIMessage(promptText);
  };

  // Clean Markdown & Line-by-Line Formatter without raw asterisks
  const formatText = (text) => {
    if (!text) return '';
    // Clean out stray asterisks and format lines
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Parse **bold** into <strong> cleanly
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-extrabold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');

      return (
        <p key={idx} className={`${isBullet ? 'pl-2 py-0.5 font-medium' : 'py-0.5'} leading-relaxed`}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, scale: 0.95, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 14 }}
      transition={{ type: 'spring', damping: 28, stiffness: 400 }}
      className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[430px] rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[620px] backdrop-blur-xl"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.18)'
      }}
    >
      {/* Panel Header */}
      <div
        className="p-3.5 px-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold font-heading tracking-tight" style={{ color: 'var(--text-primary)' }}>
              PingX Assistant
            </h4>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
              Instant Answers & Deal Help
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher: Platform vs ChatGPT Mode */}
          <div
            className="flex items-center p-0.5 rounded-xl border text-[11px] font-bold"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
          >
            <button
              type="button"
              onClick={() => setAiMode && setAiMode('platform')}
              className="px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[10px]"
              style={{
                backgroundColor: aiMode === 'platform' ? 'var(--accent)' : 'transparent',
                color: aiMode === 'platform' ? '#fff' : 'var(--text-secondary)'
              }}
              title="Answers specifically about PingX features"
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setAiMode && setAiMode('chatgpt')}
              className="px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[10px]"
              style={{
                backgroundColor: aiMode === 'chatgpt' ? 'var(--accent)' : 'transparent',
                color: aiMode === 'chatgpt' ? '#fff' : 'var(--text-secondary)'
              }}
              title="Conversational AI like ChatGPT"
            >
              ChatGPT
            </button>
          </div>

          <button
            onClick={() => setIsAIPopupOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-75 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div
        className="p-2.5 px-3 border-b overflow-x-auto flex items-center gap-2 text-[11px]"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
      >
        <button
          onClick={() => handleSelectPrompt('💬 Ask anything')}
          className="px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 border cursor-pointer hover:scale-102 transition-transform"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <MessageSquare className="w-3 h-3" style={{ color: 'var(--accent)' }} /> Ask
        </button>
        <button
          onClick={() => handleSelectPrompt('🛍️ Shoes price')}
          className="px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 border cursor-pointer hover:scale-102 transition-transform"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <ShoppingBag className="w-3 h-3" style={{ color: 'var(--accent)' }} /> Shoes
        </button>
        <button
          onClick={() => handleSelectPrompt('📱 Phone cover')}
          className="px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 border cursor-pointer hover:scale-102 transition-transform"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <ShoppingBag className="w-3 h-3" style={{ color: 'var(--accent)' }} /> Covers
        </button>
        <button
          onClick={() => handleSelectPrompt('🌐 Translate to Hindi')}
          className="px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 border cursor-pointer hover:scale-102 transition-transform"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <Globe className="w-3 h-3" style={{ color: 'var(--accent)' }} /> Translate
        </button>
        <button
          onClick={() => handleSelectPrompt('✍️ Help write a message')}
          className="px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 border cursor-pointer hover:scale-102 transition-transform"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <Wand2 className="w-3 h-3" style={{ color: 'var(--accent)' }} /> Write
        </button>
      </div>

      {/* Messages Feed (WhatsApp-Style Bubbles) */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 text-xs"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        {aiMessages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} space-y-1 animate-fadeIn`}
            >
              <div
                className={`p-3.5 max-w-[88%] leading-relaxed shadow-sm ${
                  isAI
                    ? 'rounded-2xl rounded-tl-xs border'
                    : 'rounded-2xl rounded-tr-xs text-white'
                }`}
                style={
                  isAI
                    ? {
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)'
                      }
                    : {
                        backgroundColor: 'var(--accent)',
                        color: '#ffffff'
                      }
                }
              >
                {/* Formatted Content */}
                <div className="space-y-1 text-xs">
                  {formatText(msg.content)}
                </div>

                {/* Quick suggestions if present */}
                {msg.quickSuggestions && (
                  <div className="mt-3 pt-2 border-t flex flex-wrap gap-1.5" style={{ borderColor: 'var(--border)' }}>
                    {msg.quickSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectPrompt(sug)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-all hover:scale-105"
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp & WhatsApp delivery checkmarks */}
              <div className="flex items-center gap-1 text-[9px] px-1" style={{ color: 'var(--text-muted)' }}>
                <span>{msg.timestamp}</span>
                {!isAI && <CheckCheck className="w-3 h-3" style={{ color: 'var(--accent)' }} />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Context Suggestions Bar */}
      <div
        className="px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto text-[11px]"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider shrink-0" style={{ color: 'var(--text-muted)' }}>
          Prompts:
        </span>
        {contextPrompts.map((cp, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPrompt(cp)}
            className="px-2.5 py-0.5 rounded-full border shrink-0 text-[10px] cursor-pointer transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          >
            {cp}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t flex items-center gap-2"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={aiMode === 'platform' ? "Ask about PingX features, chats, shop..." : "Ask ChatGPT anything..."}
          className="flex-1 rounded-xl px-3.5 py-2.5 text-xs border outline-none transition-colors"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        />
        <button
          type="submit"
          disabled={isAiLoading}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white cursor-pointer shadow-md transition-transform hover:scale-105"
          style={{ backgroundColor: 'var(--accent)' }}
          title="Send"
        >
          {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </motion.div>
  );
}
