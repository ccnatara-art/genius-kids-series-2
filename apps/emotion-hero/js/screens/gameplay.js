const GAME_MODES = {
  "m1": {
    className: "emotion-match",
    title: "Emotion Match",
    subtitle: "Cocokkan ekspresi dengan perasaan"
  },
  "m2": {
    className: "story-detective",
    title: "Detektif Perasaan",
    subtitle: "Cari petunjuk dari cerita"
  },
  "m3": {
    className: "body-signals",
    title: "Petunjuk Tubuh",
    subtitle: "Kenali kemungkinan sinyal tubuh"
  },
  "m4": {
    className: "calm-choice",
    title: "Calm Island",
    subtitle: "Pilih langkah yang nyaman dan aman"
  },
  "m5": {
    className: "kindness-story",
    title: "Cerita Kebaikan",
    subtitle: "Pikirkan perasaan dan kebutuhan teman"
  }
};

const FACE_BY_LABEL = [
  [/senang|bahagia|gembira|bangga/i, "😊"],
  [/sedih|kecewa/i, "😢"],
  [/marah|kesal/i, "😠"],
  [/takut/i, "😨"],
  [/terkejut|kagum/i, "😮"],
  [/tenang/i, "😌"],
  [/gugup/i, "😬"],
  [/khawatir/i, "😟"]
];

function modeForMission(missionId) {
  return GAME_MODES[missionId.slice(0, 2)] || GAME_MODES.m2;
}

function optionVisual(option, mode) {
  if (mode.className === "emotion-match") {
    const match = FACE_BY_LABEL.find(([pattern]) => pattern.test(option.label));
    if (match) return match[1];
  }
  return option.emoji || "⭐";
}

function renderScene(mode, question, mission) {
  if (mode.className === "story-detective") {
    return `
      <div class="activity-stage detective-stage">
        <div class="stage-topline"><span>🔎 PAPAN PETUNJUK</span><span class="stage-stamp">CASE FILE</span></div>
        <div class="stage-main-emoji">${question.sceneEmoji || "🕵️"}</div>
        <p>${question.sceneCaption || mission.description}</p>
        <div class="detective-note">🗒️ Perhatikan kejadian, lalu pikirkan apa yang mungkin dirasakan tokoh.</div>
      </div>`;
  }

  if (mode.className === "body-signals") {
    return `
      <div class="activity-stage body-stage">
        <div class="stage-topline"><span>🌿 PETA SINYAL TUBUH</span><span class="stage-stamp">NOTICE</span></div>
        <div class="body-map-row">
          <div class="body-character" aria-hidden="true">🧍</div>
          <div class="body-cues">
            <div class="body-cue"><span>💓</span><div><strong>Jantung</strong><small>Detak bisa terasa berubah</small></div></div>
            <div class="body-cue"><span>🖐️</span><div><strong>Tangan</strong><small>Bisa terasa dingin atau berkeringat</small></div></div>
            <div class="body-cue"><span>💪</span><div><strong>Otot</strong><small>Bisa terasa tegang atau rileks</small></div></div>
          </div>
        </div>
        <p class="body-caption">${question.sceneCaption || "Tubuh dapat memberi petunjuk tentang apa yang sedang kita rasakan."}</p>
      </div>`;
  }

  if (mode.className === "calm-choice") {
    return `
      <div class="activity-stage calm-stage">
        <div class="stage-topline"><span>🏝️ PULAU TENANG</span><span class="stage-stamp">TAKE A PAUSE</span></div>
        <div class="stage-main-emoji">${question.sceneEmoji || "🌿"}</div>
        <p>${question.sceneCaption || mission.description}</p>
        <div class="calm-reminder">🌬️ Tidak perlu terburu-buru. Pilih langkah yang terasa nyaman dan aman.</div>
      </div>`;
  }

  if (mode.className === "kindness-story") {
    return `
      <div class="activity-stage kindness-stage">
        <div class="stage-topline"><span>💗 CERITA KEBAIKAN</span><span class="stage-stamp">YOUR CHOICE</span></div>
        <div class="stage-main-emoji">${question.sceneEmoji || "🤝"}</div>
        <p>${question.sceneCaption || mission.description}</p>
        <div class="kindness-reminder">💬 Bayangkan kamu berada di situasi ini. Respons seperti apa yang penuh perhatian?</div>
      </div>`;
  }

  return `
    <div class="activity-stage emotion-stage">
      <div class="stage-topline"><span>🌷 TAMAN EMOSI</span><span class="stage-stamp">MATCH IT</span></div>
      <div class="stage-main-emoji">${question.sceneEmoji || "😊"}</div>
      <p>${question.sceneCaption || mission.description}</p>
    </div>`;
}

function renderOptions(options, mode, answered, selectedIndex) {
  return options.map((option, index) => {
    let stateClass = "";
    if (answered && index === selectedIndex) {
      stateClass = option.correct ? "correct" : "incorrect";
    }
    const visual = optionVisual(option, mode);
    const dragAttrs = mode.className === "emotion-match" && !answered
      ? `draggable="true" data-drag-option="${index}"`
      : "";
    return `
      <button class="option-card gameplay-option ${stateClass}" type="button"
        data-action="answer" data-index="${index}" ${dragAttrs}
        ${answered ? "disabled" : ""} aria-pressed="${answered && index === selectedIndex}">
        <span class="option-emoji">${visual}</span>
        <span class="option-label">${option.label}</span>
        ${mode.className === "emotion-match" && !answered ? `<span class="drag-hint">↕</span>` : ""}
      </button>`;
  }).join("");
}

export function renderBreathingActivity({ phaseIndex = -1 } = {}) {
  const phases = [
    { title: "Tarik napas perlahan", note: "Biarkan udara masuk dengan nyaman. Tidak perlu menahan napas.", icon: "🌬️", className: "inhale" },
    { title: "Hembuskan perlahan", note: "Keluarkan napas dengan lembut, sesuai kenyamananmu.", icon: "🍃", className: "exhale" },
    { title: "Tarik napas dengan nyaman", note: "Perhatikan napasmu tanpa perlu terburu-buru.", icon: "🌼", className: "inhale" },
    { title: "Hembuskan perlahan", note: "Lepaskan napas dan rilekskan bahu jika terasa nyaman.", icon: "🍃", className: "exhale" }
  ];

  if (phaseIndex < 0) {
    return `
      <section class="page breathing-page">
        <div class="breathing-card card">
          <span class="pill">🏝️ CALM ISLAND · LATIHAN INTERAKTIF</span>
          <div class="breath-illustration">🌬️</div>
          <h1>Yuk, ambil jeda sejenak</h1>
          <p>Kita akan mencoba menarik dan mengembuskan napas dengan lembut. Ikuti dengan nyaman, tanpa menahan napas.</p>
          <div class="breathing-safety">Jika terasa tidak nyaman, berhenti dan bernapas seperti biasa. Kamu juga boleh melewati latihan ini.</div>
          <div class="breathing-actions">
            <button class="btn btn-primary btn-block" type="button" data-action="start-breathing">Mulai latihan →</button>
            <button class="btn btn-ghost btn-block" type="button" data-action="skip-breathing">Lewati latihan</button>
          </div>
        </div>
      </section>`;
  }

  const phase = phases[Math.min(phaseIndex, phases.length - 1)];
  const isLast = phaseIndex >= phases.length - 1;
  return `
    <section class="page breathing-page">
      <div class="breathing-card card">
        <span class="pill">🏝️ CALM ISLAND · LATIHAN ${phaseIndex + 1}/4</span>
        <div class="breath-orb ${phase.className}" aria-hidden="true"><span>${phase.icon}</span></div>
        <h1>${phase.title}</h1>
        <p>${phase.note}</p>
        <div class="breathing-dots" aria-label="Tahap latihan">
          ${phases.map((_, index) => `<span class="${index <= phaseIndex ? "active" : ""}"></span>`).join("")}
        </div>
        <div class="breathing-safety">Lakukan dengan nyaman. Tidak perlu menarik napas terlalu dalam atau menahannya.</div>
        <div class="breathing-actions">
          <button class="btn btn-primary btn-block" type="button" data-action="breathing-next">${isLast ? "Selesai latihan ✓" : "Lanjutkan →"}</button>
          <button class="btn btn-ghost btn-block" type="button" data-action="skip-breathing">Lewati latihan</button>
        </div>
      </div>
    </section>`;
}

export function renderGameplay({
  mission,
  question,
  questionIndex,
  totalQuestions,
  options,
  answered,
  feedback,
  selectedIndex
}) {
  const mode = modeForMission(mission.id);
  const progress = ((questionIndex + (answered ? 1 : 0)) / totalQuestions) * 100;
  const isMatch = mode.className === "emotion-match";

  return `
    <section class="page gameplay-upgrade-page mode-${mode.className}">
      <div class="game-top">
        <button class="icon-btn" type="button" data-action="dashboard" aria-label="Kembali ke peta">←</button>
        <div class="game-progress">
          <div class="game-progress-labels"><span>${mission.title}</span><span>${questionIndex + (answered ? 1 : 0)}/${totalQuestions}</span></div>
          <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
        </div>
        <button class="icon-btn" type="button" data-action="repeat-question" aria-label="Ulangi instruksi">🔊</button>
      </div>

      <div class="gameplay-heading">
        <span class="pill">${mode.title}</span>
        <p>${mode.subtitle}</p>
      </div>

      <div class="question-card gameplay-card card">
        ${renderScene(mode, question, mission)}
        <h2 class="question-title">${question.prompt}</h2>
        <p class="question-hint">${isMatch ? "Ketuk kartu, atau tarik kartu perasaan ke kotak jawaban." : "Pilih jawaban yang menurutmu paling sesuai."}</p>

        ${isMatch ? `
          <div class="emotion-drop-zone ${answered ? "answered" : ""}" data-dropzone="emotion-answer" role="region" aria-label="Kotak jawaban">
            <span class="drop-zone-icon">${answered ? (options[selectedIndex]?.correct ? "✨" : "💡") : "👇"}</span>
            <span>${answered ? `Pilihanmu: ${options[selectedIndex]?.label || ""}` : "Letakkan kartu perasaan di sini"}</span>
          </div>` : ""}

        <div class="options-grid gameplay-options ${isMatch ? "match-options" : ""}">
          ${renderOptions(options, mode, answered, selectedIndex)}
        </div>

        ${feedback ? `<div class="feedback ${feedback.good ? "good" : "try"}">${feedback.text}</div>` : ""}
        ${answered ? `<button class="btn btn-primary btn-block gameplay-next" style="margin-top:16px" type="button" data-action="next-question">${questionIndex === totalQuestions - 1 ? "Lihat Hasil" : "Lanjutkan"} →</button>` : ""}
      </div>
      <p class="gameplay-encouragement">⭐ Setiap perasaan boleh dikenali. Kita belajar sedikit demi sedikit.</p>
    </section>`;
}
