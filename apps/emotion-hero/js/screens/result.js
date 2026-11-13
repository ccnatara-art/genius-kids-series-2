export function renderResult({ mission, stars, correctCount, totalQuestions, nextMission }) {
  return `
    <section class="page">
      <div class="result-card card pop-in">
        <div class="result-mascot">🦸</div>
        <span class="pill">MISI SELESAI</span>
        <h1 style="font-size:34px;margin:14px 0 6px">Hebat sekali!</h1>
        <p class="muted">Kamu sudah menyelesaikan <b>${mission.title}</b>.</p>
        <div class="result-stars">${"⭐".repeat(stars)}${"☆".repeat(3-stars)}</div>
        <h2>${correctCount} dari ${totalQuestions} jawaban tepat</h2>
        <p class="muted">Terima kasih sudah belajar memahami perasaan. Kamu sedang tumbuh menjadi pahlawan kebaikan!</p>
        <div style="display:grid;gap:10px;margin-top:22px">
          ${nextMission ? `<button class="btn btn-primary btn-block" type="button" data-action="play-mission" data-mission="${nextMission.id}">Misi Berikutnya →</button>` : `<button class="btn btn-primary btn-block" type="button" data-action="dashboard">Kembali ke Peta Petualangan</button>`}
          <button class="btn btn-soft btn-block" type="button" data-action="replay-mission" data-mission="${mission.id}">Main Lagi</button>
          <button class="btn btn-ghost btn-block" type="button" data-action="dashboard">Kembali ke Dashboard</button>
        </div>
      </div>
    </section>`;
}
