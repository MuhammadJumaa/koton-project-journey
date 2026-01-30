// Sound effects utility using Web Audio API
// Generates sounds programmatically - no external files needed

type SoundType = 'click' | 'success' | 'match' | 'catch' | 'miss';

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const createOscillator = (
  ctx: AudioContext,
  frequency: number,
  type: OscillatorType,
  duration: number,
  volume: number = 0.3
): void => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

const playClick = (ctx: AudioContext): void => {
  createOscillator(ctx, 800, 'sine', 0.1, 0.2);
};

const playSuccess = (ctx: AudioContext): void => {
  // Victory jingle - ascending notes
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => {
      createOscillator(ctx, freq, 'sine', 0.15, 0.25);
    }, i * 100);
  });
};

const playMatch = (ctx: AudioContext): void => {
  // Ding sound - high pitched
  createOscillator(ctx, 880, 'sine', 0.2, 0.3);
  setTimeout(() => {
    createOscillator(ctx, 1100, 'sine', 0.15, 0.2);
  }, 50);
};

const playCatch = (ctx: AudioContext): void => {
  // Coin/catch sound - quick ascending
  createOscillator(ctx, 600, 'square', 0.08, 0.15);
  setTimeout(() => {
    createOscillator(ctx, 900, 'square', 0.08, 0.15);
  }, 50);
};

const playMiss = (ctx: AudioContext): void => {
  // Buzz/error sound - descending
  createOscillator(ctx, 200, 'sawtooth', 0.2, 0.2);
  createOscillator(ctx, 150, 'sawtooth', 0.25, 0.15);
};

export const playSound = (type: SoundType): void => {
  try {
    const ctx = getAudioContext();

    // Resume audio context if suspended (required for user interaction)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    switch (type) {
      case 'click':
        playClick(ctx);
        break;
      case 'success':
        playSuccess(ctx);
        break;
      case 'match':
        playMatch(ctx);
        break;
      case 'catch':
        playCatch(ctx);
        break;
      case 'miss':
        playMiss(ctx);
        break;
    }
  } catch (error) {
    // Silently fail if audio is not supported
    console.warn('Audio not supported:', error);
  }
};

// Sound settings
let soundEnabled = true;

export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
};

export const isSoundEnabled = (): boolean => soundEnabled;

// Wrapped playSound that respects settings
export const playSoundIfEnabled = (type: SoundType): void => {
  if (soundEnabled) {
    playSound(type);
  }
};
