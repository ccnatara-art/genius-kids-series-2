import { WORLDS } from "../data/levels.js";
import { MISSIONS } from "../data/missions.js";
import { AGE_MODES } from "../data/age-modes.js";
import { totalStars } from "../storage/progress-store.js";
import { isMissionUnlocked, worldProgress } from "../engine/level-manager.js";

export function renderDashboard(progress, settings) {
  const age = AGE_MODES[settings.ageMode] || AGE_MODES.explorer;
  const stars = totalStars(progress);
  const completedCount = progress.completedMissions.length;
  const allCount = MISSIONS.length;
  const worldsHTML = WORLDS.map((world) => {
    const status = worldProgress(world, progress);
    return `
      <article class="world-card card ${world.color} ${status.unlocked ? "" : "locked"}">
        <div class="world-icon">${world.icon}</div>
        <div>
          <h3>${world.number}. ${world.name}</h3>
          <p>${world.subtitle}</p>
        </div>
        <div class="world-meta">
          <strong>${status.completed}/${status.total}</strong>
          <p>${status.finished ? "Selesai ✓" : status.unlocked ? "Terbuka" : "Terkunci 🔒"}</p>
        </div>
        <div class="mission-chips">
          ${world.missions.map((id, index) => {
            const mission = MISSIONS.find((item) => item.id === id);
            const unlocked = isMissionUnlocked(id, progress);
            const completed = progress.completedMissions.includes(id);
            const missionStars = progress.starsByMission[id] || 0;
            return `<button class="mission-chip ${completed ? "completed" : unlocked ? "unlocked" : ""}" type="button" data-action="play-mission" data-mission="${id}" ${unlocked ? "" : "disabled"}>
              <span>${completed ? "✓" : unlocked ? "▶" : "🔒"}</span>${index + 1}. ${mission.title}${completed ? ` · ${"⭐".repeat(missionStars)}` : ""}
            </button>`;
          }).join("")}
        </div>
      </article>`;
  }).join("");

  return `
    <section class="page">
      <div class="welcome-grid">
        <div class="hero-banner">
          <div class="hero-copy">
            <span class="pill" style="background:#FFFFFF25;color:#fff">GENIUS KIDS SERIES 2</span>
            <h1>Hi, Little Hero!<br>Siap berpetualang?</h1>
            <p>Kenali perasaanmu, pahami temanmu, dan sebarkan kebaikan.</p>
            <button class="btn btn-coral" type="button" data-action="continue">Ayo Bermain <span>→</span></button>
          </div>
          <div class="hero-mascot" aria-hidden="true">🦸</div>
        </div>
        <aside class="stats-card panel">
          <div>
            <span class="pill">${age.emoji} ${age.name} · ${age.age}</span>
            <p class="muted" style="margin:16px 0 4px">Total bintangmu</p>
            <div class="stats-number">⭐ ${stars}</div>
          </div>
          <div>
            <div class="stats-row"><strong>Petualangan selesai</strong><strong>${completedCount}/${allCount}</strong></div>
            <div class="progress-track" style="margin-top:10px"><div class="progress-fill" style="width:${(completedCount/allCount)*100}%"></div></div>
            <p class="muted" style="font-size:12px;margin:10px 0 0">Satu langkah kecil, satu pengalaman baru!</p>
          </div>
        </aside>
      </div>
      <div class="map-section">
        <div class="page-heading">
          <div><span class="pill">🗺️ PETA PETUALANGAN</span><h1 style="font-size:28px;margin-top:10px">Jelajahi 5 Dunia Emosi</h1><p>Selesaikan misi untuk membuka petualangan berikutnya.</p></div>
        </div>
        <div class="world-list">${worldsHTML}</div>
      </div>
    </section>`;
}
