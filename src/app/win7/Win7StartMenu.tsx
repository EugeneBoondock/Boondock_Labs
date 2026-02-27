"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useWin7 } from './Win7Context';
import { type DesktopApp, desktopApps } from './desktopApps';

interface StartMenuProps {
  onOpenApp: (app: DesktopApp) => void;
}

const CATEGORY_ORDER = ['Portfolio', 'Accessories', 'System Tools', 'Games', 'Media', 'Utilities', 'Other'];

export default function Win7StartMenu({ onOpenApp }: StartMenuProps) {
  const { isStartMenuOpen, setStartMenuOpen, setShuttingDown } = useWin7();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const startButton = document.querySelector('.start-button');
        if (startButton && !startButton.contains(e.target as Node)) {
          setStartMenuOpen(false);
          setShowAllPrograms(false);
          setShowPowerMenu(false);
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
    if (!isStartMenuOpen) {
      setShowAllPrograms(false);
      setShowPowerMenu(false);
      setSearchTerm('');
    }
  }, [isStartMenuOpen]);

  if (!isStartMenuOpen) return null;

  const pinnedApps = desktopApps.filter(app => app.pinToStart);
  const searchKey = searchTerm.trim().toLowerCase();

  const openApp = (app: DesktopApp) => {
    onOpenApp(app);
    setStartMenuOpen(false);
    setShowAllPrograms(false);
    setShowPowerMenu(false);
    setSearchTerm('');
  };

  const searchResults = useMemo(() => {
    if (!searchKey) return [];
    return desktopApps.filter(app => {
      const searchable = [
        app.name,
        app.id,
        ...(app.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(searchKey);
    });
  }, [searchKey]);

  const groupedPrograms = useMemo(() => {
    const groups: Record<string, DesktopApp[]> = {};
    desktopApps.forEach(app => {
      const category = app.category ?? 'Other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(app);
    });
    Object.values(groups).forEach(group => group.sort((a, b) => a.name.localeCompare(b.name)));
    return groups;
  }, []);

  const orderedCategories = [
    ...CATEGORY_ORDER,
    ...Object.keys(groupedPrograms).filter(cat => !CATEGORY_ORDER.includes(cat)),
  ].filter(cat => groupedPrograms[cat]?.length);

  const findApp = (id: string) => desktopApps.find(app => app.id === id);

  const handlePowerAction = (action: 'sleep' | 'restart' | 'logoff' | 'lock' | 'shutdown') => {
    if (action === 'shutdown' || action === 'logoff' || action === 'restart') {
      setShuttingDown(true);
      if (action === 'restart') {
        window.setTimeout(() => window.location.reload(), 2600);
      }
    }

    if (action === 'sleep' || action === 'lock') {
      setStartMenuOpen(false);
      setShowPowerMenu(false);
      return;
    }

    setStartMenuOpen(false);
    setShowPowerMenu(false);
  };

  const openFirstSearchResult = () => {
    if (searchResults.length > 0) {
      openApp(searchResults[0]);
    }
  };

  return (
    <div ref={menuRef} className="start-menu">
      {/* User Section */}
      <div className="start-menu-header">
        <div className="user-avatar">
          <img src="/win7/user-avatar.png" alt="User" />
        </div>
        <div className="user-name">Eugene Boondock</div>
      </div>

      <div className="start-menu-body">
        {/* Left Column - Programs */}
        <div className="start-menu-left">
          {searchKey ? (
            <div className="all-programs-list">
              <div className="all-programs-folder">🔍 Search Results</div>
              {searchResults.length === 0 ? (
                <div className="start-menu-search-empty">
                  No programs found for <strong>{searchTerm}</strong>.
                </div>
              ) : (
                searchResults.slice(0, 12).map(app => (
                  <button key={app.id} className="start-menu-item" onClick={() => openApp(app)}>
                    <img src={app.icon} alt="" className="start-menu-item-icon" />
                    <span>{app.name}</span>
                  </button>
                ))
              )}
            </div>
          ) : showAllPrograms ? (
            <div className="all-programs-list">
              <button className="all-programs-back-btn" onClick={() => setShowAllPrograms(false)}>
                ◀ Back
              </button>
              {orderedCategories.map(category => (
                <div className="all-programs-group" key={category}>
                  <div className="start-menu-separator" />
                  <div className="all-programs-folder">📂 {category}</div>
                  {groupedPrograms[category].map(app => (
                    <button key={app.id} className="start-menu-item sub" onClick={() => openApp(app)}>
                      <img src={app.icon} alt="" className="start-menu-item-icon" />
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>
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
                {desktopApps.filter(a => !a.pinToStart).slice(0, 7).map(app => (
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
            const app = findApp('about');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/gnome-fs-home.png" alt="" className="start-menu-item-icon" />
            <span>Eugene Boondock</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = findApp('work');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/folder-documents.png" alt="" className="start-menu-item-icon" />
            <span>Documents</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = findApp('work');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/folder-pictures.png" alt="" className="start-menu-item-icon" />
            <span>Pictures</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = findApp('media-player');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/folder-music.png" alt="" className="start-menu-item-icon" />
            <span>Music</span>
          </button>
          <div className="start-menu-separator" />
          <button className="start-menu-item system" onClick={() => {
            const app = findApp('computer');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/computer.png" alt="" className="start-menu-item-icon" />
            <span>Computer</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = findApp('services');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/control-center.png" alt="" className="start-menu-item-icon" />
            <span>Control Panel</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = findApp('command-prompt');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/gnome-dev-harddisk.png" alt="" className="start-menu-item-icon" />
            <span>Command Prompt</span>
          </button>
          <button className="start-menu-item system" onClick={() => {
            const app = findApp('run');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/applications-development.png" alt="" className="start-menu-item-icon" />
            <span>Run...</span>
          </button>
          <div className="start-menu-separator" />
          <button className="start-menu-item system" onClick={() => {
            const app = findApp('notepad');
            if (app) openApp(app);
          }}>
            <img src="/win7/icons/authentic/gnome-help.png" alt="" className="start-menu-item-icon" />
            <span>Help and Support</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="start-menu-footer">
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            placeholder="Search programs and files"
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                openFirstSearchResult();
              }
            }}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="shutdown-buttons">
          <button className="shutdown-btn" onClick={() => handlePowerAction('shutdown')}>
            Shut down
          </button>
          <button className="shutdown-options" onClick={() => setShowPowerMenu(prev => !prev)}>
            <span>▶</span>
          </button>
          {showPowerMenu && (
            <div className="power-menu">
              <button onClick={() => handlePowerAction('sleep')}>Sleep</button>
              <button onClick={() => handlePowerAction('restart')}>Restart</button>
              <button onClick={() => handlePowerAction('logoff')}>Log off</button>
              <button onClick={() => handlePowerAction('lock')}>Lock</button>
              <button onClick={() => handlePowerAction('shutdown')}>Shut down</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
