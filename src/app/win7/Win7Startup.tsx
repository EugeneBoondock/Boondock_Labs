"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useWin7 } from "./Win7Context";

type StartupPhase = "boot" | "signin" | "welcome";

const USER_NAME = "Eugene Boondock";
const USER_ICON = "/win7/user-avatar.png";

// 105 frames at 15 FPS — frames 60-104 loop after intro
const TOTAL_FRAMES = 105;
const LOOP_START_FRAME = 60;
const FRAME_MS = Math.round(1000 / 15); // ~67 ms per frame
const BOOT_DURATION_MS = 7000;

const FRAME_SRCS = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `/win7/boot/flag${i}.png`
);

export default function Win7Startup() {
  const { setStartupComplete } = useWin7();
  const [phase, setPhase] = useState<StartupPhase>("boot");
  const [currentFrame, setCurrentFrame] = useState(0);
  const frameRef = useRef(0);

  // Pre-built Audio object — ready to fire the instant the user clicks
  const startupAudioRef = useRef<HTMLAudioElement | null>(null);

  // Eagerly preload every frame image so the animation is stutter-free
  useEffect(() => {
    FRAME_SRCS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Prime the audio element early so the browser doesn't block it later
    const audio = new Audio("/windows7_startup.mp3");
    audio.preload = "auto";
    audio.volume = 0.7;
    startupAudioRef.current = audio;
  }, []);

  // ===== BOOT PHASE — silent, just frame animation =====
  useEffect(() => {
    const frameTimer = setInterval(() => {
      const next =
        frameRef.current < TOTAL_FRAMES - 1
          ? frameRef.current + 1
          : LOOP_START_FRAME;
      frameRef.current = next;
      setCurrentFrame(next);
    }, FRAME_MS);

    const bootTimer = setTimeout(() => setPhase("signin"), BOOT_DURATION_MS);

    return () => {
      clearInterval(frameTimer);
      clearTimeout(bootTimer);
    };
  }, []);

  // ===== SIGNIN PHASE =====
  // On real Win7, the startup melody fires the moment the user clicks their
  // login tile — right as "Welcome" appears. We mirror that here.
  const moveToWelcome = useCallback(() => {
    setPhase((current) => {
      if (current !== "signin") return current;

      // Play the startup sound exactly at this transition point
      if (startupAudioRef.current) {
        startupAudioRef.current.currentTime = 0;
        void startupAudioRef.current.play().catch(() => {});
      }

      return "welcome";
    });
  }, []);

  useEffect(() => {
    if (phase !== "signin") return;
    const signinTimer = setTimeout(moveToWelcome, 1800);
    return () => clearTimeout(signinTimer);
  }, [phase, moveToWelcome]);

  // ===== WELCOME PHASE =====
  useEffect(() => {
    if (phase !== "welcome") return;
    // Give the melody time to play, then hand off to the desktop
    const completeTimer = setTimeout(() => setStartupComplete(true), 3500);
    return () => clearTimeout(completeTimer);
  }, [phase, setStartupComplete]);

  // ── Boot screen ──────────────────────────────────────────────────────────
  if (phase === "boot") {
    return (
      <div className="startup-screen win7-boot-screen">
        <div className="win7-boot-anim-wrap" aria-hidden="true">
          <img
            src={FRAME_SRCS[currentFrame]}
            alt=""
            className="win7-boot-frame"
          />
        </div>

        <img
          src="/win7/boot/branding_7.png"
          alt="Starting Windows"
          className="win7-boot-branding"
          draggable={false}
        />

        <div className="copyright-text">Boondock Labs</div>
      </div>
    );
  }

  // ── Sign-in screen ───────────────────────────────────────────────────────
  if (phase === "signin") {
    return (
      <div className="startup-screen win7-login-screen">
        <div className="win7-login-content">
          <button
            className="win7-user-tile"
            type="button"
            onClick={moveToWelcome}
          >
            <div className="welcome-avatar win7-login-avatar">
              <img src={USER_ICON} alt={`${USER_NAME} account picture`} />
            </div>
            <div className="win7-user-name">{USER_NAME}</div>
          </button>
          <div className="win7-login-hint">Click your user name to log on</div>
        </div>
        <div className="win7-login-footer">
          <span>Switch User</span>
          <span className="win7-power-button" aria-hidden="true" />
        </div>
      </div>
    );
  }

  // ── Welcome screen ───────────────────────────────────────────────────────
  return (
    <div className="startup-screen welcome win7-welcome-screen">
      <div className="welcome-content">
        <div className="welcome-avatar win7-welcome-avatar">
          <img src={USER_ICON} alt={`${USER_NAME} account picture`} />
        </div>
        <div className="welcome-user">{USER_NAME}</div>
        <div className="welcome-text">Welcome</div>
        <div className="loading-dots win7-loader" aria-hidden="true">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </div>
  );
}
