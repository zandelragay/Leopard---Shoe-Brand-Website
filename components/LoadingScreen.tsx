import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showEyes, setShowEyes] = useState(false);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total
    const interval = 20; // 20ms update
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
       // Open eyes when reached 100%
       const eyeTimer = setTimeout(() => {
         setShowEyes(true);
         // Hold for a moment then complete
         setTimeout(() => {
           onComplete();
         }, 1500);
       }, 300);
       return () => clearTimeout(eyeTimer);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative w-[340px] h-[340px] mb-12">
        {/* Realistic Geometric Leopard Head SVG */}
        <svg viewBox="0 0 200 200" className="w-full h-full text-zinc-900 fill-current">
          {/* Main Head Shape - darkened and textured */}
          <path d="M50 40 C30 40 20 60 20 100 C20 150 60 180 100 180 C140 180 180 150 180 100 C180 60 170 40 150 40 L100 60 Z" className="fill-black/80" />
          
          {/* Ears */}
          <path d="M45 45 L30 15 L60 35 Z" fill="#0c0c0c" />
          <path d="M155 45 L170 15 L140 35 Z" fill="#0c0c0c" />
          
          {/* Facial structure / shadows */}
          <path d="M100 80 L85 130 L100 145 L115 130 Z" className="fill-zinc-800/40" /> {/* Bridge of nose */}
          <path d="M100 145 L85 160 L115 160 Z" className="fill-zinc-700/30" /> {/* Nose tip */}
          
          {/* Whiskers (subtle) */}
          <g stroke="#222" strokeWidth="0.5">
            <line x1="80" y1="150" x2="30" y2="160" />
            <line x1="80" y1="155" x2="35" y2="175" />
            <line x1="120" y1="150" x2="170" y2="160" />
            <line x1="120" y1="155" x2="165" y2="175" />
          </g>

          {/* Abstract Spot patterns */}
          <circle cx="50" cy="80" r="2" fill="#111" />
          <circle cx="150" cy="80" r="2" fill="#111" />
          <circle cx="70" cy="60" r="3" fill="#111" />
          <circle cx="130" cy="60" r="3" fill="#111" />
        </svg>

        {/* Eyes Layer - Predators in the Dark */}
        <div className="absolute inset-0 flex items-center justify-center gap-20">
           {/* Left eye container */}
           <div className="relative w-24 h-12 flex items-center justify-center">
             <motion.div 
               initial={{ opacity: 0, scaleY: 0 }}
               animate={{ 
                 opacity: showEyes ? 1 : 0,
                 scaleY: showEyes ? 1 : 0,
               }}
               transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
               className="w-full h-full relative z-10"
             >
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                   <defs>
                     <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff700" />
                        <stop offset="40%" stopColor="#ffcc00" />
                        <stop offset="100%" stopColor="#b38f00" />
                     </radialGradient>
                     <filter id="eyeGlow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                     </filter>
                   </defs>
                   {/* Eye Shape */}
                   <path 
                     d="M10 25 C20 10 80 10 90 25 C80 40 20 40 10 25 Z" 
                     fill="url(#eyeGradient)"
                     style={{ filter: showEyes ? 'drop-shadow(0 0 15px #ffcc00)' : 'none' }}
                   />
                   {/* Iris Texture (Lines) */}
                   <g opacity="0.3">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <line 
                          key={i}
                          x1="50" y1="25"
                          x2={50 + 40 * Math.cos((i * 18 * Math.PI) / 180)}
                          y2={25 + 20 * Math.sin((i * 18 * Math.PI) / 180)}
                          stroke="#000"
                          strokeWidth="0.5"
                        />
                      ))}
                   </g>
                   {/* Vertical Pupil */}
                   <path d="M47 12 Q50 25 53 12 Q50 38 47 12 Z" fill="#000" transform="translate(0, 5) scale(1, 1.2)" />
                </svg>
                {/* Secondary Outer Glow */}
                {showEyes && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    className="absolute inset-0 bg-yellow-400/20 blur-3xl scale-150"
                  />
                )}
             </motion.div>
           </div>

           {/* Right eye container */}
           <div className="relative w-24 h-12 flex items-center justify-center">
             <motion.div 
               initial={{ opacity: 0, scaleY: 0 }}
               animate={{ 
                 opacity: showEyes ? 1 : 0,
                 scaleY: showEyes ? 1 : 0,
               }}
               transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
               className="w-full h-full relative z-10"
             >
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                   {/* Eye Shape */}
                   <path 
                     d="M10 25 C20 10 80 10 90 25 C80 40 20 40 10 25 Z" 
                     fill="url(#eyeGradient)"
                     style={{ filter: showEyes ? 'drop-shadow(0 0 15px #ffcc00)' : 'none' }}
                   />
                   {/* Iris Texture (Lines) */}
                   <g opacity="0.3">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <line 
                          key={i}
                          x1="50" y1="25"
                          x2={50 + 40 * Math.cos((i * 18 * Math.PI) / 180)}
                          y2={25 + 20 * Math.sin((i * 18 * Math.PI) / 180)}
                          stroke="#000"
                          strokeWidth="0.5"
                        />
                      ))}
                   </g>
                   {/* Vertical Pupil */}
                   <path d="M47 12 Q50 25 53 12 Q50 38 47 12 Z" fill="#000" transform="translate(0, 5) scale(1, 1.2)" />
                </svg>
                {/* Secondary Outer Glow */}
                {showEyes && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    className="absolute inset-0 bg-yellow-400/20 blur-3xl scale-150"
                  />
                )}
             </motion.div>
           </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="w-80 space-y-6">
        <div className="flex justify-between items-end">
           <span className="font-mono text-[10px] tracking-[0.5em] text-zinc-600 uppercase">Predator Protocol</span>
           <motion.span 
             className="text-white text-4xl font-black italic tracking-tighter"
           >
             {Math.round(progress)}<span className="text-sm font-normal not-italic text-zinc-500 ml-1">%</span>
           </motion.span>
        </div>

        <div className="relative h-px w-full bg-zinc-900 overflow-hidden">
          <motion.div 
            style={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-orange-600"
          />
          {/* Scanning Effect */}
          <motion.div 
             animate={{ left: ['-100%', '200%'] }}
             transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
             className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>

        <div className="flex justify-center">
           <span className="font-mono text-[8px] text-zinc-800 uppercase tracking-widest animate-pulse">
             {progress < 100 ? 'Calibrating Agility...' : 'System Primed'}
           </span>
        </div>
      </div>

      {/* Ambient noise texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </motion.div>
  );
};

export default LoadingScreen;
