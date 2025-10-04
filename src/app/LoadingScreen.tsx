'use client';

import { useEffect, useState } from 'react';
import { animate } from 'animejs';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if page is fully loaded and ready
    const checkPageReady = () => {
      // Check if main content is loaded - look for main-content div
      const mainContentDiv = document.getElementById('main-content');
      const hasContent = mainContentDiv && document.querySelector('main');

      if (hasContent) {
        setIsPageReady(true);
      }
    };

    // Check immediately and then periodically
    checkPageReady();
    const interval = setInterval(checkPageReady, 100);

    // Create loading animation
    const loader = document.querySelector('.loading-container');
    const circles = document.querySelectorAll('.loading-circle');
    const text = document.querySelector('.loading-text');

    if (!loader || !circles.length || !text) return;

    // Animate circles expanding
    animate(circles, {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 1000,
      delay: (el, i) => i * 100,
      ease: 'out(3)'
    });

    // Animate text
    animate(text, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: 400,
      ease: 'out(2)'
    });

    // Pulsing animation for circles
    setTimeout(() => {
      animate(circles, {
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
        duration: 1500,
        loop: true,
        ease: 'inOut-quad',
        delay: (el, i) => i * 100
      });
    }, 1200);

    // Hide loading screen when page is ready (minimum 2 seconds for good UX)
    const hideLoadingScreen = () => {
      animate(loader, {
        opacity: [1, 0],
        scale: [1, 1.1],
        duration: 600,
        ease: 'in(2)',
        complete: () => {
          setIsLoading(false);
          // Show main content
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.style.display = 'block';
          }
        }
      });
    };

    // Set minimum loading time of 2 seconds for better UX
    const minLoadingTime = setTimeout(() => {
      if (isPageReady) {
        hideLoadingScreen();
      }
    }, 2000);

    // Keep checking and hide when ready (after minimum time has passed)
    let hasMinTimePassed = false;
    setTimeout(() => {
      hasMinTimePassed = true;
    }, 2000);

    const readyCheckInterval = setInterval(() => {
      if (isPageReady && hasMinTimePassed) {
        clearInterval(readyCheckInterval);
        hideLoadingScreen();
      }
    }, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(minLoadingTime);
      clearInterval(readyCheckInterval);
    };
  }, [isMounted, isPageReady]);

  if (!isMounted || !isLoading) return null;

  return (
    <div className="loading-container fixed inset-0 z-[9999] flex items-center justify-center bg-[#e7dbc8]">
      {/* Animated circles - orbital design */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer orbital ring */}
        <div className="loading-circle absolute inset-0 rounded-full border-2 border-[#d17927]/15"></div>
        
        {/* Middle orbital ring */}
        <div className="loading-circle absolute inset-8 rounded-full border-2 border-[#d17927]/20"></div>
        
        {/* Inner orbital ring */}
        <div className="loading-circle absolute inset-16 rounded-full border-2 border-[#d17927]/25"></div>
        
        {/* Center sun/planet with logo */}
        <div className="loading-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#d17927] to-[#e08a38] shadow-xl shadow-[#d17927]/40 flex items-center justify-center p-3">
          <Image 
            src="/Boondocklabs.png" 
            alt="Boondock Labs" 
            width={48} 
            height={48}
            className="object-contain"
          />
        </div>

        {/* Orbital particles - scattered around */}
        {/* Top left area */}
        <div className="loading-circle absolute top-8 left-12 w-3 h-3 rounded-full bg-[#d17927]"></div>
        <div className="loading-circle absolute top-16 left-6 w-2 h-2 rounded-full bg-[#e08a38]"></div>
        
        {/* Top right area */}
        <div className="loading-circle absolute top-6 right-16 w-2.5 h-2.5 rounded-full bg-[#d17927]"></div>
        <div className="loading-circle absolute top-14 right-8 w-2 h-2 rounded-full bg-[#e08a38]"></div>
        
        {/* Bottom left area */}
        <div className="loading-circle absolute bottom-12 left-8 w-2 h-2 rounded-full bg-[#d17927]"></div>
        <div className="loading-circle absolute bottom-16 left-16 w-2.5 h-2.5 rounded-full bg-[#e08a38]"></div>
        
        {/* Bottom right area */}
        <div className="loading-circle absolute bottom-8 right-12 w-2 h-2 rounded-full bg-[#d17927]"></div>
        
        {/* Small accent dots */}
        <div className="loading-circle absolute top-20 left-20 w-1.5 h-1.5 rounded-full bg-[#d17927]/60"></div>
        <div className="loading-circle absolute bottom-20 right-20 w-1.5 h-1.5 rounded-full bg-[#e08a38]/60"></div>
      </div>

      {/* Loading text */}
      <div className="loading-text absolute bottom-1/4 left-1/2 -translate-x-1/2 text-center">
        <h2 className="text-3xl font-bold" style={{ color: '#d17927' }}>
          Boondock Labs
        </h2>
        <div className="flex items-center justify-center space-x-1 mt-3">
          <div className="w-2 h-2 bg-[#d17927] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-[#d17927] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-[#d17927] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
