"use client";

import React, { useEffect, useState } from 'react';
import { useWin7 } from './Win7Context';

export default function Win7Shutdown() {
  const { setShuttingDown, setStartupComplete } = useWin7();
  const [phase, setPhase] = useState<'shutdown' | 'black'>('shutdown');

  useEffect(() => {
    // Show shutdown message
    const blackTimer = setTimeout(() => setPhase('black'), 3000);
    
    // Reset and restart
    const restartTimer = setTimeout(() => {
      setShuttingDown(false);
      setStartupComplete(false);
    }, 5000);

    return () => {
      clearTimeout(blackTimer);
      clearTimeout(restartTimer);
    };
  }, [setShuttingDown, setStartupComplete]);

  if (phase === 'black') {
    return <div className="shutdown-screen black" />;
  }

  return (
    <div className="shutdown-screen">
      <div className="shutdown-content">
        <div className="shutdown-spinner">
          <div className="spinner-circle"></div>
        </div>
        <div className="shutdown-text">Shutting down...</div>
        <div className="shutdown-subtext">Thanks for visiting Boondock Labs!</div>
      </div>
    </div>
  );
}
