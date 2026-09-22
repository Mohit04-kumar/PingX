import React from 'react';

export function PingXLogo({ className = '', showText = true, textClassName = '' }) {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <span className={`font-extrabold tracking-tight font-heading flex items-center ${textClassName || 'text-xl sm:text-2xl font-black text-slate-900'}`}>
        <span className="tracking-tight text-slate-900">PING</span>
        <span className="text-[#7256c3]">X</span>
      </span>
    </div>
  );
}

export default PingXLogo;
