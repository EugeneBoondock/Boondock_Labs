"use client";

import React, { useEffect, useState } from 'react';
import { useWin7 } from './Win7Context';

export default function Win7Startup() {
  const { setStartupComplete } = useWin7();
  const [phase, setPhase] = useState<'boot' | 'logo' | 'loading' | 'welcome'>('boot');

  useEffect(() => {
    // Boot screen
    const bootTimer = setTimeout(() => setPhase('logo'), 800);
    
    // Logo with loading
    const logoTimer = setTimeout(() => setPhase('loading'), 1500);
    
    // Welcome screen
    const loadingTimer = setTimeout(() => setPhase('welcome'), 3500);
    
    // Complete
    const completeTimer = setTimeout(() => setStartupComplete(true), 5000);

    return () => {
      clearTimeout(bootTimer);
      clearTimeout(logoTimer);
      clearTimeout(loadingTimer);
      clearTimeout(completeTimer);
    };
  }, [setStartupComplete]);

  if (phase === 'boot') {
    return (
      <div className="startup-screen boot">
        <div className="bios-text">
          <p>Boondock Labs BIOS v2.0</p>
          <p>Copyright (c) {new Date().getFullYear()} Boondock Labs</p>
          <p></p>
          <p>Processor: Eugene Boondock Dev Core @ Full Speed</p>
          <p>Memory: Unlimited Creativity Installed</p>
          <p></p>
          <p>Loading Portfolio OS...</p>
        </div>
      </div>
    );
  }

  if (phase === 'logo' || phase === 'loading') {
    return (
      <div className="startup-screen logo">
        <div className="windows-logo-container">
          <div className="windows-logo-animated">
            <div className="logo-orbs">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
              <div className="orb orb-4"></div>
            </div>
          </div>
          <div className="startup-text">Starting Windows</div>
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
        <div className="copyright-text">
          © {new Date().getFullYear()} Boondock Labs - Eugene Ncube
        </div>
      </div>
    );
  }

  if (phase === 'welcome') {
    return (
      <div className="startup-screen welcome">
        <div className="welcome-content">
          <div className="welcome-avatar">
            <img src="/win7/user-avatar.svg" alt="User" />
          </div>
          <div className="welcome-text">Welcome</div>
          <div className="welcome-user">Eugene Boondock</div>
          <div className="welcome-preparing">Preparing your desktop...</div>
        </div>
      </div>
    );
  }

  return null;
}
