import React, { useEffect } from 'react';
import { Phone, PhoneOff, Video, ShieldCheck } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export function IncomingCallModal({ incomingCall, onAnswer, onReject }) {
  if (!incomingCall) return null;

  const { callerInfo, callType = 'voice' } = incomingCall;
  const callerName = callerInfo?.name || callerInfo?.username || 'PingX Member';

  useEffect(() => {
    // Play ringing tone
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let isCancelled = false;

      const playBeep = () => {
        if (isCancelled) return;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.frequency.value = 440;
        osc2.frequency.value = 480;
        gain.gain.value = 0.08;

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
          } catch {}
        }, 1200);
      };

      playBeep();
      const interval = setInterval(playBeep, 3000);

      return () => {
        isCancelled = true;
        clearInterval(interval);
        try {
          ctx.close();
        } catch {}
      };
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-center flex flex-col items-center space-y-6 animate-slideUp">
        {/* Encrypted Notice */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Incoming Encrypted {callType === 'video' ? 'Video' : 'Voice'} Call</span>
        </div>

        {/* Pulsing Avatar */}
        <div className="relative flex items-center justify-center my-2">
          <div className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-ping duration-1000" />
          <div className="absolute w-36 h-36 rounded-full bg-emerald-500/10 animate-ping duration-1500 delay-200" />
          <Avatar
            src={callerInfo?.avatar}
            name={callerName}
            size="xl"
            className="w-24 h-24 border-4 border-emerald-400 relative z-10 shadow-xl"
          />
        </div>

        {/* Caller Info */}
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-white font-heading">{callerName}</h3>
          <p className="text-xs text-slate-400">
            {callType === 'video' ? 'Incoming HD Video Call...' : 'Incoming Voice Call...'}
          </p>
        </div>

        {/* Answer / Decline Action Buttons */}
        <div className="flex items-center justify-center gap-8 w-full pt-2">
          {/* Decline (Red) */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onReject}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Decline"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <span className="text-[11px] font-bold text-rose-400">Decline</span>
          </div>

          {/* Accept (Green) */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onAnswer}
              className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer animate-bounce"
              title="Answer"
            >
              {callType === 'video' ? <Video className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
            </button>
            <span className="text-[11px] font-bold text-emerald-400">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
}
