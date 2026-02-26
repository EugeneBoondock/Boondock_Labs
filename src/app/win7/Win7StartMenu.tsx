"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useWin7 } from './Win7Context';
import { desktopApps, DesktopApp } from './desktopApps';

interface StartMenuProps {
  onOpenApp: (app: DesktopApp) => void;
}

export default function Win7StartMenu({ onOpenApp }: StartMenuProps) {
  const { isStartMenuOpen, setStartMenuOpen, setShuttingDown } = useWin7();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const startButton = document.querySelector('.start-button');
        if (startButton && !startButton.contains(e.target as Node)) {
          setStartMenuOpen(false);
          setShowAllPrograms(false);
        }
      }
    };

    if (isStartMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStartMenuOpen, setStartMenuOpen]);

  // Reset all-programs view when menu closes
  useEffect(() => {
    if (!isStartMenuOpen) setShowAllPrograms(false);
  }, [isStartMenuOpen]);

  if (!isStartMenuOpen) return null;

  const pinnedApps = desktopApps.filter(app => app.pinToStart);
  const gameApps = desktopApps.filter(app => ['minesweeper', 'solitaire'].includes(app.id));

  const openApp = (app: DesktopApp) => {
    onOpenApp(app);
    setStartMenuOpen(false);
    setShowAllPrograms(false);
  };

  const handleShutdown = () => {
    setStartMenuOpen(false);
    setShuttingDown(true);
  };

  return (
    <div ref={menuRef} className="start-menu">
      {/* User Section */}
      <div className="start-menu-header">
        <div className="user-avatar">
          <img src="/win7/user-avatar.svg" alt="User" />
        </div>
        <div className="user-name">Eugene Boondock</div>
      </div>

      <div className="start-menu-body">
        {/* Left Column - Programs */}
        <div className="start-menu-left">
          {showAllPrograms ? (
            <div className="all-programs-list">
              <button className="all-programs-back-btn" onClick={() => setShowAllPrograms(false)}>
                ◀ Back
              </button>
              <div className="start-menu-separator" />
              <div className="all-programs-group">
                <div className="all-programs-folder">🎮 Games</div>
                {gameApps.map(app => (
                  <button key={app.id} className="start-menu-item sub" onClick={() => openApp(app)}>
                    <img src={app.icon} alt="" className="start-menu-item-icon" />
                    <span>{app.name}</span>
                  </button>
                ))}
              </div>
              <div className="start-menu-separator" />
              {desktopApps.map(app => (
                <button key={app.id} className="start-menu-item" onClick={() => openApp(app)}>
                  <img src={app.icon} alt="" className="start-menu-item-icon" />
                  <span>{app.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="pinned-programs">
                {pinnedApps.map(app => (
                  <button key={app.id} className="start-menu-item" onClick={() => openApp(app)}>
                    <img src={app.icon} alt="" className="start-menu-item-icon" />
                    <span>{app.name}</span>
                  </button>
                ))}
              </div>

              <div className="start-menu-separator" />

              <div className="recent-programs">
                {desktopApps.filter(a => !a.pinToStart).slice(0, 5).map(app => (
                  <button key={app.id} className="start-menu-item" onClick={() => openApp(app)}>
                    <img src={app.icon} alt="" className="start-menu-item-icon" />
                    <span>{app.name}</span>
                  </button>
                ))}
              </div>

              <div className="all-programs">
                <button className="all-programs-btn" onClick={() => setShowAllPrograms(true)}>
                  All Programs
                  <span className="arrow">▶</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Column - System */}
        <div className="start-menu-right">
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'about');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/gnome-fs-home.png" alt="" className="start-menu-item-icon" />
            <span>Eugene Boondock</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'work');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/folder-documents.png" alt="" className="start-menu-item-icon" />
            <span>Documents</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'work');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/folder-pictures.png" alt="" className="start-menu-item-icon" />
            <span>Pictures</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'media-player');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/folder-music.png" alt="" className="start-menu-item-icon" />
            <span>Music</span>
          </button>
          <div className="start-menu-separator" />
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'computer');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/computer.png" alt="" className="start-menu-item-icon" />
            <span>Computer</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'services');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/control-center.png" alt="" className="start-menu-item-icon" />
            <span>Control Panel</span>
          </button>
          <div className="start-menu-separator" />
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'notepad');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/stock_help-agent.png" alt="" className="start-menu-item-icon" />
            <span>Help and Support</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="start-menu-footer">
        <div className="search-box">
          <input type="text" placeholder="Search programs and files" />
          <span className="search-icon">🔍</span>
        </div>
        <div className="shutdown-buttons">
          <button className="shutdown-btn" onClick={handleShutdown}>
            Shut down
          </button>
          <button className="shutdown-options">
            <span>▶</span>
          </button>
        </div>
      </div>
    </div>
  );
}
