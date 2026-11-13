export function renderGameplay({ mission, question, questionIndex, totalQuestions, options, answered, feedback, selectedIndex }) {
  const progress = ((questionIndex + (answered ? 1 : 0)) / totalQuestions) * 100;
  return `
    <section class="page">
      <div class="game-top">
        <button class="icon-btn" type="button" data-action="dashboard" aria-label="Kembali">←</button>
        <div class="game-progress">
          <div style="display:flex;justify-content:space-between;gap:10px;font-size:12px;font-weight:900;margin-bottom:7px"><span>${mission.title}</span><span>${questionIndex + (answered ? 1 : 0)}/${totalQuestions}</span></div>
          <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
        </div>
        <button class="icon-btn" type="button" data-action="repeat-question" aria-label="Ulangi instruksi">🔊</button>
      </div>
      <div class="question-card card">
        <div style="text-align:center"><span class="pill">${mission.emoji} ${mission.title}</span></div>
        <div class="question-scene">
          <div>
            <div class="scene-emoji">${question.sceneEmoji}</div>
            <p class="scene-caption">${question.sceneCaption || mission.description}</p>
          </div>
        </div>
        <h2 class="question-title">${question.prompt}</h2>
        <p class="question-hint">Pilih jawaban yang menurutmu paling sesuai.</p>
        <div class="options-grid">
          ${options.map((option, index) => {
            let stateClass = "";
            if (answered && index === selectedIndex) stateClass = option.correct ? "correct" : "incorrect";
            return `<button class="option-card ${stateClass}" type="button" data-action="answer" data-index="${index}" ${answered ? "disabled" : ""}>
              <span class="option-emoji">${option.emoji}</span><span>${option.label}</span>
            </button>`;
          }).join("")}
        </div>
        ${feedback ? `<div class="feedback ${feedback.good ? "good" : "try"}">${feedback.text}</div>` : ""}
        ${answered ? `<button class="btn btn-primary btn-block" style="margin-top:16px" type="button" data-action="next-question">${questionIndex === totalQuestions - 1 ? "Lihat Hasil" : "Lanjutkan"} →</button>` : ""}
      </div>
    </section>`;
}
