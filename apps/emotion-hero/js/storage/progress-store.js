const KEY = "emotionHero.progress.v1";
const DEFAULT = { version:1, completedMissions:[], starsByMission:{}, bestScores:{} };

export function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved && saved.version === 1 ? { ...DEFAULT, ...saved } : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function completeMission(progress, missionId, stars, score) {
  const completed = new Set(progress.completedMissions);
  completed.add(missionId);
  progress.completedMissions = [...completed];
  progress.starsByMission[missionId] = Math.max(progress.starsByMission[missionId] || 0, stars);
  progress.bestScores[missionId] = Math.max(progress.bestScores[missionId] || 0, score);
  saveProgress(progress);
  return progress;
}

export function totalStars(progress) {
  return Object.values(progress.starsByMission).reduce((sum, value) => sum + value, 0);
}

export function resetProgress() {
  localStorage.removeItem(KEY);
}
