"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useWin7 } from './Win7Context';
import { desktopApps, type DesktopApp } from './desktopApps';

const QUICK_LAUNCH_IDS = ['computer', 'ie', 'media-player', 'calculator', 'paint'] as const;

type FlyoutType = 'hidden' | 'volume' | 'network' | 'calendar';

export default function Win7Taskbar() {
  const {
    windows,
    activeWindowId,
    focusWindow,
    minimizeWindow,
    isStartMenuOpen,
    setStartMenuOpen,
    openWindow,
    minimizeAllWindows,
    restoreAllWindows,
  } = useWin7();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showHiddenIcons, setShowHiddenIcons] = useState(false);
  const [showVolumeFlyout, setShowVolumeFlyout] = useState(false);
  const [showNetworkFlyout, setShowNetworkFlyout] = useState(false);
  const [showCalendarFlyout, setShowCalendarFlyout] = useState(false);
  const [volume, setVolume] = useState(68);
  const [airplaneMode, setAirplaneMode] = useState(false);

  const trayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!trayRef.current?.contains(event.target as Node)) {
        setShowHiddenIcons(false);
        setShowVolumeFlyout(false);
        setShowNetworkFlyout(false);
        setShowCalendarFlyout(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const quickLaunchApps = useMemo(
    () =>
      QUICK_LAUNCH_IDS
        .map(id => desktopApps.find(app => app.id === id))
        .filter((app): app is DesktopApp => Boolean(app)),
    []
  );

  const notifications = useMemo(
    () => [
      {
        title: 'Windows Defender',
        message: 'No threats detected in your latest scan.',
      },
      {
        title: 'Windows Update',
        message: 'Your portfolio desktop is up to date.',
      },
      {
        title: 'Network',
        message: 'Connected to Boondock Labs HQ Wi-Fi.',
      },
    ],
    []
  );

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

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
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

  const openQuickLaunch = (appId: string) => {
    const app = desktopApps.find(candidate => candidate.id === appId);
    if (!app) return;

    openWindow({
      id: app.id,
      title: app.name,
      icon: app.icon,
      content: app.content,
      width: app.width,
      height: app.height,
    });
  };

  const toggleFlyout = (flyout: FlyoutType) => {
    setShowHiddenIcons(flyout === 'hidden' ? !showHiddenIcons : false);
    setShowVolumeFlyout(flyout === 'volume' ? !showVolumeFlyout : false);
    setShowNetworkFlyout(flyout === 'network' ? !showNetworkFlyout : false);
    setShowCalendarFlyout(flyout === 'calendar' ? !showCalendarFlyout : false);
  };

  const allWindowsMinimized = windows.length > 0 && windows.every(win => win.isMinimized);

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

      {/* Quick Launch */}
      <div className="quick-launch">
        {quickLaunchApps.map(app => (
          <button
            key={app.id}
            className="quick-launch-item"
            onClick={() => openQuickLaunch(app.id)}
            title={`Open ${app.name}`}
          >
            <img src={app.icon} alt="" />
          </button>
        ))}
      </div>

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
      <div className="system-tray" ref={trayRef}>
        <button
          className="show-hidden-icons"
          title="Show hidden icons"
          onClick={() => toggleFlyout('hidden')}
        >
          <span>▲</span>
        </button>
        
        <div className="tray-icons">
          <button
            className="tray-icon tray-icon-btn"
            title="Volume"
            onClick={() => toggleFlyout('volume')}
          >
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          </button>
          <button
            className="tray-icon tray-icon-btn"
            title="Network"
            onClick={() => toggleFlyout('network')}
          >
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
          </button>
          <button
            className="tray-icon tray-icon-btn"
            title="Action Center"
            onClick={() => toggleFlyout('calendar')}
          >
            <span style={{ color: '#fff', fontSize: '13px' }}>🔔</span>
          </button>
        </div>

        {/* Clock */}
        <button
          className="taskbar-clock"
          onClick={() => toggleFlyout('calendar')}
          title="Date and time"
        >
          <div className="clock-time">{formatTime(currentTime)}</div>
          <div className="clock-date">{formatDate(currentTime)}</div>
        </button>

        {/* Show Desktop */}
        <button
          className={`show-desktop ${allWindowsMinimized ? 'active' : ''}`}
          title="Show desktop"
          onClick={() => (allWindowsMinimized ? restoreAllWindows() : minimizeAllWindows())}
        />

        {showHiddenIcons && (
          <div className="tray-flyout hidden-icons-flyout">
            <div className="tray-flyout-title">Hidden Icons</div>
            <div className="hidden-icons-grid">
              <button className="tray-status-chip">🛡️ Defender</button>
              <button className="tray-status-chip">🔋 Power</button>
              <button className="tray-status-chip">☁️ Sync</button>
              <button className="tray-status-chip">🧩 Gadgets</button>
            </div>
          </div>
        )}

        {showVolumeFlyout && (
          <div className="tray-flyout volume-flyout">
            <div className="tray-flyout-title">Mixer</div>
            <label className="tray-slider-label">
              Master volume
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
              />
            </label>
            <div className="tray-meta-row">
              <span>Speakers</span>
              <strong>{volume}%</strong>
            </div>
          </div>
        )}

        {showNetworkFlyout && (
          <div className="tray-flyout network-flyout">
            <div className="tray-flyout-title">Wireless Network Connection</div>
            <div className="tray-network-row">
              <strong>BoondockLabs-WiFi</strong>
              <span>{airplaneMode ? 'Disconnected' : 'Connected'}</span>
            </div>
            <div className="tray-network-row">
              <strong>Guest</strong>
              <span>Secured</span>
            </div>
            <button
              className="tray-status-chip"
              onClick={() => setAirplaneMode(prev => !prev)}
            >
              {airplaneMode ? 'Disable Airplane Mode' : 'Enable Airplane Mode'}
            </button>
          </div>
        )}

        {showCalendarFlyout && (
          <div className="tray-flyout calendar-flyout">
            <div className="tray-flyout-title">{formatDay(currentTime)}</div>
            <div className="tray-calendar-date">{formatDate(currentTime)}</div>
            <div className="tray-notice-list">
              {notifications.map(item => (
                <div key={item.title} className="tray-notice-item">
                  <strong>{item.title}</strong>
                  <span>{item.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
