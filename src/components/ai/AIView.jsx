import React, { useState, useRef } from 'react';
import { useAI } from '../../context/AIContext';
import { Bot, Wand2, FileText, Globe, ShoppingBag, Send, RefreshCw, Cpu, Paperclip, Image as ImageIcon, X, Copy, Check, GitBranch } from 'lucide-react';
import { AIBranch } from '../smoothui/ai-branch/AIBranch';

export function AIView() {
  const { aiMessages, sendAIMessage, isAiLoading } = useAI();
  const [promptInput, setPromptInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.6');
  const [selectedImage, setSelectedImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showBranchExplorer, setShowBranchExplorer] = useState(true);

  const sampleBranches = [
    {
      id: 'b1',
      title: 'Concise Bullet Summary',
      userMessage: 'Compare Sony WH-1000XM5 vs Bose QuietComfort Ultra for daily commuting',
      aiResponse: '• Sony WH-1000XM5 (₹26,990): Industry-leading 30hr battery with ANC, 8 microphones for crisp phone calls, and lightweight 250g chassis.\n• Bose QC Ultra (₹32,900): Unrivaled active noise cancellation in noisy metro/flights, superior spatial audio, and compact folding design.\n• Verdict: Sony offers better value & call clarity; Bose leads in maximum low-frequency isolation.',
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
      aiResponse: '• Amazon.in: Sony WH-1000XM5 at ₹25,990 (Instant ₹2,000 ICICI card discount applied).\n• Croma: Bose QC Ultra at ₹31,490 with free 1-year extended warranty.\n• Flipkart: Sony at ₹26,499 with 5% Unlimited Cashback on Flipkart Axis Card.',
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

      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-purple-500/40 bg-gradient-to-r from-purple-950/50 via-indigo-950/40 to-cyan-950/50 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-purple-400/60 shadow-xl group-hover:scale-105 transition-transform bg-purple-900 flex items-center justify-center">
            <Bot className="w-8 h-8 text-purple-300 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-black animate-pulse" />
          </div>
          
          <div>
            <h2 className="text-2xl font-extrabold text-white font-heading flex items-center gap-2">
              PingX AI Studio & Multimodal Vision
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Context-aware neural AI guide for chat summaries, product comparisons, and multimodal image analysis.
            </p>
          </div>
        </div>

        {/* Model Switcher & Branch Mode Pill */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold relative z-10 flex-wrap">
          <div className="flex items-center gap-1.5 px-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <button
              onClick={() => setSelectedModel('gemini-3.6')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${selectedModel === 'gemini-3.6' ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-gray-400'}`}
            >
              Gemini 2.0 Flash
            </button>
          </div>

          <button
            onClick={() => setShowBranchExplorer(!showBranchExplorer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              showBranchExplorer ? 'bg-orange-600 text-white font-bold shadow-md' : 'text-gray-400 hover:text-white'
            }`}
            title="Toggle Multi-Branch Conversation Flow"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Branch Navigator ({sampleBranches.length})</span>
          </button>
        </div>
      </div>

      {/* Suggested Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => sendAIMessage('📝 Summarize my recent conversations')}
          className="glass-card p-4 rounded-2xl text-left border border-purple-500/30 hover:border-purple-400 space-y-2 cursor-pointer hover-lift shadow-lg"
        >
          <FileText className="w-5 h-5 text-purple-400" />
          <h4 className="text-xs font-bold text-white font-heading">Chat Summarizer</h4>
          <p className="text-[11px] text-gray-400">Extract tasks & decisions</p>
        </button>

        <button
          onClick={() => sendAIMessage('🛍️ Compare noise-canceling headphones under ₹8,000')}
          className="glass-card p-4 rounded-2xl text-left border border-emerald-500/30 hover:border-emerald-400 space-y-2 cursor-pointer hover-lift shadow-lg"
        >
          <ShoppingBag className="w-5 h-5 text-emerald-400" />
          <h4 className="text-xs font-bold text-white font-heading">Smart Shopping</h4>
          <p className="text-[11px] text-gray-400">Find best merchant deals</p>
        </button>

        <button
          onClick={() => sendAIMessage('✍️ Help me write a professional project update message')}
          className="glass-card p-4 rounded-2xl text-left border border-indigo-500/30 hover:border-indigo-400 space-y-2 cursor-pointer hover-lift shadow-lg"
        >
          <Wand2 className="w-5 h-5 text-indigo-400" />
          <h4 className="text-xs font-bold text-white font-heading">Writer & Grammar</h4>
          <p className="text-[11px] text-gray-400">Refine email & chat text</p>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="glass-card p-4 rounded-2xl text-left border border-cyan-500/30 hover:border-cyan-400 space-y-2 cursor-pointer hover-lift shadow-lg"
        >
          <ImageIcon className="w-5 h-5 text-cyan-400" />
          <h4 className="text-xs font-bold text-white font-heading">Image Analysis</h4>
          <p className="text-[11px] text-gray-400">Upload image / screenshot</p>
        </button>
      </div>

      {/* Main Conversation Feed */}
      <div className="glass-panel rounded-3xl p-6 border border-white/15 space-y-4 min-h-[420px] flex flex-col justify-between shadow-2xl bg-black/40">
        <div className="space-y-4 overflow-y-auto max-h-[420px] text-xs pr-2">
          {/* SmoothUI AI Branch Interactive Flow */}
          {showBranchExplorer && (
            <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 mb-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                  <GitBranch className="w-4 h-4" />
                  <span>Interactive AI Branch Flow</span>
                </div>
                <span className="text-[11px] text-gray-400">Navigate alternative reasoning branches</span>
              </div>
              <AIBranch branches={sampleBranches} />
            </div>
          )}

          {aiMessages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} space-y-1 group`}>
                <div className={`p-4 rounded-2xl max-w-[88%] leading-relaxed shadow-md relative ${
                  isAI 
                    ? 'bg-purple-950/40 border border-purple-500/30 text-gray-200 rounded-tl-none font-sans' 
                    : 'pingx-glow-button text-white font-medium rounded-tr-none'
                }`}>
                  {msg.image && (
                    <div className="mb-2 rounded-xl overflow-hidden max-w-xs border border-white/20">
                      <img src={msg.image} alt="Uploaded for AI Analysis" className="w-full h-auto max-h-48 object-cover" />
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {isAI && (
                    <button
                      onClick={() => handleCopyText(msg.id, msg.content)}
                      className="mt-2 text-[10px] text-gray-400 hover:text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedId === msg.id ? 'Copied' : 'Copy Text'}
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-mono px-1">{msg.timestamp}</span>
              </div>
            );
          })}

          {isAiLoading && (
            <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 p-3 rounded-2xl border border-purple-500/30 w-48">
              <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
              <span>AI is thinking & responding...</span>
            </div>
          )}
        </div>

        {/* Selected Image Attachment Badge Preview */}
        {selectedImage && (
          <div className="p-2 bg-purple-950/60 border border-purple-500/40 rounded-2xl flex items-center justify-between text-xs text-purple-200">
            <div className="flex items-center gap-2">
              <img src={selectedImage} alt="Selected Attachment" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold truncate max-w-xs">Attached Image for AI Analysis</span>
            </div>
            <button onClick={() => setSelectedImage(null)} className="p-1 hover:text-red-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Form */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 rounded-2xl glass-card text-gray-400 hover:text-purple-400 cursor-pointer"
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
            placeholder="Ask PingX AI or attach an image screenshot..."
            className="flex-1 glass-input rounded-2xl px-4.5 py-3.5 text-xs text-white placeholder-gray-400 outline-none border-white/15"
          />

          <button
            onClick={handleSend}
            className="pingx-glow-button btn-shimmer px-7 py-3.5 rounded-2xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-xl"
          >
            Send <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
