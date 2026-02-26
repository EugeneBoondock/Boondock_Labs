"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useWin7 } from "./Win7Context";
import { playWin7Sound } from "./win7Sounds";

type StartupPhase = "boot" | "signin" | "welcome";

const USER_NAME = "Eugene Boondock";
const USER_ICON = "/win7/icons/repo/user-profile.ico";
const STARTUP_SOUND_URL =
  "https://raw.githubusercontent.com/bartekl1/windows-ui-assets/main/Sounds/Windows%207/Windows%20Startup.wav";

export default function Win7Startup() {
  const { setStartupComplete } = useWin7();
  const [phase, setPhase] = useState<StartupPhase>("boot");
  const startupSoundPlayed = useRef(false);

  useEffect(() => {
    const audio = new Audio(STARTUP_SOUND_URL);
    audio.preload = "auto";
    audio.volume = 0.45;

    const retryPlay = () => {
      if (startupSoundPlayed.current) return;
      void audio
        .play()
        .then(() => {
          startupSoundPlayed.current = true;
        })
        .catch(() => {
          // Browser autoplay blocked; we'll retry on user interaction.
        });
    };

    const retryOnInteraction = () => {
      retryPlay();
      if (startupSoundPlayed.current) {
        document.removeEventListener("pointerdown", retryOnInteraction);
        document.removeEventListener("keydown", retryOnInteraction);
      }
    };

    retryPlay();
    document.addEventListener("pointerdown", retryOnInteraction);
    document.addEventListener("keydown", retryOnInteraction);

    const bootTimer = setTimeout(() => setPhase("signin"), 4200);
    return () => {
      clearTimeout(bootTimer);
      document.removeEventListener("pointerdown", retryOnInteraction);
      document.removeEventListener("keydown", retryOnInteraction);
      audio.pause();
    };
  }, []);

  const moveToWelcome = useCallback(() => {
    setPhase((current) => (current === "signin" ? "welcome" : current));
  }, []);

  useEffect(() => {
    if (phase !== "signin") return;
    const signinTimer = setTimeout(moveToWelcome, 1800);
    return () => clearTimeout(signinTimer);
  }, [phase, moveToWelcome]);

  useEffect(() => {
    if (phase !== "welcome") return;
    void playWin7Sound("logon");
    const completeTimer = setTimeout(() => setStartupComplete(true), 2200);
    return () => clearTimeout(completeTimer);
  }, [phase, setStartupComplete]);

  if (phase === "boot") {
    return (
      <div className="startup-screen logo win7-boot-screen">
        <div className="windows-logo-container">
          <div className="windows-logo-animated" aria-hidden="true">
            <div className="win7-flag-logo">
              <div className="win7-logo-pane pane-red" />
              <div className="win7-logo-pane pane-green" />
              <div className="win7-logo-pane pane-blue" />
              <div className="win7-logo-pane pane-yellow" />
            </div>
          </div>
          <div className="startup-text">Starting Windows</div>
          <div
            className="loading-dots win7-loader win7-loader-boot"
            aria-hidden="true"
          >
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
        <div className="copyright-text">Microsoft Corporation</div>
      </div>
    );
  }

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
