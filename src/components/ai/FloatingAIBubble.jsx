import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../../context/AIContext';
import { NeuralAIIcon } from '../common/NeuralAIIcon';
import { X } from 'lucide-react';

export function FloatingAIBubble() {
  const { 
    isAIPopupOpen, 
    setIsAIPopupOpen, 
    isSpeechBubbleOpen, 
    setIsSpeechBubbleOpen,
  } = useAI();

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('pingx_ai_pos');
    return saved ? JSON.parse(saved) : { x: window.innerWidth - 80, y: window.innerHeight - 80 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0, hasMoved: false });

  // Drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      hasMoved: false
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      if (Math.hypot(dx, dy) > 4) {
        dragRef.current.hasMoved = true;
      }

      const newX = Math.max(10, Math.min(window.innerWidth - 70, dragRef.current.initialX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 70, dragRef.current.initialY + dy));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem('pingx_ai_pos', JSON.stringify(position));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  const handleClick = () => {
    if (!dragRef.current.hasMoved) {
      setIsAIPopupOpen(true);
      setIsSpeechBubbleOpen(false);
    }
  };

  if (isAIPopupOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 50,
        touchAction: 'none'
      }}
      className="select-none flex flex-col items-end gap-2"
    >
      {/* Speech Bubble Prompt */}
      {isSpeechBubbleOpen && (
        <div
          className="absolute bottom-16 right-0 glass-panel p-3.5 rounded-2xl border shadow-xl w-60 text-xs animate-float"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <button
            onClick={() => setIsSpeechBubbleOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="leading-relaxed pr-3 font-medium" style={{ color: 'var(--text-primary)' }}>
            Need help finding deals or exploring features? Click here anytime!
          </p>
        </div>
      )}

      {/* Draggable Circle Button */}
      <button
        id="floating-ai-launcher"
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className={`w-13 h-13 rounded-full p-0.5 shadow-xl flex items-center justify-center border cursor-grab active:cursor-grabbing hover:scale-105 transition-all duration-200 relative ${
          isDragging ? 'scale-110 shadow-2xl' : 'opacity-95 hover:opacity-100'
        }`}
        style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--border)' }}
        title="PingX Assistant (Click to open / Drag to reposition)"
      >
        <NeuralAIIcon className="w-6 h-6 text-white pointer-events-none" />

        <span
          className="absolute -top-1 -left-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border shadow-xs pointer-events-none"
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--accent)', borderColor: 'var(--border)' }}
        >
          Help
        </span>
      </button>
    </div>
  );
}
