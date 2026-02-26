"use client";

import React, { useEffect, useRef } from 'react';
import { useWin7 } from './Win7Context';
import { desktopApps, DesktopApp } from './desktopApps';

interface StartMenuProps {
  onOpenApp: (app: DesktopApp) => void;
}

export default function Win7StartMenu({ onOpenApp }: StartMenuProps) {
  const { isStartMenuOpen, setStartMenuOpen, setShuttingDown } = useWin7();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const startButton = document.querySelector('.start-button');
        if (startButton && !startButton.contains(e.target as Node)) {
          setStartMenuOpen(false);
        }
      }
    };

    if (isStartMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStartMenuOpen, setStartMenuOpen]);

  if (!isStartMenuOpen) return null;

  const pinnedApps = desktopApps.filter(app => app.pinToStart);
  const allPrograms = desktopApps;

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
          <div className="pinned-programs">
            {pinnedApps.map(app => (
              <button
                key={app.id}
                className="start-menu-item"
                onClick={() => {
                  onOpenApp(app);
                  setStartMenuOpen(false);
                }}
              >
                <img src={app.icon} alt="" className="start-menu-item-icon" />
                <span>{app.name}</span>
              </button>
            ))}
          </div>
          
          <div className="start-menu-separator" />
          
          <div className="recent-programs">
            {allPrograms.slice(0, 6).map(app => (
              <button
                key={app.id}
                className="start-menu-item"
                onClick={() => {
                  onOpenApp(app);
                  setStartMenuOpen(false);
                }}
              >
                <img src={app.icon} alt="" className="start-menu-item-icon" />
                <span>{app.name}</span>
              </button>
            ))}
          </div>

          <div className="all-programs">
            <button className="all-programs-btn">
              All Programs
              <span className="arrow">▶</span>
            </button>
          </div>
        </div>

        {/* Right Column - System */}
        <div className="start-menu-right">
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'about');
            if (app) {
              onOpenApp(app);
              setStartMenuOpen(false);
            }
          }}>
            <img src="/win7/icons/authentic/gnome-fs-home.png" alt="" className="start-menu-item-icon" />
            <span>Eugene Boondock</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'work');
            if (app) {
              onOpenApp(app);
              setStartMenuOpen(false);
            }
          }}>
            <img src="/win7/icons/authentic/folder-documents.png" alt="" className="start-menu-item-icon" />
            <span>Documents</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'work');
            if (app) {
              onOpenApp(app);
              setStartMenuOpen(false);
            }
          }}>
            <img src="/win7/icons/authentic/folder-pictures.png" alt="" className="start-menu-item-icon" />
            <span>Pictures</span>
          </button>
          <button className="start-menu-item system">
            <img src="/win7/icons/authentic/folder-music.png" alt="" className="start-menu-item-icon" />
            <span>Music</span>
          </button>
          <div className="start-menu-separator" />
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'computer');
            if (app) {
              onOpenApp(app);
              setStartMenuOpen(false);
            }
          }}>
            <img src="/win7/icons/authentic/computer.png" alt="" className="start-menu-item-icon" />
            <span>Computer</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = desktopApps.find(a => a.id === 'services');
            if (app) {
              onOpenApp(app);
              setStartMenuOpen(false);
            }
          }}>
            <img src="/win7/icons/authentic/control-center.png" alt="" className="start-menu-item-icon" />
            <span>Control Panel</span>
          </button>
          <div className="start-menu-separator" />
          <button className="start-menu-item system">
            <img src="/win7/icons/authentic/gnome-help.png" alt="" className="start-menu-item-icon" />
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
