"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useWin7, Win7Window as Win7WindowType } from './Win7Context';

interface Win7WindowProps {
  window: Win7WindowType;
}

export default function Win7Window({ window: win }: Win7WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, updateWindowPosition, activeWindowId } = useWin7();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isActive = activeWindowId === win.id;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    focusWindow(win.id);
    
    if ((e.target as HTMLElement).closest('.title-bar')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - win.x,
        y: e.clientY - win.y
      });
    }
  }, [focusWindow, win.id, win.x, win.y]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && !win.isMaximized) {
      const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, globalThis.innerWidth - 100));
      const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, globalThis.innerHeight - 100));
      updateWindowPosition(win.id, newX, newY);
    }
  }, [isDragging, dragOffset, win.id, win.isMaximized, updateWindowPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleDoubleClickTitleBar = useCallback(() => {
    if (win.isMaximized) {
      restoreWindow(win.id);
    } else {
      maximizeWindow(win.id);
    }
  }, [win.isMaximized, win.id, maximizeWindow, restoreWindow]);

  if (win.isMinimized) return null;

  const windowStyle: React.CSSProperties = win.isMaximized 
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100% - 48px)',
        zIndex: win.zIndex,
      }
    : {
        position: 'absolute',
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className={`win7-window ${isActive ? 'active' : 'inactive'}`}
      style={windowStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Title Bar */}
      <div 
        className={`title-bar ${isActive ? 'active' : ''}`}
        onDoubleClick={handleDoubleClickTitleBar}
      >
        <div className="title-bar-icon">
          <img src={win.icon} alt="" className="w-4 h-4" />
        </div>
        <div className="title-bar-text">{win.title}</div>
        <div className="window-controls">
          <button 
            className="minimize-btn"
            onClick={() => minimizeWindow(win.id)}
            title="Minimize"
          >
            <span>─</span>
          </button>
          <button 
            className="maximize-btn"
            onClick={() => win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)}
            title={win.isMaximized ? "Restore" : "Maximize"}
          >
            <span>{win.isMaximized ? '❐' : '□'}</span>
          </button>
          <button 
            className="close-btn"
            onClick={() => closeWindow(win.id)}
            title="Close"
          >
            <span>✕</span>
          </button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="window-content">
        {win.content}
      </div>
    </div>
  );
}
