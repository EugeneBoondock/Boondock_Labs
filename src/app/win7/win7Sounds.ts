// Windows 7 Sound Effects
// Sound files sourced from: https://github.com/bartekl1/windows-ui-assets (MIT/Personal use)

const BASE =
  'https://raw.githubusercontent.com/bartekl1/windows-ui-assets/main/Sounds/Windows%207/';

const SOUND_FILES = {
  logon: 'Windows%20Logon%20Sound.wav',
  logoff: 'Windows%20Logoff%20Sound.wav',
  startup: 'Windows%20Startup.wav',
  shutdown: 'Windows%20Shutdown.wav',
  error: 'Windows%20Error.wav',
  minimize: 'Windows%20Minimize.wav',
  restore: 'Windows%20Restore.wav',
  notify: 'Windows%20Notify.wav',
  ding: 'Windows%20Ding.wav',
  click: 'Windows%20Menu%20Command.wav',
  critical: 'Windows%20Critical%20Stop.wav',
  default: 'Windows%20Default.wav',
  recycle: 'Windows%20Recycle.wav',
} as const;

export type Win7SoundEvent = keyof typeof SOUND_FILES;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const soundCache: Record<string, any> = {};

export async function playWin7Sound(event: Win7SoundEvent, volume = 0.65): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const file = SOUND_FILES[event];
    if (!file) return;

    if (!soundCache[event]) {
      const { Howl } = await import('howler');
      soundCache[event] = new Howl({
        src: [`${BASE}${file}`],
        volume,
        html5: true,
        // Silent fail — sounds are cosmetic, not critical
        onloaderror: () => {
          delete soundCache[event];
        },
      });
    }

    soundCache[event].play();
  } catch {
    // Silent fail
  }
}
