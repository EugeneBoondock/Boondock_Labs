import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mobile detection utilities for performance optimization
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768; // Standard mobile breakpoint
}

export function isSmallMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 640; // Small mobile breakpoint
}
