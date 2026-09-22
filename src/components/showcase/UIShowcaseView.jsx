import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Zap, 
  Sliders, 
  Layers, 
  Table, 
  Bell, 
  CreditCard, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { SlideOverDrawer } from '../common/SlideOverDrawer';

export function UIShowcaseView() {
  const { addToast } = useToast();
  
  // Interactive state demos
  const [activeTabDemo, setActiveTabDemo] = useState('forms');
  const [selectedTags, setSelectedTags] = useState(['React', 'Tailwind', 'Vite']);
  const [toggleSwitch, setToggleSwitch] = useState(true);
  const [rangeVal, setRangeVal] = useState(75);
  const [inputValue, setInputValue] = useState('');
  
  // Slide Over Drawer demo state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState({ title: '', content: '' });

  const handleOpenDrawer = (title, content) => {
    setDrawerData({ title, content });
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto text-white">
      
      {/* Top Header Banner */}
      <div className="bg-[#1e2353] p-8 rounded-3xl border border-[#5865f2]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#ec48bd]/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5865f2]/20 text-[#35ed7e] text-xs font-mono font-black border border-[#5865f2]/30">
            <Layers className="w-4 h-4 text-[#ec48bd]" /> PAGE FLOWS WEB UI COMPONENTS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight uppercase">
            PINGX UI COMPONENT GALLERY
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl font-medium leading-relaxed">
            Inspired by Page Flows SaaS design patterns. Explore interactive forms, toast notifications, slide-over drawers, multi-merchant comparison cards, and custom Discord-theme controls.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#5865f2]/20 pb-4 overflow-x-auto">
        {[
          { id: 'forms', label: 'Forms & Inputs', icon: Sliders },
          { id: 'buttons', label: 'Buttons & Badges', icon: Layers },
          { id: 'toasts', label: 'Toast Banners', icon: Bell },
          { id: 'drawers', label: 'Drawers & Modals', icon: CreditCard },
          { id: 'tables', label: 'Data Tables', icon: Table }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabDemo === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabDemo(tab.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap uppercase tracking-wide ${
                isActive
                  ? 'bg-[#5865f2] text-white shadow-lg shadow-[#5865f2]/40'
                  : 'bg-[#1e2353] text-gray-300 hover:text-white border border-[#5865f2]/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: FORMS & INPUTS --- */}
      {activeTabDemo === 'forms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          
          {/* Glass Form Inputs */}
          <div className="bg-[#1e2353] p-6 rounded-3xl border border-[#5865f2]/30 space-y-5">
            <h3 className="text-base font-black font-heading text-white uppercase tracking-wide">Text Inputs & Search</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Glass Search Input</label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search components or query AI..."
                className="w-full glass-input px-4 py-3 text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Tag Input Chips</label>
              <div className="flex flex-wrap gap-2 p-3 bg-[#0a0d3a] rounded-2xl border border-[#5865f2]/30">
                {selectedTags.map((t) => (
                  <span key={t} className="bg-[#5865f2] text-white text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5">
                    {t}
                    <button onClick={() => setSelectedTags(selectedTags.filter(tag => tag !== t))} className="hover:text-[#ed4245]">×</button>
                  </span>
                ))}
                <button
                  onClick={() => setSelectedTags([...selectedTags, `Tag #${selectedTags.length + 1}`])}
                  className="text-xs font-bold text-[#35ed7e] hover:underline flex items-center gap-1 ml-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Controls & Switches */}
          <div className="bg-[#1e2353] p-6 rounded-3xl border border-[#5865f2]/30 space-y-6">
            <h3 className="text-base font-black font-heading text-white uppercase tracking-wide">Toggles & Range Sliders</h3>

            <div className="flex items-center justify-between p-4 bg-[#0a0d3a] rounded-2xl border border-[#5865f2]/30">
              <div>
                <p className="text-xs font-black text-white">Live Price Alerts</p>
                <p className="text-[11px] text-gray-300">Receive notifications on instant 30%+ price drops</p>
              </div>
              <button
                onClick={() => setToggleSwitch(!toggleSwitch)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  toggleSwitch ? 'bg-[#35ed7e]' : 'bg-[#23272a]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                    toggleSwitch ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2 p-4 bg-[#0a0d3a] rounded-2xl border border-[#5865f2]/30">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">AI Response Depth</span>
                <span className="text-[#35ed7e]">{rangeVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rangeVal}
                onChange={(e) => setRangeVal(e.target.value)}
                className="w-full accent-[#35ed7e] cursor-pointer"
              />
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 2: BUTTONS & BADGES --- */}
      {activeTabDemo === 'buttons' && (
        <div className="bg-[#1e2353] p-8 rounded-3xl border border-[#5865f2]/30 space-y-6 animate-fadeIn">
          <h3 className="text-lg font-black font-heading uppercase text-white">Discord & Page Flows Button Palette</h3>

          <div className="flex flex-wrap items-center gap-4">
            <button className="btn-discord-green px-6 py-3 text-xs font-black uppercase tracking-wide cursor-pointer shadow-lg">
              Electric Green CTA
            </button>
            
            <button className="btn-discord-blurple px-6 py-3 text-xs font-bold uppercase tracking-wide cursor-pointer shadow-lg">
              Blurple Standard CTA
            </button>

            <button className="btn-discord-ghost px-6 py-3 text-xs font-bold uppercase tracking-wide cursor-pointer">
              Ghost Surface Button
            </button>

            <button className="bg-[#ec48bd] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wide hover:bg-[#d63ba7] transition-all cursor-pointer shadow-lg">
              Magenta Featured Action
            </button>
          </div>

          <div className="border-t border-[#5865f2]/20 pt-6 space-y-3">
            <h4 className="text-xs font-black text-[#5865f2] uppercase font-heading">Status Chips & Category Badges</h4>
            <div className="flex flex-wrap gap-3">
              <span className="bg-[#35ed7e]/20 text-[#35ed7e] border border-[#35ed7e]/40 text-xs font-black px-3.5 py-1.5 rounded-xl">
                ● LIVE SYNC
              </span>
              <span className="bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/40 text-xs font-black px-3.5 py-1.5 rounded-xl">
                DISCORD V2.5
              </span>
              <span className="bg-[#ec48bd]/20 text-[#ec48bd] border border-[#ec48bd]/40 text-xs font-black px-3.5 py-1.5 rounded-xl">
                AI BOT READY
              </span>
              <span className="bg-[#fee75c]/20 text-[#fee75c] border border-[#fee75c]/40 text-xs font-black px-3.5 py-1.5 rounded-xl">
                ★ BEST VALUE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: TOAST BANNERS --- */}
      {activeTabDemo === 'toasts' && (
        <div className="bg-[#1e2353] p-8 rounded-3xl border border-[#5865f2]/30 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-black font-heading uppercase text-white">Interactive Toast Notification Banners</h3>
            <p className="text-xs text-gray-300 font-medium">Click any trigger below to dispatch a live toast notification stack to the top-right corner.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <button
              onClick={() => addToast('Deal Alert Triggered!', 'Sony WH-1000XM5 price dropped 47% on Amazon.', 'deal')}
              className="p-4 rounded-2xl bg-[#ec48bd]/20 border border-[#ec48bd]/40 text-left hover:bg-[#ec48bd]/30 transition-all cursor-pointer space-y-1"
            >
              <Zap className="w-5 h-5 text-[#ec48bd]" />
              <p className="text-xs font-black text-white">Deal Toast</p>
              <p className="text-[10px] text-gray-300">Price drop alert</p>
            </button>

            <button
              onClick={() => addToast('Action Completed Successfully', 'Your chat contact has been updated.', 'success')}
              className="p-4 rounded-2xl bg-[#35ed7e]/20 border border-[#35ed7e]/40 text-left hover:bg-[#35ed7e]/30 transition-all cursor-pointer space-y-1"
            >
              <CheckCircle2 className="w-5 h-5 text-[#35ed7e]" />
              <p className="text-xs font-black text-white">Success Toast</p>
              <p className="text-[10px] text-gray-300">Green confirm alert</p>
            </button>

            <button
              onClick={() => addToast('System Notice', 'PingX background sync will update in 10 minutes.', 'info')}
              className="p-4 rounded-2xl bg-[#5865f2]/20 border border-[#5865f2]/40 text-left hover:bg-[#5865f2]/30 transition-all cursor-pointer space-y-1"
            >
              <Info className="w-5 h-5 text-[#5865f2]" />
              <p className="text-xs font-black text-white">Info Toast</p>
              <p className="text-[10px] text-gray-300">Blurple information alert</p>
            </button>

            <button
              onClick={() => addToast('Low Stock Alert', 'Only 2 items left at discount price on Flipkart.', 'warning')}
              className="p-4 rounded-2xl bg-[#fee75c]/20 border border-[#fee75c]/40 text-left hover:bg-[#fee75c]/30 transition-all cursor-pointer space-y-1"
            >
              <AlertTriangle className="w-5 h-5 text-[#fee75c]" />
              <p className="text-xs font-black text-white">Warning Toast</p>
              <p className="text-[10px] text-gray-300">Yellow warning alert</p>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 4: DRAWERS & MODALS --- */}
      {activeTabDemo === 'drawers' && (
        <div className="bg-[#1e2353] p-8 rounded-3xl border border-[#5865f2]/30 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-black font-heading uppercase text-white">Slide-Over Drawers & Overlay Triggers</h3>
            <p className="text-xs text-gray-300 font-medium">Page Flows inspired right-hand slide-over drawer panel for displaying deep specs and metadata.</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleOpenDrawer(
                'Sony WH-1000XM5 Deep Specs',
                'Detailed multi-merchant availability, battery specs (30 hrs), ANC noise reduction test results, and historical price graph.'
              )}
              className="btn-discord-green px-6 py-3 text-xs font-black uppercase tracking-wide cursor-pointer flex items-center gap-2"
            >
              Open Product Drawer
              <ChevronRight className="w-4 h-4 text-black stroke-[3]" />
            </button>

            <button
              onClick={() => handleOpenDrawer(
                'AI Assistant Prompt History',
                'List of recent automated prompts, focus mode logs, and theme color adjustments.'
              )}
              className="btn-discord-blurple px-6 py-3 text-xs font-bold uppercase tracking-wide cursor-pointer flex items-center gap-2"
            >
              Open AI Log Drawer
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 5: DATA TABLES --- */}
      {activeTabDemo === 'tables' && (
        <div className="bg-[#1e2353] p-6 rounded-3xl border border-[#5865f2]/30 space-y-4 animate-fadeIn overflow-x-auto">
          <h3 className="text-lg font-black font-heading uppercase text-white">Interactive SaaS Data Table</h3>
          
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#5865f2]/30 text-gray-300 font-black uppercase font-heading">
                <th className="p-3">Component Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Design System Token</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right font-heading">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5865f2]/10 font-medium">
              {[
                { name: 'Multi-Select Dropdown', cat: 'Forms', token: '#5865f2 Blurple', status: 'Active' },
                { name: 'Toast Banner Stack', cat: 'Notifications', token: '#35ed7e Green', status: 'Active' },
                { name: 'Slide-Over Drawer', cat: 'Overlay Panels', token: '#1e2353 Surface', status: 'Active' },
                { name: 'Merchant Compare Table', cat: 'E-Commerce Matrix', token: '#ec48bd Magenta', status: 'Active' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#0a0d3a]/50 transition-colors">
                  <td className="p-3 font-bold text-white">{row.name}</td>
                  <td className="p-3 text-gray-300">{row.cat}</td>
                  <td className="p-3 font-mono text-[11px] text-[#5865f2]">{row.token}</td>
                  <td className="p-3">
                    <span className="bg-[#35ed7e]/20 text-[#35ed7e] text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => addToast(`Inspecting ${row.name}`, 'Component loaded cleanly.', 'info')} className="text-xs font-bold text-[#5865f2] hover:underline">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide Over Drawer Instance */}
      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerData.title}
        subtitle="Page Flows Inspector Drawer"
      >
        <div className="space-y-4 text-xs font-medium leading-relaxed text-gray-300">
          <div className="p-4 bg-[#0a0d3a] rounded-2xl border border-[#5865f2]/30">
            <p className="text-white font-bold mb-1">Overview Description:</p>
            <p>{drawerData.content}</p>
          </div>
          <div className="p-4 bg-[#0a0d3a] rounded-2xl border border-[#35ed7e]/30 space-y-2">
            <p className="text-[#35ed7e] font-black uppercase text-[11px] font-heading">Features Included:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-200">
              <li>Auto-dismiss progress timer</li>
              <li>Discord dark indigo surface styling</li>
              <li>Accessible keyboard navigation (ESC)</li>
            </ul>
          </div>
        </div>
      </SlideOverDrawer>

    </div>
  );
}
