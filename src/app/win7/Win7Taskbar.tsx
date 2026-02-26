"use client";

import React, { useState, useEffect } from 'react';
import { useWin7 } from './Win7Context';

export default function Win7Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow, isStartMenuOpen, setStartMenuOpen } = useWin7();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleTaskbarItemClick = (windowId: string) => {
    const win = windows.find(w => w.id === windowId);
    if (win) {
      if (activeWindowId === windowId && !win.isMinimized) {
        minimizeWindow(windowId);
      } else {
        focusWindow(windowId);
      }
    }
  };

  return (
    <div className="win7-taskbar">
      {/* Start Button */}
      <button 
        className={`start-button ${isStartMenuOpen ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setStartMenuOpen(!isStartMenuOpen);
        }}
      >
        <div className="start-orb">
          <svg viewBox="0 0 24 24" className="windows-logo">
            <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
            <rect x="13" y="1" width="10" height="10" fill="#7fba00"/>
            <rect x="1" y="13" width="10" height="10" fill="#00a4ef"/>
            <rect x="13" y="13" width="10" height="10" fill="#ffb900"/>
          </svg>
        </div>
      </button>

      {/* Taskbar Items */}
      <div className="taskbar-items">
        {windows.map(win => (
          <button
            key={win.id}
            className={`taskbar-item ${activeWindowId === win.id && !win.isMinimized ? 'active' : ''} ${win.isMinimized ? 'minimized' : ''}`}
            onClick={() => handleTaskbarItemClick(win.id)}
            title={win.title}
          >
            <img src={win.icon} alt="" className="taskbar-item-icon" />
            <span className="taskbar-item-text">{win.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="system-tray">
        <button className="show-hidden-icons" title="Show hidden icons">
          <span>▲</span>
        </button>
        
        <div className="tray-icons">
          <div className="tray-icon" title="Volume">
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          </div>
          <div className="tray-icon" title="Network">
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
          </div>
        </div>

        {/* Clock */}
        <div className="taskbar-clock">
          <div className="clock-time">{formatTime(currentTime)}</div>
          <div className="clock-date">{formatDate(currentTime)}</div>
        </div>

        {/* Show Desktop */}
        <button className="show-desktop" title="Show desktop">
        </button>
      </div>
    </div>
  );
}
