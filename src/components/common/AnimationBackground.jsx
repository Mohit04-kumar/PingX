import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { RibbonGlow } from '../effects/RibbonGlow';

export function AnimationBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (theme !== 'animation') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Floating tech particle nodes
    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1.5,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        hue: Math.random() > 0.5 ? 275 : 310, // Purple to magenta
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    // Floating mock UI badges / phone wireframes
    const floatingCards = [
      { x: width * 0.15, y: height * 0.25, vx: 0.25, vy: 0.15, text: '💬 PingX Live Chat', sub: 'New message from Raman' },
      { x: width * 0.75, y: height * 0.35, vx: -0.2, vy: 0.25, text: '🛍️ Deal Found: Amazon ₹26,990', sub: 'Save ₹2,000 on Sony XM5' },
      { x: width * 0.35, y: height * 0.75, vx: 0.18, vy: -0.2, text: '⚡ AI Assistant Active', sub: 'OpenAI 2-bullet summary' },
      { x: width * 0.82, y: height * 0.8, vx: -0.22, vy: -0.15, text: '🎙️ Voice Note Encrypted', sub: '0:24 Audio Stream' },
    ];

    let tick = 0;

    const render = () => {
      tick += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Gradient background
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#1a0033');
      bgGrad.addColorStop(0.5, '#0d001f');
      bgGrad.addColorStop(1, '#05000c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      const offsetX = (tick * 15) % gridSize;
      const offsetY = (tick * 15) % gridSize;

      for (let x = offsetX; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render and connect floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${p.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p.hue}, 85%, 65%, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }

      // Draw floating translucent cards with phone dialog animation
      floatingCards.forEach((card, idx) => {
        card.x += card.vx;
        card.y += card.vy;

        // Bounce off bounds
        if (card.x < 50 || card.x > width - 240) card.vx *= -1;
        if (card.y < 80 || card.y > height - 120) card.vy *= -1;

        const floatOffset = Math.sin(tick * 1.5 + idx) * 8;
        const currentY = card.y + floatOffset;

        // Draw card background
        ctx.save();
        ctx.fillStyle = 'rgba(35, 12, 65, 0.45)';
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.lineWidth = 1.5;

        // Rounded rect
        const cardW = 220;
        const cardH = 58;
        const radius = 16;
        ctx.beginPath();
        ctx.roundRect(card.x, currentY, cardW, cardH, radius);
        ctx.fill();
        ctx.stroke();

        // Glowing dot
        ctx.beginPath();
        ctx.arc(card.x + 18, currentY + 22, 5, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0 ? '#84cc16' : '#ec48bd';
        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(card.text, card.x + 32, currentY + 25);

        ctx.fillStyle = 'rgba(233, 213, 255, 0.7)';
        ctx.font = '10px sans-serif';
        ctx.fillText(card.sub, card.x + 32, currentY + 44);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  if (theme !== 'animation') return null;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* 84-layer WebGL2 folded Ribbon Glow (OriginKit) */}
      <RibbonGlow opacity={0.65} speed={1.0} interactive={true} />
      <canvas ref={canvasRef} className="w-full h-full block relative z-10" />
    </div>
  );
}
