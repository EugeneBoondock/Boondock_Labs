"use client";

import React, { useCallback } from 'react';
import { useWin7 } from './Win7Context';
import Win7Taskbar from './Win7Taskbar';
import Win7StartMenu from './Win7StartMenu';
import Win7Window from './Win7Window';
import Win7Icon from './Win7Icon';
import Win7Startup from './Win7Startup';
import Win7Shutdown from './Win7Shutdown';
import { desktopApps, DesktopApp } from './desktopApps';
import { ClippyProvider } from './Win7Clippy';

function Win7DesktopInner() {
  const { windows, openWindow, setStartMenuOpen, startupComplete, isShuttingDown } = useWin7();

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
  }, [setStartMenuOpen]);

  if (!startupComplete) {
    return <Win7Startup />;
  }

  if (isShuttingDown) {
    return <Win7Shutdown />;
  }

  const desktopIcons = desktopApps.filter(app => app.showOnDesktop);

  return (
    <div className="win7-desktop" onClick={handleDesktopClick}>
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

      {windows.map(win => (
        <Win7Window key={win.id} window={win} />
      ))}

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
