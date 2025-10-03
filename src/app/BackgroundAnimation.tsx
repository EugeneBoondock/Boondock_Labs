"use client";
import { useRef, useEffect, useState } from 'react';

function randomAngle() {
  return Math.random() * 2 * Math.PI;
}

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [footerVisible, setFooterVisible] = useState(false);
  const [footerY, setFooterY] = useState<number|null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = width <= 640;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width <= 640;
      canvas.width = width;
      canvas.height = height;
      // Update footerY on resize
      const footer = document.querySelector('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setFooterY(rect.top + window.scrollY);
      }
    };
    window.addEventListener('resize', handleResize);

    // IntersectionObserver to track footer visibility
    let observer: IntersectionObserver | null = null;
    // Set up observer with multiple thresholds for more robust detection
    const footer = document.querySelector('footer');
    if (footer) {
      observer = new window.IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setFooterVisible(entry.intersectionRatio > 0.2); // Only show if at least 20% visible
          // Update footerY when visibility changes
          const rect = footer.getBoundingClientRect();
          setFooterY(rect.top + window.scrollY);
        },
        { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
      );
      observer.observe(footer);
      // Set initial state
      const rect = footer.getBoundingClientRect();
      setFooterY(rect.top + window.scrollY);
      setFooterVisible(rect.bottom > 0 && rect.top < window.innerHeight && (Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)) > 40);
    }

    // Particle system
    const PARTICLE_COUNT = 32;
    const scale = isMobile ? 0.6 : 1;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(randomAngle()) * 0.05 * scale,
      vy: Math.sin(randomAngle()) * 0.05 * scale,
      r: (6 + Math.random() * 8) * scale,
      color: Math.random() > 0.7 ? 'rgba(209,121,39,0.7)' : 'rgba(209,121,39,0.25)'
    }));

    // Bond tension matrix: tension[i][j] tracks how long i and j have been close
    let tension = Array.from({ length: PARTICLE_COUNT }, () => Array(PARTICLE_COUNT).fill(0));
    const TENSION_THRESHOLD = 120; // frames close before breaking apart
    const TENSION_DECAY = 0.96; // how quickly tension decays when not close
    const BOND_DIST = 48; // distance considered 'stuck'
    const REPULSE_STRENGTH = 2.2; // how hard to push apart
    const REPULSION_BURST = 2.5;

    // Restore globalAngle and union-find helpers
    let globalAngle = 0;
    function find(par: number[], i: number): number {
      if (par[i] !== i) par[i] = find(par, par[i]);
      return par[i];
    }
    function union(par: number[], size: number[], i: number, j: number): void {
      const pi = find(par, i);
      const pj = find(par, j);
      if (pi === pj) return;
      if (size[pi] + size[pj] <= 5) {
        par[pi] = pj;
        size[pj] += size[pi];
      }
    }

    // Instead of a cannon, periodically spawn a new ball from the bottom left corner
    const SPAWN_INTERVAL = 90; // frames between spawns
    let spawnCooldown = 0;

    function spawnBallFromBottomLeft() {
      // Spawn at (x=0, y=height), with random right/up velocity
      const angle = Math.PI * (0.1 + 0.3 * Math.random()); // between ~18deg and ~72deg
      particles.push({
        x: 0,
        y: height,
        vx: Math.cos(angle) * 1.5 * scale,
        vy: -Math.abs(Math.sin(angle) * 1.5 * scale),
        r: (10 + Math.random() * 4) * scale,
        color: 'rgba(209,121,39,0.7)'
      });
      // Rebuild tension matrix to match new particles.length
      const n = particles.length;
      const newTension = Array.from({ length: n }, (_, ii) => Array(n).fill(0));
      for (let ii = 0; ii < Math.min(tension.length, n); ii++) {
        for (let jj = 0; jj < Math.min(tension.length, n); jj++) {
          newTension[ii][jj] = tension[ii][jj] || 0;
        }
      }
      tension = newTension;
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // --- Union-find for networks ---
      const n = particles.length;
      const par = Array.from({ length: n }, (_, i) => i);
      const size = Array(n).fill(1);
      // First pass: build networks for allowed connections only
      const connections: number[][] = Array.from({ length: n }, () => []);
      for (let i = 0; i < n; i++) {
        // Find all other particles and their distances
        const dists = [];
        for (let j = 0; j < n; j++) {
          if (i === j) continue;
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 160) dists.push({ j, dist });
        }
        dists.sort((a, b) => a.dist - b.dist);
        let count = 0;
        for (let k = 0; k < dists.length && count < 5; k++) {
          const j = dists[k].j;
          // Only connect if union would not exceed 5
          const pi = find(par, i);
          const pj = find(par, j);
          if (pi !== pj && size[pi] + size[pj] <= 5) {
            union(par, size, i, j);
            connections[i].push(j);
            count++;
          } else if (pi === pj) {
            // Already in same network, allow connection if network size <= 5
            if (size[pi] <= 5) {
              connections[i].push(j);
              count++;
            }
          }
        }
      }
      // Draw lines for valid connections only (once per pair)
      for (let i = 0; i < n; i++) {
        for (const j of connections[i]) {
          if (i < j) {
            const a = particles[i];
            const b = particles[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            ctx.save();
            ctx.globalAlpha = 0.08 + 0.12 * (1 - dist / 160);
            ctx.strokeStyle = 'rgba(209,121,39,0.7)';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      // Draw particles
      for (const p of particles) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = 'rgba(209,121,39,0.5)';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }
    }

    function update() {
      globalAngle += 0.002;
      // Ever-evolving: occasionally randomize direction and inject energy
      if (Math.random() < 0.01) {
        for (const p of particles) {
          if (Math.random() < 0.2) {
            const angle = randomAngle();
            p.vx += Math.cos(angle) * 0.07;
            p.vy += Math.sin(angle) * 0.07;
          }
        }
      }
      // --- Ball spawning logic (bottom left corner) ---
      spawnCooldown--;
      if (spawnCooldown <= 0) {
        spawnBallFromBottomLeft();
        spawnCooldown = SPAWN_INTERVAL + Math.floor(Math.random() * 30);
      }
      // --- Particle update and spring forces (limit to 5 connections, only valid ones) ---
      // Rebuild union-find and connections as in draw()
      const n = particles.length;
      const par = Array.from({ length: n }, (_, i) => i);
      const size = Array(n).fill(1);
      const connections: number[][] = Array.from({ length: n }, () => []);
      for (let i = 0; i < n; i++) {
        const dists = [];
        for (let j = 0; j < n; j++) {
          if (i === j) continue;
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 160) dists.push({ j, dist });
        }
        dists.sort((a, b) => a.dist - b.dist);
        let count = 0;
        for (let k = 0; k < dists.length && count < 5; k++) {
          const j = dists[k].j;
          const pi = find(par, i);
          const pj = find(par, j);
          if (pi !== pj && size[pi] + size[pj] <= 5) {
            union(par, size, i, j);
            connections[i].push(j);
            count++;
          } else if (pi === pj) {
            if (size[pi] <= 5) {
              connections[i].push(j);
              count++;
            }
          }
        }
      }
      // --- Network collision/hijack/destroy logic ---
      // For each pair of balls, if they are close and in different networks, handle hijack/destroy
      const toDestroy = new Set<number>();
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          const pi = find(par, i);
          const pj = find(par, j);
          if (dist < a.r + b.r && pi !== pj) {
            // Network sizes
            const sizeA = size[pi];
            const sizeB = size[pj];
            if (sizeA + sizeB > 5) {
              // Destroy the ball from the smaller network
              if (sizeA < sizeB) toDestroy.add(i);
              else if (sizeB < sizeA) toDestroy.add(j);
              else {
                // If equal, apply strong repulsion to both (no destruction)
                const angle = Math.atan2(b.y - a.y, b.x - a.x);
                a.vx -= Math.cos(angle) * REPULSION_BURST;
                a.vy -= Math.sin(angle) * REPULSION_BURST;
                b.vx += Math.cos(angle) * REPULSION_BURST;
                b.vy += Math.sin(angle) * REPULSION_BURST;
              }
            } else if (sizeA + sizeB === 5) {
              // Hijack: merge the networks
              union(par, size, i, j);
            }
          }
        }
      }
      // Remove destroyed balls
      if (toDestroy.size > 0) {
        // Remove from highest index to lowest to avoid reindexing issues
        const sorted = Array.from(toDestroy).sort((a, b) => b - a);
        for (const idx of sorted) {
          particles.splice(idx, 1);
          const row = tension[idx];
          for (const row of tension) row.splice(idx, 1);
        }
        return; // Skip the rest of update this frame to avoid errors
      }
      for (let i = 0; i < n; i++) {
        const p = particles[i];
        // Global swirling drift (like Perlin noise field)
        const swirl = 0.04 * Math.sin(globalAngle + p.x * 0.002 + p.y * 0.002);
        p.vx += swirl * Math.cos(globalAngle + p.y * 0.001);
        p.vy += swirl * Math.sin(globalAngle + p.x * 0.001);
        // Spring forces only for valid connections
        for (const j of connections[i]) {
          if (i < j) {
            const q = particles[j];
            const dx = q.x - p.x;
            const dy = q.y - p.y;
            const dist = Math.hypot(dx, dy);
            // --- Bond tension logic ---
            if (dist < BOND_DIST) {
              if (!tension[i]) tension[i] = [];
              if (!tension[j]) tension[j] = [];
              tension[i][j] = (tension[i][j] || 0) + 1;
              tension[j][i] = (tension[j][i] || 0) + 1;
              // If tension exceeds threshold, break apart with a burst
              if (tension[i][j] > TENSION_THRESHOLD) {
                // Repel both particles strongly
                const angle = Math.atan2(dy, dx);
                const fx = Math.cos(angle) * REPULSE_STRENGTH;
                const fy = Math.sin(angle) * REPULSE_STRENGTH;
                p.vx -= fx / p.r;
                p.vy -= fy / p.r;
                q.vx += fx / q.r;
                q.vy += fy / q.r;
                // Reset tension
                tension[i][j] = 0;
                tension[j][i] = 0;
              }
            } else {
              if (tension[i] && tension[j]) {
                tension[i][j] = (tension[i][j] || 0) * TENSION_DECAY;
                tension[j][i] = (tension[j][i] || 0) * TENSION_DECAY;
              }
            }
            if (dist < 160 && dist > 0.1) {
              // Oscillating spring force (slower)
              const osc = Math.sin(globalAngle * 2 + i + j);
              const force = (dist - 80 + osc * 10) * 0.00025;
              const fx = force * dx;
              const fy = force * dy;
              p.vx += fx / p.r;
              p.vy += fy / p.r;
              q.vx -= fx / q.r;
              q.vy -= fy / q.r;
            }
          }
        }
        // Minimum velocity so they never stop (slower)
        const minV = 0.02;
        if (Math.abs(p.vx) < minV) p.vx += (Math.random() - 0.5) * 0.01;
        if (Math.abs(p.vy) < minV) p.vy += (Math.random() - 0.5) * 0.01;
        // Slow down (friction)
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        // Bounce off walls
        if (p.x < p.r) { p.x = p.r; p.vx *= -1; }
        if (p.x > width - p.r) { p.x = width - p.r; p.vx *= -1; }
        if (p.y < p.r) { p.y = p.r; p.vy *= -1; }
        if (p.y > height - p.r) { p.y = height - p.r; p.vy *= -1; }
      }
    }

    let running = true;
    function animate() {
      if (!running) return;
      update();
      draw();
      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      if (observer && footer) observer.unobserve(footer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
} 