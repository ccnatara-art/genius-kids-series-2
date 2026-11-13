export function renderResult({ mission, stars, correctCount, totalQuestions, nextMission }) {
  return `
    <section class="page result-page">
      <div class="result-card card pop-in">
        <div class="result-confetti" aria-hidden="true"><span>✦</span><span>✧</span><span>★</span><span>✦</span></div>
        <div class="result-mascot-art"><img src="./assets/images/characters/hero-mascot.svg" alt="Emotion Hero merayakan keberhasilan"></div>
        <span class="pill result-pill">MISI SELESAI</span>
        <h1>Hebat sekali,<br><em>Little Hero!</em></h1>
        <p class="muted">Kamu sudah menyelesaikan <b>${mission.title}</b>.</p>
        <div class="result-stars">${"★".repeat(stars)}<span>${"☆".repeat(3-stars)}</span></div>
        <div class="result-score"><strong>${correctCount} dari ${totalQuestions}</strong><span>jawaban tepat</span></div>
        <p class="result-message">Terima kasih sudah belajar memahami perasaan. Kamu sedang tumbuh menjadi pahlawan kebaikan!</p>
        <div class="result-actions">
          ${nextMission ? `<button class="btn btn-primary btn-block" type="button" data-action="play-mission" data-mission="${nextMission.id}">Misi Berikutnya <span>→</span></button>` : `<button class="btn btn-primary btn-block" type="button" data-action="dashboard">Kembali ke Peta Petualangan</button>`}
          <button class="btn btn-soft btn-block" type="button" data-action="replay-mission" data-mission="${mission.id}">↻ Main Lagi</button>
          <button class="btn btn-ghost btn-block" type="button" data-action="dashboard">Kembali ke Dashboard</button>
        </div>
      </div>
    </section>`;
}
