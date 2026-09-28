import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic, Volume2 } from 'lucide-react';

export function VoiceNotePlayer({ audioUrl, duration = 0, isMe = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        setAudioDuration(Math.round(audio.duration));
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play failed:', err);
      });
    }
  };

  const toggleSpeed = () => {
    const rates = [1, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 24 simulated WhatsApp audio waveform bar heights
  const waveformBars = [
    25, 45, 80, 55, 30, 70, 95, 60, 40, 75, 100, 85, 
    50, 65, 90, 45, 35, 80, 60, 40, 70, 50, 30, 20
  ];

  const progress = audioDuration > 0 ? (currentTime / audioDuration) : 0;
  const activeBarsCount = Math.floor(progress * waveformBars.length);

  return (
    <div 
      className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all select-none ${
        isMe 
          ? 'bg-black/20 text-white border border-white/20' 
          : 'bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10'
      }`}
      style={{ minWidth: '240px', maxWidth: '320px' }}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Play/Pause Circle Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition-transform active:scale-95 ${
          isMe
            ? 'bg-white text-[#7256c3] hover:bg-slate-100'
            : 'bg-[#7256c3] text-white hover:bg-[#6044b3]'
        }`}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform and Progress Bar */}
      <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
        <div 
          className="flex items-center gap-[2.5px] h-6 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            if (audioRef.current && audioDuration > 0) {
              const newTime = clickPos * audioDuration;
              audioRef.current.currentTime = newTime;
              setCurrentTime(newTime);
            }
          }}
        >
          {waveformBars.map((heightPercent, idx) => {
            const isBarActive = idx <= activeBarsCount;
            return (
              <span
                key={idx}
                className="w-1 rounded-full transition-colors duration-100"
                style={{
                  height: `${Math.max(20, heightPercent * 0.24)}px`,
                  backgroundColor: isMe
                    ? isBarActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'
                    : isBarActive ? 'var(--accent)' : 'rgba(114, 86, 195, 0.25)'
                }}
              />
            );
          })}
        </div>

        {/* Timers & Speed multiplier */}
        <div className="flex items-center justify-between text-[10px] font-mono leading-none">
          <span className={isMe ? 'text-white/90' : 'text-slate-500'}>
            {isPlaying ? formatTime(currentTime) : formatTime(audioDuration || duration)}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleSpeed}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-colors ${
                isMe
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-violet-100 dark:bg-violet-900/40 text-[#7256c3] dark:text-violet-300'
              }`}
              title="Change Speed"
            >
              {playbackRate}x
            </button>
            <Mic className={`w-3 h-3 ${isMe ? 'text-white/70' : 'text-[#7256c3]'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
