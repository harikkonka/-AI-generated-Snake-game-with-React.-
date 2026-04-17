/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Activity, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-void text-cyan relative flex flex-col font-sans selection:bg-magenta selection:text-white">
      {/* Glitch Overlay Layers */}
      <div className="noise-bg" />
      <div className="scanline" />
      
      {/* Cryptic Header */}
      <header className="z-20 p-4 border-b-2 border-magenta flex justify-between items-center bg-void">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-2 border-magenta flex items-center justify-center magenta-glow"
          >
            <Cpu size={24} className="text-magenta" />
          </motion.div>
          <h1 
            data-text="PROT0COL:RHYTHM"
            className="text-xl md:text-2xl font-bold tracking-widest glitch-text text-magenta"
          >
            PROT0COL:RHYTHM
          </h1>
        </div>
        <div className="hidden md:flex gap-6 font-mono text-[10px] text-magenta/60 uppercase">
          <div className="flex items-center gap-2 hover:text-cyan transition-none cursor-wait">
            <Activity size={12} /> SYNC: ACTIVE
          </div>
          <div className="flex items-center gap-2 hover:text-cyan transition-none cursor-wait">
            <Terminal size={12} /> CORE: ONLINE
          </div>
        </div>
      </header>

      {/* Main Machine Interface */}
      <main className="flex-1 z-10 flex flex-col lg:row items-center justify-center p-8 gap-12 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full max-w-6xl items-start">
          
          {/* Simulation Module */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8 order-2 lg:order-1"
          >
            <div className="w-full flex justify-between items-center mb-2 px-2">
              <span className="text-[10px] font-mono text-magenta">MODULE_01:SNAKE_SIM</span>
              <span className="text-[10px] font-mono text-magenta animate-pulse">[ANALYZING_BIOMETRICS]</span>
            </div>
            <div className="relative p-1 border-2 border-magenta bg-magenta/5 magenta-glow">
              <SnakeGame />
            </div>
          </motion.section>

          {/* Audio Processing Module */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center lg:items-start gap-8 order-1 lg:order-2"
          >
            <div className="w-full flex justify-between items-center mb-2 px-2">
              <span className="text-[10px] font-mono text-cyan">MODULE_02:AUDIO_OSC</span>
              <span className="text-[10px] font-mono text-cyan animate-pulse">[DECODING_WAVFORM]</span>
            </div>
            <MusicPlayer />

            {/* Cryptic Data Feed */}
            <div className="w-full p-6 border-2 border-cyan bg-cyan/5 cyan-glow font-mono text-[10px] space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-magenta animate-ping" />
                <span className="text-magenta font-bold">EVENT_LOG:</span>
              </div>
              <p className="leading-relaxed opacity-80">
                &gt; INITIALIZING_NEURAL_INTERFACE...<br/>
                &gt; MAPPING_GRID_COORDINATES...<br/>
                &gt; SYNCHRONIZING_AUDIO_STREAM_0XFA2...<br/>
                &gt; SUBJECT_DETECTED: STABLE<br/>
                &gt; COMMENCING_RHYTHMIC_CALIBRATION...
              </p>
              <div className="pt-4 border-t border-cyan/20 flex justify-between">
                <span>BITRATE: 128KBPS</span>
                <span>PACKET_LOSS: 0.00%</span>
              </div>
            </div>
          </motion.section>

        </div>
      </main>

      {/* Terminal Footer */}
      <footer className="z-20 p-3 border-t-2 border-magenta flex justify-around items-center bg-void text-[8px] font-mono text-magenta/40 uppercase tracking-[0.4em]">
        <span>SYS_REF: {Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
        <span className="animate-pulse">CONNECTED_TO_VOID</span>
        <motion.span 
          animate={{ opacity: [0.2, 1, 0.2] }} 
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-cyan font-bold"
        >
          [LIV€]
        </motion.span>
      </footer>
    </div>
  );
}


