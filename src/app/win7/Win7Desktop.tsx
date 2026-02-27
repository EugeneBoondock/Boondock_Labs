"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useWin7 } from './Win7Context';
import Win7Taskbar from './Win7Taskbar';
import Win7StartMenu from './Win7StartMenu';
import Win7Window from './Win7Window';
import Win7Icon from './Win7Icon';
import Win7Startup from './Win7Startup';
import Win7Shutdown from './Win7Shutdown';
import { desktopApps, DesktopApp } from './desktopApps';
import { ClippyProvider } from './Win7Clippy';

// ── Desktop right-click context menu ─────────────────────────────────────────

interface CtxPos { x: number; y: number }

function Win7ContextMenu({
  pos,
  onClose,
  onOpenApp,
  showGadgets,
  onToggleGadgets,
}: {
  pos: CtxPos;
  onClose: () => void;
  onOpenApp: (app: DesktopApp) => void;
  showGadgets: boolean;
  onToggleGadgets: () => void;
}) {
  const [sub, setSub] = useState<string | null>(null);

  const W = 220, H_EST = 360, margin = 4;
  let left = pos.x;
  let top  = pos.y;
  if (left + W > window.innerWidth  - margin) left = window.innerWidth  - W - margin;
  if (top + H_EST > window.innerHeight - 52)  top  = window.innerHeight - H_EST - 52;

  const open = (id: string) => {
    const app = desktopApps.find(a => a.id === id);
    if (app) { onOpenApp(app); onClose(); }
  };

  return (
    <div
      className="win7-ctx-menu"
      style={{ left, top }}
      onClick={e => e.stopPropagation()}
      onContextMenu={e => e.preventDefault()}
    >
      {/* View */}
      <div
        className={`ctx-item has-sub${sub === 'view' ? ' active' : ''}`}
        onMouseEnter={() => setSub('view')}
        onMouseLeave={() => setSub(null)}
      >
        <span>View</span><span className="ctx-arrow">▶</span>
        {sub === 'view' && (
          <div className="ctx-submenu">
            <div className="ctx-item" onClick={onClose}>Large icons</div>
            <div className="ctx-item ctx-checked" onClick={onClose}>Medium icons</div>
            <div className="ctx-item" onClick={onClose}>Small icons</div>
            <div className="ctx-separator" />
            <div className="ctx-item" onClick={onClose}>Auto arrange icons</div>
            <div className="ctx-item" onClick={onClose}>Align icons to grid</div>
            <div className="ctx-separator" />
            <div className="ctx-item ctx-checked" onClick={onClose}>Show desktop icons</div>
            <div
              className={`ctx-item ${showGadgets ? 'ctx-checked' : ''}`}
              onClick={() => {
                onToggleGadgets();
                onClose();
              }}
            >
              Show desktop gadgets
            </div>
          </div>
        )}
      </div>

      {/* Sort by */}
      <div
        className={`ctx-item has-sub${sub === 'sort' ? ' active' : ''}`}
        onMouseEnter={() => setSub('sort')}
        onMouseLeave={() => setSub(null)}
      >
        <span>Sort by</span><span className="ctx-arrow">▶</span>
        {sub === 'sort' && (
          <div className="ctx-submenu">
            <div className="ctx-item ctx-checked" onClick={onClose}>Name</div>
            <div className="ctx-item" onClick={onClose}>Size</div>
            <div className="ctx-item" onClick={onClose}>Item type</div>
            <div className="ctx-item" onClick={onClose}>Date modified</div>
          </div>
        )}
      </div>

      <div className="ctx-item" onClick={() => { onClose(); window.location.reload(); }}>
        Refresh
      </div>

      <div className="ctx-separator" />

      {/* New */}
      <div
        className={`ctx-item has-sub${sub === 'new' ? ' active' : ''}`}
        onMouseEnter={() => setSub('new')}
        onMouseLeave={() => setSub(null)}
      >
        <span>New</span><span className="ctx-arrow">▶</span>
        {sub === 'new' && (
          <div className="ctx-submenu">
            <div className="ctx-item" onClick={() => open('notepad')}>
              <img src="/win7/icons/authentic/wine-notepad.png" className="ctx-item-icon" alt="" />
              Text Document
            </div>
            <div className="ctx-item" onClick={() => open('sticky-notes')}>
              <img src="/win7/icons/authentic/wine-notepad.png" className="ctx-item-icon" alt="" />
              Sticky Note
            </div>
            <div className="ctx-item" onClick={() => open('paint')}>
              <img src="/win7/icons/authentic/folder-pictures.png" className="ctx-item-icon" alt="" />
              Bitmap Image
            </div>
          </div>
        )}
      </div>

      <div className="ctx-separator" />

      <div className="ctx-item" onClick={() => open('computer')}>
        <img src="/win7/icons/authentic/control-center.png" className="ctx-item-icon" alt="" />
        Screen resolution
      </div>
      <div className="ctx-item" onClick={() => open('about')}>
        <img src="/win7/icons/authentic/gnome-fs-desktop.png" className="ctx-item-icon" alt="" />
        Personalize
      </div>
      <div className="ctx-item" onClick={() => open('task-manager')}>
        <img src="/win7/icons/authentic/network-config.png" className="ctx-item-icon" alt="" />
        Task Manager
      </div>
    </div>
  );
}

function Win7SidebarGadgets({ onOpenApp }: { onOpenApp: (app: DesktopApp) => void }) {
  const [now, setNow] = useState(new Date());
  const [cpu, setCpu] = useState(35);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
      setCpu(20 + Math.floor(Math.random() * 60));
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  const quickApps = ['calculator', 'sticky-notes', 'command-prompt', 'task-manager']
    .map(id => desktopApps.find(app => app.id === id))
    .filter((app): app is DesktopApp => Boolean(app));

  return (
    <aside className="win7-gadgets">
      <div className="gadget-card">
        <h4>Clock</h4>
        <div className="gadget-clock">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="gadget-sub">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
      </div>

      <div className="gadget-card">
        <h4>CPU Meter</h4>
        <div className="gadget-meter">
          <div style={{ width: `${cpu}%` }} />
        </div>
        <div className="gadget-sub">{cpu}% in use</div>
      </div>

      <div className="gadget-card">
        <h4>Quick Launch</h4>
        <div className="gadget-launch-list">
          {quickApps.map(app => (
            <button key={app.id} onClick={() => onOpenApp(app)}>
              <img src={app.icon} alt="" />
              <span>{app.name}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ── Desktop inner ─────────────────────────────────────────────────────────────

function Win7DesktopInner() {
  const { windows, openWindow, setStartMenuOpen, startupComplete, isShuttingDown } = useWin7();
  const [ctxMenu, setCtxMenu] = useState<CtxPos | null>(null);
  const [showGadgets, setShowGadgets] = useState(true);

  const handleOpenApp = useCallback((app: DesktopApp) => {
    openWindow({
      id: app.id,
      title: app.name,
      icon: app.icon,
      content: app.content,
      width: app.width,
      height: app.height,
    });
  }, [openWindow]);

  const handleDesktopClick = useCallback(() => {
    setStartMenuOpen(false);
    setCtxMenu(null);
  }, [setStartMenuOpen]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Only trigger on the desktop background itself, not on windows
    if ((e.target as HTMLElement).closest('.win7-window, .win7-taskbar, .start-menu, .clippy-chat-panel, .win7-gadgets')) return;
    e.preventDefault();
    setStartMenuOpen(false);
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }, [setStartMenuOpen]);

  if (!startupComplete) return <Win7Startup />;
  if (isShuttingDown)   return <Win7Shutdown />;

  const desktopIcons = desktopApps.filter(app => app.showOnDesktop);

  return (
    <div
      className="win7-desktop"
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      <div className="desktop-background" />

      <div className="desktop-icons">
        {desktopIcons.map((app) => (
          <Win7Icon
            key={app.id}
            icon={app.icon}
            label={app.name}
            onDoubleClick={() => handleOpenApp(app)}
          />
        ))}
      </div>

      {showGadgets && <Win7SidebarGadgets onOpenApp={handleOpenApp} />}

      {windows.map(win => (
        <Win7Window key={win.id} window={win} />
      ))}

      {ctxMenu && (
        <Win7ContextMenu
          pos={ctxMenu}
          onClose={() => setCtxMenu(null)}
          onOpenApp={handleOpenApp}
          showGadgets={showGadgets}
          onToggleGadgets={() => setShowGadgets(prev => !prev)}
        />
      )}

      <Win7StartMenu onOpenApp={handleOpenApp} />
      <Win7Taskbar />
    </div>
  );
}

export default function Win7Desktop() {
  return (
    <ClippyProvider>
      <Win7DesktopInner />
    </ClippyProvider>
  );
}
