import React from 'react';

export function Hero({ onEnterApp, onOpenAuth }) {
  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-[#ea580c] uppercase font-heading">
              PINGX
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide font-heading uppercase">
              CONNECT, CHAT & DISCOVER DEALS
            </p>
          </div>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            One place to chat with friends, consult context-aware AI assistance, and compare smart products from top shopping sources.
          </p>

          <div className="flex justify-center pt-2">
            <button
              onClick={onEnterApp}
              className="btn-saas-lime px-10 py-5 rounded-full text-base font-extrabold text-slate-900 cursor-pointer shadow-md transition-transform hover:scale-105 button-cap-tracked"
            >
              Get started
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
