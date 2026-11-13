let settings = { voice:true, soundEffects:true, music:false };
let currentVoice = null;
let currentMusic = null;

export function configureAudio(nextSettings) {
  settings = { ...settings, ...nextSettings };
  if (!settings.music && currentMusic) {
    currentMusic.pause();
    currentMusic = null;
  }
}

export function speak(text, fileName = "instruction") {
  if (!settings.voice || !text) return;
  const audio = new Audio(`./assets/audio/narration/${fileName}.mp3`);
  audio.play().catch(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.92;
    utterance.pitch = 1.04;
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find((voice) => voice.lang?.toLowerCase().startsWith("id"));
    if (indonesianVoice) utterance.voice = indonesianVoice;
    window.speechSynthesis.speak(utterance);
  });
}

export function stopVoice() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

export function playSfx(type = "tap") {
  if (!settings.soundEffects) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const tones = {
      tap:[440,0.07], correct:[660,0.16], wrong:[220,0.12],
      reward:[880,0.24], complete:[740,0.28]
    };
    const [frequency,duration] = tones[type] || tones.tap;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    if (type === "reward" || type === "complete") {
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.35, now + duration);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
    oscillator.onended = () => ctx.close();
  } catch {
    // Audio is optional; the game remains playable without it.
  }
}

export function setMusic(enabled) {
  if (!enabled) {
    currentMusic?.pause();
    currentMusic = null;
    return;
  }
  if (currentMusic) return;
  currentMusic = new Audio("./assets/audio/music/background.mp3");
  currentMusic.loop = true;
  currentMusic.volume = 0.18;
  currentMusic.play().catch(() => { currentMusic = null; });
}
