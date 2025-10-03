'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, utils } from 'animejs';

export default function AnimeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const container = containerRef.current;
    const numElements = 50; // Reduced particles for cleaner look

    // Create floating geometric shapes
    for (let i = 0; i < numElements; i++) {
      const shape = document.createElement('div');
      shape.className = 'anime-shape';

      // Random shape type with more variety
      const shapeType = Math.random();
      if (shapeType < 0.25) {
        shape.style.borderRadius = '50%'; // Circle
      } else if (shapeType < 0.5) {
        shape.style.borderRadius = '12px'; // Rounded square
      } else if (shapeType < 0.75) {
        shape.style.borderRadius = '0'; // Square
        shape.style.transform = 'rotate(45deg)'; // Diamond
      } else {
        // Hexagon-like shape
        shape.style.borderRadius = '30%';
        shape.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
      }

      // Varied size distribution (more small, some large for depth)
      const sizeType = Math.random();
      let size;
      if (sizeType < 0.5) {
        size = 10 + Math.random() * 30; // Small particles
      } else if (sizeType < 0.85) {
        size = 30 + Math.random() * 50; // Medium particles
      } else {
        size = 70 + Math.random() * 80; // Large particles for dramatic effect
      }
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;

      // Random initial position
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;

      // Varied opacity based on size
      const opacity = size < 30 ? 0.15 + Math.random() * 0.2 : 0.08 + Math.random() * 0.15;
      shape.style.opacity = `${opacity}`;

      // Rich color variations (orange palette with gradients)
      const colorVariation = Math.random();
      if (colorVariation < 0.2) {
        shape.style.background = 'linear-gradient(135deg, rgba(209, 121, 39, 0.5), rgba(255, 200, 120, 0.2))';
      } else if (colorVariation < 0.4) {
        shape.style.background = 'linear-gradient(45deg, rgba(240, 140, 60, 0.4), rgba(209, 121, 39, 0.3))';
      } else if (colorVariation < 0.6) {
        shape.style.background = 'radial-gradient(circle, rgba(255, 180, 100, 0.45), rgba(209, 121, 39, 0.2))';
      } else if (colorVariation < 0.8) {
        shape.style.background = 'rgba(209, 121, 39, 0.4)';
      } else {
        shape.style.background = 'rgba(255, 165, 80, 0.35)';
      }

      // Enhanced shadows for depth
      if (size > 50) {
        shape.style.boxShadow = '0 8px 32px rgba(209, 121, 39, 0.25), 0 0 60px rgba(255, 180, 100, 0.15)';
        shape.style.filter = 'blur(1px)';
      } else {
        shape.style.boxShadow = '0 4px 20px rgba(209, 121, 39, 0.2)';
      }

      container.appendChild(shape);
    }

    // Initial loading animation - expand from center
    const shapes = document.querySelectorAll('.anime-shape');

    shapes.forEach((shape, i) => {
      animate(shape, {
        scale: [0, 1],
        opacity: [0, 0.3],
        rotate: [utils.random(-360, 360), 0],
        duration: 1500,
        delay: i * 20,
        ease: 'out(3)'
      });
    });

    // After loading, start continuous animations
    setTimeout(() => {
      setLoading(false);

      shapes.forEach((shape, i) => {
        const element = shape as HTMLElement;
        const shapeSize = parseFloat(element.style.width);
        
        // More dramatic movements for larger shapes
        const movementRange = shapeSize > 50 ? 200 : shapeSize > 30 ? 150 : 100;
        
        // Main movement animation - more dynamic
        animate(shape, {
          translateX: [0, utils.random(-movementRange, movementRange), utils.random(-movementRange/2, movementRange/2), 0],
          translateY: [0, utils.random(-movementRange, movementRange), utils.random(-movementRange/2, movementRange/2), 0],
          scale: [1, utils.random(0.6, 1.8), utils.random(0.8, 1.4), 1],
          rotate: [0, utils.random(-180, 180), utils.random(-360, 360), 0],
          duration: 8000 + i * 400,
          ease: 'inOut(2.5)',
          loop: true
        });

        // Enhanced pulsing animation with more variation
        setTimeout(() => {
          animate(shape, {
            opacity: [0.1, utils.random(0.25, 0.5), utils.random(0.15, 0.35), 0.1],
            duration: 3500 + i * 150,
            ease: 'inOut-quad',
            loop: true
          });
        }, i * 40);

        // Multi-directional floating animation
        setTimeout(() => {
          animate(shape, {
            translateY: [0, utils.random(-120, 120), utils.random(-60, 60), 0],
            translateX: [0, utils.random(-60, 60), 0],
            duration: 6000 + i * 250,
            ease: 'inOut-sine',
            loop: true
          });
        }, i * 80);

        // Rotation animation for some shapes
        if (Math.random() > 0.5) {
          setTimeout(() => {
            animate(shape, {
              rotate: [0, 360],
              duration: 15000 + i * 500,
              ease: 'linear',
              loop: true
            });
          }, i * 120);
        }

        // Pulsing scale animation
        if (Math.random() > 0.6) {
          setTimeout(() => {
            animate(shape, {
              scale: [1, utils.random(1.2, 1.6), 1],
              duration: 4000 + i * 300,
              ease: 'inOut-elastic(1, 0.5)',
              loop: true
            });
          }, i * 100);
        }
      });
    }, 2000);

    // Cleanup
    return () => {
      container.innerHTML = '';
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}
