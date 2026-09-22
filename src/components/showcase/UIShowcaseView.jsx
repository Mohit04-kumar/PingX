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
  const [selectedTags, setSelectedTags] = useState(['React', 'Tailwind', 'Vite', 'Light Theme']);
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
    <div className="p-6 space-y-8 max-w-7xl mx-auto text-slate-900">
      
      {/* Top Header Banner */}
      <div className="bg-white p-8 rounded-3xl border border-[#e6e2f8] shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-violet-100 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 text-[#7256c3] text-xs font-mono font-bold border border-violet-200">
            <Layers className="w-4 h-4 text-[#7256c3]" /> PINGX UI COMPONENT GALLERY
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            PingX Design System & Components
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl font-normal leading-relaxed">
            Light theme component playground. Explore interactive forms, toast notifications, slide-over drawers, multi-merchant comparison cards, and custom controls.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e6e2f8] pb-4 overflow-x-auto">
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
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#7256c3] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-[#e6e2f8] hover:bg-slate-50'
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
          
          {/* Form Inputs */}
          <div className="bg-white p-6 rounded-3xl border border-[#e6e2f8] shadow-xs space-y-5">
            <h3 className="text-base font-bold font-heading text-slate-900">Text Inputs & Search</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">Search Input</label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search components or query AI..."
                className="w-full bg-[#f8f7ff] border border-[#e6e2f8] rounded-xl px-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#7256c3]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">Tag Input Chips</label>
              <div className="flex flex-wrap gap-2 p-3 bg-[#f8f7ff] rounded-2xl border border-[#e6e2f8]">
                {selectedTags.map((t) => (
                  <span key={t} className="bg-violet-100 text-[#7256c3] text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 border border-violet-200">
                    {t}
                    <button onClick={() => setSelectedTags(selectedTags.filter(tag => tag !== t))} className="hover:text-rose-600 cursor-pointer">×</button>
                  </span>
                ))}
                <button
                  onClick={() => setSelectedTags([...selectedTags, `Tag #${selectedTags.length + 1}`])}
                  className="text-xs font-bold text-[#7256c3] hover:underline flex items-center gap-1 ml-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Controls & Switches */}
          <div className="bg-white p-6 rounded-3xl border border-[#e6e2f8] shadow-xs space-y-6">
            <h3 className="text-base font-bold font-heading text-slate-900">Toggles & Range Sliders</h3>

            <div className="flex items-center justify-between p-4 bg-[#f8f7ff] rounded-2xl border border-[#e6e2f8]">
              <div>
                <p className="text-xs font-bold text-slate-900">Live Price Alerts</p>
                <p className="text-[11px] text-slate-500">Receive notifications on instant 30%+ price drops</p>
              </div>
              <button
                onClick={() => setToggleSwitch(!toggleSwitch)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  toggleSwitch ? 'bg-[#7256c3]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                    toggleSwitch ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2 p-4 bg-[#f8f7ff] rounded-2xl border border-[#e6e2f8]">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">AI Response Depth</span>
                <span className="text-[#7256c3]">{rangeVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rangeVal}
                onChange={(e) => setRangeVal(e.target.value)}
                className="w-full accent-[#7256c3] cursor-pointer"
              />
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 2: BUTTONS & BADGES --- */}
      {activeTabDemo === 'buttons' && (
        <div className="bg-white p-8 rounded-3xl border border-[#e6e2f8] shadow-xs space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold font-heading text-slate-900">PingX Button & Badge Palette</h3>

          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs">
              Emerald Success CTA
            </button>
            
            <button className="bg-[#7256c3] hover:bg-[#6245b5] text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs">
              PingX Brand Violet CTA
            </button>

            <button className="bg-white hover:bg-slate-50 text-slate-800 border border-[#e6e2f8] px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer">
              White Neutral Surface
            </button>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs">
              Indigo Action Button
            </button>
          </div>

          <div className="border-t border-[#e6e2f8] pt-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase font-mono">Status Chips & Category Badges</h4>
            <div className="flex flex-wrap gap-3">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-xl">
                ● LIVE SYNC
              </span>
              <span className="bg-violet-50 text-[#7256c3] border border-violet-200 text-xs font-bold px-3.5 py-1.5 rounded-xl">
                PINGX LIGHT THEME
              </span>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-3.5 py-1.5 rounded-xl">
                AI BOT READY
              </span>
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-xl">
                ★ BEST VALUE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: TOAST BANNERS --- */}
      {activeTabDemo === 'toasts' && (
        <div className="bg-white p-8 rounded-3xl border border-[#e6e2f8] shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900">Interactive Toast Notification Banners</h3>
            <p className="text-xs text-slate-500 font-medium">Click any trigger below to dispatch a live toast notification stack to the top-right corner.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <button
              onClick={() => addToast('Deal Alert Triggered!', 'Sony WH-1000XM5 price dropped 47% on Amazon.', 'deal')}
              className="p-4 rounded-2xl bg-violet-50 border border-violet-200 text-left hover:bg-violet-100 transition-all cursor-pointer space-y-1"
            >
              <Zap className="w-5 h-5 text-[#7256c3]" />
              <p className="text-xs font-bold text-slate-900">Deal Toast</p>
              <p className="text-[10px] text-slate-500">Price drop alert</p>
            </button>

            <button
              onClick={() => addToast('Action Completed Successfully', 'Your chat contact has been updated.', 'success')}
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left hover:bg-emerald-100 transition-all cursor-pointer space-y-1"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="text-xs font-bold text-slate-900">Success Toast</p>
              <p className="text-[10px] text-slate-500">Green confirm alert</p>
            </button>

            <button
              onClick={() => addToast('System Notice', 'PingX background sync will update in 10 minutes.', 'info')}
              className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-left hover:bg-indigo-100 transition-all cursor-pointer space-y-1"
            >
              <Info className="w-5 h-5 text-indigo-600" />
              <p className="text-xs font-bold text-slate-900">Info Toast</p>
              <p className="text-[10px] text-slate-500">Information notice</p>
            </button>

            <button
              onClick={() => addToast('Low Stock Alert', 'Only 2 items left at discount price on Flipkart.', 'warning')}
              className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left hover:bg-amber-100 transition-all cursor-pointer space-y-1"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="text-xs font-bold text-slate-900">Warning Toast</p>
              <p className="text-[10px] text-slate-500">Yellow warning alert</p>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 4: DRAWERS & MODALS --- */}
      {activeTabDemo === 'drawers' && (
        <div className="bg-white p-8 rounded-3xl border border-[#e6e2f8] shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900">Slide-Over Drawers & Overlay Triggers</h3>
            <p className="text-xs text-slate-500 font-medium">Right-hand slide-over drawer panel for displaying deep specs and metadata.</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleOpenDrawer(
                'Sony WH-1000XM5 Deep Specs',
                'Detailed multi-merchant availability, battery specs (30 hrs), ANC noise reduction test results, and historical price graph.'
              )}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-bold cursor-pointer flex items-center gap-2 transition-colors shadow-xs"
            >
              Open Product Drawer
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={() => handleOpenDrawer(
                'AI Assistant Prompt History',
                'List of recent automated prompts, focus mode logs, and theme color adjustments.'
              )}
              className="bg-[#7256c3] hover:bg-[#6245b5] text-white px-6 py-3 rounded-2xl text-xs font-bold cursor-pointer flex items-center gap-2 transition-colors shadow-xs"
            >
              Open AI Log Drawer
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 5: DATA TABLES --- */}
      {activeTabDemo === 'tables' && (
        <div className="bg-white p-6 rounded-3xl border border-[#e6e2f8] shadow-xs space-y-4 animate-fadeIn overflow-x-auto">
          <h3 className="text-lg font-bold font-heading text-slate-900">Interactive SaaS Data Table</h3>
          
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase font-mono">
                <th className="p-3">Component Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Design Token</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {[
                { name: 'Multi-Select Dropdown', cat: 'Forms', token: '#7256c3 Violet', status: 'Active' },
                { name: 'Toast Banner Stack', cat: 'Notifications', token: '#10b981 Emerald', status: 'Active' },
                { name: 'Slide-Over Drawer', cat: 'Overlay Panels', token: '#ffffff Surface', status: 'Active' },
                { name: 'Merchant Compare Table', cat: 'E-Commerce Matrix', token: '#6366f1 Indigo', status: 'Active' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{row.name}</td>
                  <td className="p-3 text-slate-600">{row.cat}</td>
                  <td className="p-3 font-mono text-[11px] text-[#7256c3]">{row.token}</td>
                  <td className="p-3">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => addToast(`Inspecting ${row.name}`, 'Component loaded cleanly.', 'info')} className="text-xs font-bold text-[#7256c3] hover:underline cursor-pointer">
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
        <div className="space-y-4 text-xs font-medium leading-relaxed text-slate-700">
          <div className="p-4 bg-[#f8f7ff] rounded-2xl border border-[#e6e2f8]">
            <p className="text-slate-900 font-bold mb-1">Overview Description:</p>
            <p>{drawerData.content}</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
            <p className="text-emerald-800 font-bold uppercase text-[11px] font-mono">Features Included:</p>
            <ul className="list-disc list-inside space-y-1 text-emerald-900">
              <li>Auto-dismiss progress timer</li>
              <li>Light theme surface styling</li>
              <li>Accessible keyboard navigation (ESC)</li>
            </ul>
          </div>
        </div>
      </SlideOverDrawer>

    </div>
  );
}
