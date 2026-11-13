import { WORLDS } from "../data/levels.js";

export function flattenMissionIds() {
  return WORLDS.flatMap((world) => world.missions);
}
export function isMissionUnlocked(missionId, progress) {
  const ids = flattenMissionIds();
  const index = ids.indexOf(missionId);
  if (index < 0) return false;
  if (index === 0) return true;
  return progress.completedMissions.includes(ids[index - 1]);
}
export function worldProgress(world, progress) {
  const completed = world.missions.filter((id) => progress.completedMissions.includes(id)).length;
  const unlocked = world.missions.some((id) => isMissionUnlocked(id, progress));
  return { completed, total:world.missions.length, unlocked, finished:completed === world.missions.length };
}
export function nextMissionId(missionId) {
  const ids = flattenMissionIds();
  const index = ids.indexOf(missionId);
  return index >= 0 && index < ids.length - 1 ? ids[index + 1] : null;
}
