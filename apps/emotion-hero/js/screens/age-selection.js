import { AGE_MODES } from "../data/age-modes.js";

export function renderAgeSelection() {
  return `
    <section class="page narrow-page">
      <div class="page-heading">
        <div><span class="pill">SELAMAT DATANG, LITTLE HERO!</span><h1>Petualangan dimulai dari sini ✨</h1><p>Pilih kelompok usia agar tantangan terasa pas untukmu.</p></div>
      </div>
      <div class="age-grid">
        ${Object.values(AGE_MODES).map((mode) => `
          <button class="age-card" type="button" data-action="select-age" data-age="${mode.id}">
            <span class="age-emoji">${mode.emoji}</span>
            <span><h3>${mode.name}</h3><p>${mode.age}</p><p>${mode.description}</p></span>
          </button>`).join("")}
      </div>
      <p class="muted small-note">Pilihan ini dapat diubah kapan saja melalui Pengaturan.</p>
    </section>`;
}
