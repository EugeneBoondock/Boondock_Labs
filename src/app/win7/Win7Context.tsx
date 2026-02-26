"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Win7Window {
  id: string;
  title: string;
  icon: string;
  content: ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Win7ContextType {
  windows: Win7Window[];
  activeWindowId: string | null;
  openWindow: (window: Omit<Win7Window, 'zIndex' | 'isMinimized' | 'isMaximized' | 'x' | 'y' | 'width' | 'height'> & Partial<Pick<Win7Window, 'x' | 'y' | 'width' | 'height'>>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  isStartMenuOpen: boolean;
  setStartMenuOpen: (open: boolean) => void;
  startupComplete: boolean;
  setStartupComplete: (complete: boolean) => void;
  isShuttingDown: boolean;
  setShuttingDown: (shutdown: boolean) => void;
}

const Win7Context = createContext<Win7ContextType | null>(null);

export function Win7Provider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<Win7Window[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const [startupComplete, setStartupComplete] = useState(false);
  const [isShuttingDown, setShuttingDown] = useState(false);

  const openWindow = useCallback((windowData: Omit<Win7Window, 'zIndex' | 'isMinimized' | 'isMaximized' | 'x' | 'y' | 'width' | 'height'> & Partial<Pick<Win7Window, 'x' | 'y' | 'width' | 'height'>>) => {
    setWindows(prev => {
      const existingWindow = prev.find(w => w.id === windowData.id);
      if (existingWindow) {
        // If window exists, just focus it
        return prev.map(w => 
          w.id === windowData.id 
            ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 }
            : w
        );
      }
      
      // Create new window with slight offset based on number of windows
      const offset = (prev.length % 5) * 30;
      const newWindow: Win7Window = {
        ...windowData,
        isMinimized: false,
        isMaximized: false,
        zIndex: highestZIndex + 1,
        x: windowData.x ?? 100 + offset,
        y: windowData.y ?? 50 + offset,
        width: windowData.width ?? 800,
        height: windowData.height ?? 600,
      };
      return [...prev, newWindow];
    });
    setHighestZIndex(prev => prev + 1);
    setActiveWindowId(windowData.id);
    setStartMenuOpen(false);
  }, [highestZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: true, zIndex: highestZIndex + 1 } : w
    ));
    setHighestZIndex(prev => prev + 1);
    setActiveWindowId(id);
  }, [highestZIndex]);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: false, isMinimized: false, zIndex: highestZIndex + 1 } : w
    ));
    setHighestZIndex(prev => prev + 1);
    setActiveWindowId(id);
  }, [highestZIndex]);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: highestZIndex + 1, isMinimized: false } : w
    ));
    setHighestZIndex(prev => prev + 1);
    setActiveWindowId(id);
    setStartMenuOpen(false);
  }, [highestZIndex]);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, width, height } : w
    ));
  }, []);

  return (
    <Win7Context.Provider value={{
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      isStartMenuOpen,
      setStartMenuOpen,
      startupComplete,
      setStartupComplete,
      isShuttingDown,
      setShuttingDown,
    }}>
      {children}
    </Win7Context.Provider>
  );
}

export function useWin7() {
  const context = useContext(Win7Context);
  if (!context) {
    throw new Error('useWin7 must be used within a Win7Provider');
  }
  return context;
}
