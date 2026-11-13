const KEY = "emotionHero.settings.v1";
const DEFAULT = { ageMode:null, voice:true, soundEffects:true, music:false };

export function loadSettings() {
  try {
    return { ...DEFAULT, ...(JSON.parse(localStorage.getItem(KEY)) || {}) };
  } catch {
    return { ...DEFAULT };
  }
}
export function saveSettings(settings) {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
