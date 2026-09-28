import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ShieldCheck,
  User,
  Monitor
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

export function CallModal({ 
  isOpen, 
  onClose, 
  callType = 'voice', 
  partner, 
  currentUser, 
  onEndCall 
}) {
  const [callStatus, setCallStatus] = useState('calling'); // 'calling' | 'connected' | 'ended'
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('user'); // 'user' | 'environment'

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Play synthesized ringtone / call tones using Web Audio API
  const playTone = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      if (type === 'ring') {
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
            ctx.close();
          } catch {}
        }, 1200);
      } else if (type === 'connect') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        gain.gain.value = 0.1;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'end') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.2);
        gain.gain.value = 0.1;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // AudioContext not allowed before user interaction
    }
  };

  // Start Media Stream & Call Simulation
  useEffect(() => {
    if (!isOpen) return;

    setCallStatus('calling');
    setDuration(0);
    playTone('ring');

    const ringInterval = setInterval(() => {
      playTone('ring');
    }, 3000);

    // Acquire camera/mic if available
    const initMedia = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const constraints = {
            audio: true,
            video: callType === 'video' ? { facingMode: cameraFacing } : false
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          localStreamRef.current = stream;

          if (localVideoRef.current && callType === 'video') {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Camera/Mic permission warning:', err);
      }
    };

    initMedia();

    // Connect call after short ringing delay (3.2 seconds)
    const connectTimeout = setTimeout(() => {
      clearInterval(ringInterval);
      setCallStatus('connected');
      playTone('connect');

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }, 3200);

    return () => {
      clearInterval(ringInterval);
      clearTimeout(connectTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
      stopMediaTracks();
    };
  }, [isOpen, callType]);

  const stopMediaTracks = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => {
        t.enabled = isMuted; // Toggle to opposite
      });
    }
  };

  const toggleVideo = () => {
    const nextState = !isVideoEnabled;
    setIsVideoEnabled(nextState);
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((t) => {
        t.enabled = nextState;
      });
    }
  };

  const handleEndCall = () => {
    playTone('end');
    setCallStatus('ended');
    stopMediaTracks();
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      if (onEndCall) {
        onEndCall({
          type: callType,
          duration,
          endedAt: new Date().toISOString()
        });
      }
      onClose();
    }, 600);
  };

  const formatCallTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  const partnerName = partner?.name || partner?.username || 'Contact';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn select-none p-2 sm:p-4">
      <div 
        className={`relative w-full ${
          isFullscreen 
            ? 'h-full max-w-none rounded-none' 
            : 'max-w-xl h-[85vh] sm:h-[680px] rounded-3xl'
        } overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between transition-all duration-300`}
      >
        {/* Top Header Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2 text-white/90">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wide">
              PingX End-to-End Encrypted {callType === 'video' ? 'Video' : 'Voice'} Call
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors backdrop-blur-xs"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Call Center Area */}
        <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
          {callType === 'video' ? (
            /* Video Call Layout */
            <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
              {/* Remote Partner Video Stream / Backdrop */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img
                  src={partner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
                  alt={partnerName}
                  className="w-full h-full object-cover filter blur-xs brightness-75 scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
              </div>

              {/* Partner Card overlay when video is starting or active */}
              <div className="relative z-10 flex flex-col items-center space-y-3">
                <div className="relative">
                  <Avatar
                    src={partner?.avatar}
                    name={partnerName}
                    size="xl"
                    className="border-4 border-white/30 shadow-2xl scale-125"
                  />
                  {callStatus === 'connected' && (
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </span>
                  )}
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-xl font-extrabold text-white font-heading">{partnerName}</h3>
                  <p className="text-xs font-mono font-bold tracking-wider text-emerald-400">
                    {callStatus === 'calling' ? 'Calling...' : formatCallTime(duration)}
                  </p>
                </div>
              </div>

              {/* Local User PIP Floating Camera Preview */}
              {isVideoEnabled && (
                <div className="absolute bottom-24 right-4 z-20 w-32 h-44 sm:w-40 sm:h-52 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white">
                    You
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Voice Call Layout */
            <div className="flex flex-col items-center justify-center space-y-8 z-10 px-4">
              {/* Animated Rippling Pulse Avatar */}
              <div className="relative flex items-center justify-center">
                {callStatus === 'calling' ? (
                  <>
                    <div className="absolute w-44 h-44 rounded-full bg-violet-500/20 animate-ping duration-1000" />
                    <div className="absolute w-56 h-56 rounded-full bg-violet-500/10 animate-ping duration-1500 delay-300" />
                  </>
                ) : (
                  <div className="absolute w-48 h-48 rounded-full bg-emerald-500/20 animate-pulse duration-2000" />
                )}

                <Avatar
                  src={partner?.avatar}
                  name={partnerName}
                  size="xl"
                  className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-violet-400 shadow-2xl relative z-10"
                />
              </div>

              {/* Partner Name & Dynamic Status */}
              <div className="text-center space-y-2 z-10">
                <h3 className="text-2xl font-black text-white font-heading tracking-tight">{partnerName}</h3>
                <p className="text-xs text-slate-400 font-medium">@{partner?.username || 'member'}</p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-mono font-bold tracking-wider text-emerald-300 border border-white/10">
                    <span className={`w-2 h-2 rounded-full ${callStatus === 'calling' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                    {callStatus === 'calling' ? 'Ringing...' : `Connected • ${formatCallTime(duration)}`}
                  </span>
                </div>
              </div>

              {/* Voice Waveform Activity Simulator */}
              {callStatus === 'connected' && (
                <div className="flex items-center gap-1 h-6">
                  {[20, 45, 80, 60, 30, 90, 40, 70, 100, 50, 85, 30, 65, 40, 80].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-[#7256c3] rounded-full animate-pulse"
                      style={{
                        height: `${h * 0.22}px`,
                        animationDelay: `${(i % 5) * 120}ms`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Call Controls Dock (WhatsApp Style) */}
        <div className="p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-20 flex items-center justify-center gap-4 sm:gap-6">
          {/* Mute Mic Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
              isMuted
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Video Toggle (If video call or toggle to video) */}
          <button
            type="button"
            onClick={toggleVideo}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
              !isVideoEnabled
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {!isVideoEnabled ? <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* End Call / Hang Up (Big Red Circle) */}
          <button
            type="button"
            onClick={handleEndCall}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Speaker Toggle */}
          <button
            type="button"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
              !isSpeakerOn
                ? 'bg-white/10 text-white/50'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
