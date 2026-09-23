import React, { useState, useRef } from 'react';
import { useAI } from '../../context/AIContext';
import { 
  Bot, 
  Wand2, 
  FileText, 
  ShoppingBag, 
  Send, 
  RefreshCw, 
  Cpu, 
  Paperclip, 
  Image as ImageIcon, 
  X, 
  Copy, 
  Check, 
  GitBranch, 
  Sparkles,
  ExternalLink,
  Tag
} from 'lucide-react';
import { AIBranch } from '../smoothui/ai-branch/AIBranch';

export function AIView() {
  const { aiMessages, sendAIMessage, isAiLoading, aiMode, setAiMode } = useAI();
  const [promptInput, setPromptInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5');
  const [selectedImage, setSelectedImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showBranchExplorer, setShowBranchExplorer] = useState(false);

  const sampleBranches = [
    {
      id: 'b1',
      title: 'Concise Bullet Summary',
      userMessage: 'Compare Sony WH-1000XM5 vs Bose QuietComfort Ultra for daily commuting',
      aiResponse: '• Sony WH-1000XM5 (₹25,990): Industry-leading 30hr battery with ANC, 8 microphones for crisp phone calls, and lightweight 250g chassis.\n• Bose QC Ultra (₹31,490): Unrivaled active noise cancellation in noisy metro/flights, superior spatial audio, and compact folding design.\n• Verdict: Sony offers better value & call clarity; Bose leads in maximum low-frequency isolation.',
      tags: ['Best Value', 'Audio', '30hr Battery']
    },
    {
      id: 'b2',
      title: 'In-Depth Technical Analysis',
      userMessage: 'Compare Sony WH-1000XM5 vs Bose QuietComfort Ultra for daily commuting',
      aiResponse: '• Driver Architecture: Sony utilizes 30mm carbon fiber composite drivers delivering neutral acoustic precision. Bose features custom proprietary transducers with Immersion Audio.\n• Codec Support: Sony supports LDAC up to 990kbps (Hi-Res Audio Wireless certified). Bose supports Qualcomm aptX Adaptive via Snapdragon Sound.\n• Commuter Recommendation: Sony is superior for Android users with LDAC; Bose provides better wind-noise reduction.',
      tags: ['LDAC', 'aptX Adaptive', 'Acoustic Precision']
    },
    {
      id: 'b3',
      title: 'Merchant Deals & Lowest Price',
      userMessage: 'Compare Sony WH-1000XM5 vs Bose QuietComfort Ultra for daily commuting',
      aiResponse: '• Amazon.in: Sony WH-1000XM5 at ₹25,990 (Instant ICICI card discount applied).\n• Croma: Bose QC Ultra at ₹31,490 with free 1-year extended warranty.\n• Flipkart: Sony at ₹26,499 with 5% Unlimited Cashback on Flipkart Axis Card.',
      tags: ['Deal Alert', 'Amazon', 'Croma']
    }
  ];

  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!promptInput.trim() && !selectedImage) return;
    sendAIMessage(promptInput.trim() || 'Analyze attached image', selectedImage);
    setPromptInput('');
    setSelectedImage(null);
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-10">
      
      <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />

      {/* Header Banner - Sleek Light Aesthetic matching PingX Dashboard */}
      <div className="rounded-3xl p-6 border border-violet-100 bg-gradient-to-r from-violet-50/80 via-indigo-50/60 to-purple-50/70 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-violet-200 shadow-sm group-hover:scale-105 transition-transform bg-white flex items-center justify-center">
            <Bot className="w-8 h-8 text-violet-600" />
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
                PingX AI Studio & Multimodal Vision
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-100 text-violet-700 border border-violet-200/60">
                Pillar 2
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Secure full-stack assistant for chat summaries, multi-merchant price comparison, and multimodal analysis.
            </p>
          </div>
        </div>

        {/* Model Switcher & Branch Mode Pill */}
        <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold relative z-10 flex-wrap">
          <div className="flex items-center gap-1.5 px-2">
            <Cpu className="w-4 h-4 text-violet-600" />
            <button
              onClick={() => setSelectedModel('gemini-1.5')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedModel === 'gemini-1.5' 
                  ? 'bg-violet-600 text-white font-bold shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gemini 1.5 Flash
            </button>
          </div>

          <button
            onClick={() => setShowBranchExplorer(!showBranchExplorer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              showBranchExplorer 
                ? 'bg-amber-600 text-white font-bold shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle Multi-Branch Conversation Flow"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Reasoning Branches</span>
          </button>
        </div>
      </div>

      {/* Suggested Actions Grid - Crisp Light Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => sendAIMessage('📝 Summarize my recent conversations')}
          className="bg-white p-4 rounded-2xl text-left border border-slate-200/80 hover:border-violet-300 space-y-2 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 font-heading">Chat Summarizer</h4>
          <p className="text-[11px] text-slate-500">Extract tasks, deadlines & decisions</p>
        </button>

        <button
          onClick={() => sendAIMessage('🛍️ Compare noise-canceling headphones under ₹8,000')}
          className="bg-white p-4 rounded-2xl text-left border border-slate-200/80 hover:border-emerald-300 space-y-2 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 font-heading">Smart Shopping</h4>
          <p className="text-[11px] text-slate-500">Compare Amazon, Flipkart & Croma</p>
        </button>

        <button
          onClick={() => sendAIMessage('✍️ Help me write a professional project update message')}
          className="bg-white p-4 rounded-2xl text-left border border-slate-200/80 hover:border-indigo-300 space-y-2 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
            <Wand2 className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 font-heading">Writer & Ghostwriter</h4>
          <p className="text-[11px] text-slate-500">Draft emails, leaves & chat updates</p>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-white p-4 rounded-2xl text-left border border-slate-200/80 hover:border-blue-300 space-y-2 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 font-heading">Multimodal Vision</h4>
          <p className="text-[11px] text-slate-500">Attach screenshot or product photo</p>
        </button>
      </div>

      {/* Main Conversation Feed - Crisp White Surface */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 min-h-[460px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[440px] text-xs pr-2">
          
          {/* SmoothUI AI Branch Interactive Flow */}
          {showBranchExplorer && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 mb-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <GitBranch className="w-4 h-4 text-amber-600" />
                  <span>Interactive AI Reasoning Branches</span>
                </div>
                <span className="text-[11px] text-amber-600">Compare different synthesis styles</span>
              </div>
              <AIBranch branches={sampleBranches} />
            </div>
          )}

          {/* Conversation Stream */}
          {aiMessages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} space-y-1.5 group`}>
                <div className="flex items-center gap-1.5 px-1">
                  {isAI ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-violet-700 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-violet-600" /> PingX AI
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400">You</span>
                  )}
                </div>

                <div className={`p-4 rounded-2xl max-w-[90%] sm:max-w-[82%] leading-relaxed relative ${
                  isAI 
                    ? 'bg-slate-50/80 border border-slate-200/90 text-slate-800 rounded-tl-sm shadow-xs font-sans' 
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-tr-sm shadow-sm'
                }`}>
                  {msg.image && (
                    <div className="mb-2.5 rounded-xl overflow-hidden max-w-xs border border-slate-200 shadow-xs">
                      <img src={msg.image} alt="Uploaded for AI Analysis" className="w-full h-auto max-h-48 object-cover" />
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap text-[13px] leading-6">{msg.content}</div>

                  {/* Structured Smart Shop Product Cards */}
                  {isAI && msg.products && msg.products.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-2">
                      <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">
                        Verified Live Merchant Comparisons
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.products.map((p) => {
                          const bestOffer = p.offers?.slice().sort((a,b) => a.price - b.price)?.[0];
                          return (
                            <div key={p.id} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
                              <img src={p.image} alt={p.title} className="w-11 h-11 rounded-lg object-cover border border-slate-100 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <h5 className="text-[11px] font-bold text-slate-800 truncate">{p.title}</h5>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[12px] font-extrabold text-violet-700">₹{bestOffer?.price?.toLocaleString('en-IN')}</span>
                                  {bestOffer?.discount && (
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-md">
                                      {bestOffer.discount}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500 block truncate">Lowest on {bestOffer?.marketplace}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Suggestion Chips */}
                  {isAI && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => sendAIMessage(sug)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-violet-50 text-slate-600 hover:text-violet-700 border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  {isAI && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="text-[11px] font-medium text-slate-500 hover:text-violet-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId === msg.id ? 'Copied to clipboard' : 'Copy response'}
                      </button>

                      <span className="text-[10px] font-mono text-slate-400">{msg.timestamp || 'Just now'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isAiLoading && (
            <div className="flex items-center gap-2.5 text-xs text-violet-700 bg-violet-50/80 p-3.5 rounded-2xl border border-violet-200/80 w-60 animate-pulse">
              <RefreshCw className="w-4 h-4 text-violet-600 animate-spin" />
              <span className="font-semibold">Synthesizing intelligence...</span>
            </div>
          )}
        </div>

        {/* Selected Image Attachment Badge Preview */}
        {selectedImage && (
          <div className="p-2.5 bg-violet-50 border border-violet-200 rounded-2xl flex items-center justify-between text-xs text-violet-900">
            <div className="flex items-center gap-2.5">
              <img src={selectedImage} alt="Selected Attachment" className="w-9 h-9 rounded-xl object-cover border border-violet-200" />
              <div>
                <span className="font-bold block">Image attached for Multimodal Analysis</span>
                <span className="text-[10px] text-violet-600">Ready to send to Gemini vision engine</span>
              </div>
            </div>
            <button onClick={() => setSelectedImage(null)} className="p-1.5 hover:bg-violet-200/50 rounded-lg text-slate-600 hover:text-red-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Form - Clean Light Palette */}
        <div className="flex items-center gap-2.5 pt-3.5 border-t border-slate-200">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-xl bg-slate-100 hover:bg-violet-50 text-slate-600 hover:text-violet-600 border border-slate-200 transition-colors cursor-pointer"
            title="Upload Image for AI Analysis"
          >
            <Paperclip className="w-4.5 h-4.5" />
          </button>
          
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask PingX AI, compare product deals, or summarize chats..."
            className="flex-1 bg-slate-50 hover:bg-white focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
          />

          <button
            onClick={handleSend}
            disabled={!promptInput.trim() && !selectedImage}
            className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-sm transition-all hover:shadow-md"
          >
            Send <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
