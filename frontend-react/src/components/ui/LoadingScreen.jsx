import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [mounted, setMounted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Trigger logo smooth entrance ease fade-in
    const mountTimer = setTimeout(() => setMounted(true), 50);

    // Fade out and transition to main app after 2.5 seconds
    const loadTimer = setTimeout(() => {
      handleComplete();
    }, 2500);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  const handleComplete = () => {
    setFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 600);
  };

  return (
    <div 
      onClick={handleComplete}
      className={`fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-8 select-none overflow-hidden transition-opacity duration-700 cursor-pointer ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Big Logo with Ease Fade-In Animation */}
      <img 
        src="/logo.png" 
        alt="MarineGuardian Logo" 
        className={`h-64 sm:h-80 md:h-96 w-auto max-w-full object-contain drop-shadow-[0_20px_40px_rgba(2,132,199,0.3)] transition-all duration-1000 ease-out transform ${
          mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      />
    </div>
  );
}


