import { AGE_MODES } from "../data/age-modes.js";

export function renderAgeSelection() {
  return `
    <section class="page age-page">
      <div class="age-welcome panel">
        <div class="age-welcome-copy">
          <span class="hero-kicker age-kicker"><span class="sparkle-dot">✦</span> SELAMAT DATANG, LITTLE HERO!</span>
          <h1>Petualangan dimulai<br><em>dari sini!</em></h1>
          <p>Pilih kelompok usia agar setiap tantangan terasa pas, seru, dan nyaman untukmu.</p>
          <div class="age-welcome-badges"><span>🎨 Ceria</span><span>🌱 Bertahap</span><span>💜 Menyenangkan</span></div>
        </div>
        <div class="age-welcome-art"><img src="./assets/images/characters/hero-mascot.svg" alt="Maskot Emotion Hero menyambut petualangan"></div>
        <span class="age-deco age-deco-one">✦</span><span class="age-deco age-deco-two">✧</span>
      </div>
      <div class="age-choice-heading"><span class="section-kicker">PILIH PETUALANGANMU</span><h2>Kamu berada di kelompok usia mana?</h2><p>Kamu bisa mengubah pilihan ini kapan saja melalui Pengaturan.</p></div>
      <div class="age-grid">
        ${Object.values(AGE_MODES).map((mode, index) => `
          <button class="age-card age-card-${mode.id}" type="button" data-action="select-age" data-age="${mode.id}">
            <span class="age-card-number">0${index+1}</span>
            <span class="age-emoji">${mode.emoji}</span>
            <span class="age-card-copy"><strong>${mode.name}</strong><b>${mode.age}</b><small>${mode.description}</small></span>
            <span class="age-card-arrow">→</span>
          </button>`).join("")}
      </div>
      <p class="age-footer-note">💜 Tidak ada jawaban salah. Kita belajar sedikit demi sedikit!</p>
    </section>`;
}
