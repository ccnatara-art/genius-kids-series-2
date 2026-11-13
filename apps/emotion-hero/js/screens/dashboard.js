import { WORLDS } from "../data/levels.js";
import { MISSIONS } from "../data/missions.js";
import { AGE_MODES } from "../data/age-modes.js";
import { totalStars } from "../storage/progress-store.js";
import { isMissionUnlocked, worldProgress } from "../engine/level-manager.js";

const WORLD_ART = {
  "world-1": "world-1-emotion-garden.svg",
  "world-2": "world-2-feelings-detective.svg",
  "world-3": "world-3-body-signal-forest.svg",
  "world-4": "world-4-calm-island.svg",
  "world-5": "world-5-kindness-kingdom.svg"
};

export function renderDashboard(progress, settings) {
  const age = AGE_MODES[settings.ageMode] || AGE_MODES.explorer;
  const stars = totalStars(progress);
  const completedCount = progress.completedMissions.length;
  const allCount = MISSIONS.length;
  const worldsHTML = WORLDS.map((world) => {
    const status = worldProgress(world, progress);
    const art = WORLD_ART[world.id];
    return `
      <article class="world-card card ${world.color} ${status.unlocked ? "is-unlocked" : "is-locked"}">
        <div class="world-art-wrap">
          <img class="world-art" src="./assets/images/worlds/${art}" alt="Ilustrasi ${world.name}" loading="lazy">
          <span class="world-number">WORLD ${String(world.number).padStart(2,"0")}</span>
          ${!status.unlocked ? '<span class="world-lock" aria-label="Terkunci">🔒</span>' : ''}
        </div>
        <div class="world-content">
          <div class="world-heading">
            <div><h3>${world.name}</h3><p>${world.subtitle}</p></div>
            <div class="world-progress"><strong>${status.completed}/${status.total}</strong><span>misi</span></div>
          </div>
          <div class="world-progress-track"><span style="width:${(status.completed/status.total)*100}%"></span></div>
          <div class="mission-chips">
            ${world.missions.map((id, index) => {
              const mission = MISSIONS.find((item) => item.id === id);
              const unlocked = isMissionUnlocked(id, progress);
              const completed = progress.completedMissions.includes(id);
              const missionStars = progress.starsByMission[id] || 0;
              return `<button class="mission-chip ${completed ? "completed" : unlocked ? "unlocked" : ""}" type="button" data-action="play-mission" data-mission="${id}" ${unlocked ? "" : "disabled"} aria-label="Misi ${index+1}: ${mission.title}">
                <span class="mission-chip-icon">${completed ? "✓" : unlocked ? "▶" : "🔒"}</span><span class="mission-chip-label">${index + 1}. ${mission.title}</span>${completed ? `<span class="mission-chip-stars">${"★".repeat(missionStars)}</span>` : ""}
              </button>`;
            }).join("")}
          </div>
        </div>
      </article>`;
  }).join("");

  return `
    <section class="page dashboard-page">
      <div class="dashboard-greeting">
        <div><span class="eyebrow">GENIUS KIDS SERIES 2</span><h1>Halo, Little Hero! <span>✦</span></h1><p>Setiap perasaan punya cerita. Yuk, kenali bersama!</p></div>
        <span class="age-badge">${age.emoji} ${age.name} · ${age.age}</span>
      </div>
      <div class="welcome-grid">
        <div class="hero-banner">
          <div class="hero-copy">
            <span class="hero-kicker"><span class="sparkle-dot">✦</span> PETUALANGAN EMOSI DIMULAI</span>
            <h2>Jadilah Pahlawan<br><em>Perasaan!</em></h2>
            <p>Kenali perasaanmu, pahami temanmu, dan sebarkan kebaikan di setiap dunia.</p>
            <button class="btn btn-coral hero-cta" type="button" data-action="continue">Mulai Petualangan <span>→</span></button>
            <div class="hero-trust"><span>♥</span> Belajar dengan cara yang menyenangkan</div>
          </div>
          <div class="hero-art-shell"><div class="hero-art-glow"></div><img class="hero-mascot-img" src="./assets/images/characters/hero-mascot.svg" alt="Maskot superhero Emotion Hero"></div>
          <span class="hero-spark hero-spark-one">✦</span><span class="hero-spark hero-spark-two">✧</span>
        </div>
        <aside class="stats-card panel">
          <div class="stats-topline"><span class="stats-icon">🏆</span><span class="stats-label">KOLEKSI BINTANG</span></div>
          <div class="stats-number">${stars}<span> ★</span></div>
          <p class="stats-caption">Bintang hebat yang sudah kamu kumpulkan!</p>
          <div class="stats-divider"></div>
          <div class="stats-row"><strong>Petualangan selesai</strong><strong>${completedCount}<small>/${allCount}</small></strong></div>
          <div class="progress-track" style="margin-top:10px"><div class="progress-fill" style="width:${(completedCount/allCount)*100}%"></div></div>
          <p class="stats-footnote">${completedCount === 0 ? "Ayo mulai misi pertamamu!" : "Terus bertumbuh, Little Hero!"}</p>
        </aside>
      </div>
      <div class="map-section">
        <div class="map-heading">
          <div><span class="section-kicker">🗺️ PETA PETUALANGAN</span><h2>Jelajahi 5 Dunia Emosi</h2><p>Selesaikan misi untuk membuka dunia berikutnya.</p></div>
          <div class="map-counter"><strong>${completedCount}/${allCount}</strong><span>misi selesai</span></div>
        </div>
        <div class="world-list">${worldsHTML}</div>
      </div>
      <div class="dashboard-note"><span>💜</span><p>Ingat, semua perasaan boleh hadir. Kita belajar mengenalinya dan memilih tindakan yang baik.</p></div>
    </section>`;
}
