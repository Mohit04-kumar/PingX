import React from 'react';
import { CREATOR_CONFIG } from '../../config/creator.config';
import { 
  MessageSquare, 
  Bot, 
  ShoppingBag, 
  Mail, 
  ExternalLink,
  Code,
  Layers,
  Award
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, YoutubeIcon } from '../common/SocialIcons';

export function AboutView() {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/40 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white font-heading">About PingX</h2>
            <p className="text-xs text-purple-300">Connect. Communicate. Discover.</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed">
          PingX is an AI-powered communication and discovery platform designed to make messaging, assistance, and everyday digital actions simpler, faster, and more unified.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h4 className="font-bold text-white text-sm font-heading">Communication</h4>
          <p className="text-gray-300">Real-time 1-on-1 and Group chats with typing status, reactions, and smart reply suggestions.</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <h4 className="font-bold text-white text-sm font-heading">Contextual AI</h4>
          <p className="text-gray-300">A floating assistant that adapts prompts automatically based on active chats, group summaries, or shop items.</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <ShoppingBag className="w-5 h-5 text-emerald-400" />
          <h4 className="font-bold text-white text-sm font-heading">Smart Shopping</h4>
          <p className="text-gray-300">Search and compare products across Amazon, Flipkart, and Croma with direct merchant checkout links.</p>
        </div>
      </div>

      {/* Architecture Flow Diagram */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" /> Platform Architecture: Conversation → AI → Action
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center font-mono">
          <div className="glass-card p-3 rounded-xl border-indigo-500/30 text-indigo-300">
            [1. Message Input] <br /> "Let's meet Sunday 6 PM"
          </div>
          <div className="glass-card p-3 rounded-xl border-purple-500/30 text-purple-300">
            [2. PingX AI Context] <br /> Parse Date & Time
          </div>
          <div className="glass-card p-3 rounded-xl border-emerald-500/30 text-emerald-300">
            [3. Action Trigger] <br /> Add Reminder to Pings 🔔
          </div>
        </div>
      </div>

      {/* Creator Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/40 bg-gradient-to-br from-purple-900/30 to-indigo-950/40 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-extrabold text-white text-xl shadow-lg">
              P
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Creator & Developer</span>
              <h3 className="text-xl font-bold text-white font-heading">{CREATOR_CONFIG.name}</h3>
              <p className="text-xs text-gray-300">{CREATOR_CONFIG.role}</p>
            </div>
          </div>

          {CREATOR_CONFIG.portfolioUrl && (
            <a
              href={CREATOR_CONFIG.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pingx-glow-button px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg"
            >
              My Portfolio <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Project Details for Viva */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="glass-card p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-gray-400 font-mono">PROJECT SPECIFICATION</span>
            <p className="font-bold text-white">{CREATOR_CONFIG.projectTitle}</p>
          </div>
          <div className="glass-card p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-gray-400 font-mono">ACADEMIC & VERSION</span>
            <p className="font-bold text-purple-300">{CREATOR_CONFIG.collegeName} (v{CREATOR_CONFIG.version})</p>
          </div>
        </div>

        {/* Social Links Bar */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-gray-300">Let's Connect</h4>
          <div className="flex flex-wrap gap-3">
            {CREATOR_CONFIG.githubUrl && (
              <a href={CREATOR_CONFIG.githubUrl} target="_blank" rel="noopener noreferrer" className="glass-card px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:text-white flex items-center gap-2 border-white/10">
                <GithubIcon className="w-4 h-4 text-purple-400" /> GitHub
              </a>
            )}
            {CREATOR_CONFIG.linkedinUrl && (
              <a href={CREATOR_CONFIG.linkedinUrl} target="_blank" rel="noopener noreferrer" className="glass-card px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:text-white flex items-center gap-2 border-white/10">
                <LinkedinIcon className="w-4 h-4 text-blue-400" /> LinkedIn
              </a>
            )}
            {CREATOR_CONFIG.instagramUrl && (
              <a href={CREATOR_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="glass-card px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:text-white flex items-center gap-2 border-white/10">
                <InstagramIcon className="w-4 h-4 text-pink-400" /> Instagram
              </a>
            )}
            {CREATOR_CONFIG.youtubeUrl && (
              <a href={CREATOR_CONFIG.youtubeUrl} target="_blank" rel="noopener noreferrer" className="glass-card px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:text-white flex items-center gap-2 border-white/10">
                <YoutubeIcon className="w-4 h-4 text-red-400" /> YouTube
              </a>
            )}
            <a href={`mailto:${CREATOR_CONFIG.email}`} className="glass-card px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:text-white flex items-center gap-2 border-white/10">
              <Mail className="w-4 h-4 text-emerald-400" /> Email Me
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
