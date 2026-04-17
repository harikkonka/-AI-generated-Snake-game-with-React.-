import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, AudioWaveform } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'VOID_DRIFT',
    artist: 'MACH_SYNC',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyber/200/200?grayscale',
  },
  {
    id: '2',
    title: 'DATA_PULSE',
    artist: 'BIT_ROOT',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon/200/200?grayscale',
  },
  {
    id: '3',
    title: 'GRID_BREACH',
    artist: 'NULL_PTR',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/grid/200/200?grayscale',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-void border-2 border-cyan p-6 flex flex-col items-center gap-6 w-full max-w-sm cyan-glow font-mono relative overflow-hidden"
    >
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
      />

      {/* Album Art with Glitch Filters */}
      <div className="relative w-full aspect-square border-2 border-cyan overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            src={currentTrack.cover}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter contrast-150 brightness-50"
          />
        </AnimatePresence>
        
        {/* Overlay Static/Scanlines */}
        <div className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/Anand-Chowdhary/glitch/master/assets/static.gif')] opacity-20 pointer-events-none mix-blend-screen" />
        
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.5, 0.9, 1.2, 1],
                rotate: [0, 5, -5, 2, 0]
              }}
              transition={{ duration: 0.2, repeat: Infinity }}
            >
              <AudioWaveform className="w-16 h-16 text-cyan" />
            </motion.div>
          </div>
        )}
      </div>

      <div className="text-center w-full relative">
        <h3 
          data-text={currentTrack.title} 
          className="text-md font-bold text-cyan glitch-text truncate tracking-tighter"
        >
          {currentTrack.title}
        </h3>
        <p className="text-[8px] text-magenta mt-1 opacity-80">&gt; SOURCE: {currentTrack.artist}</p>
      </div>

      <div className="flex items-center gap-8">
        <button 
          onClick={prevTrack}
          className="text-magenta hover:text-cyan transition-none"
        >
          <SkipBack size={20} />
        </button>
        <button 
          onClick={togglePlay}
          className="w-14 h-14 border-2 border-magenta flex items-center justify-center bg-magenta/10 text-magenta hover:bg-magenta hover:text-void transition-none magenta-glow"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={nextTrack}
          className="text-magenta hover:text-cyan transition-none"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-[8px] text-cyan/60">
          <span>VOL_CONTROL</span>
          <span>{(volume * 100).toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-magenta/20 appearance-none cursor-help accent-cyan"
        />
      </div>

      {/* Decorative Corner Bits */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-cyan" />
      <div className="absolute top-0 right-0 w-2 h-2 bg-magenta" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-magenta" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan" />
    </motion.div>
  );
}

