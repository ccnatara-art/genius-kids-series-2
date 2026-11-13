import { AGE_MODES } from "./data/age-modes.js";
import { WORLDS } from "./data/levels.js";
import { MISSIONS } from "./data/missions.js";
import { renderAgeSelection } from "./screens/age-selection.js";
import { renderDashboard } from "./screens/dashboard.js";
import { renderGameplay, renderBreathingActivity } from "./screens/gameplay.js";
import { renderResult } from "./screens/result.js";
import { renderSettings } from "./screens/settings.js";
import { loadProgress, saveProgress, completeMission, totalStars, resetProgress } from "./storage/progress-store.js";
import { loadSettings, saveSettings } from "./storage/settings-store.js";
import { isMissionUnlocked, nextMissionId } from "./engine/level-manager.js";
import { prepareQuestion } from "./engine/game-engine.js";
import { calculateStars } from "./engine/scoring.js";
import { configureAudio, speak, playSfx, setMusic, stopVoice } from "./components/audio-manager.js";
import { showToast } from "./components/toast.js";

const root = document.querySelector("#app");
const topStars = document.querySelector("#top-stars");

const state = {
  route: "age",
  progress: loadProgress(),
  settings: loadSettings(),
  activeMission: null,
  questions: [],
  questionIndex: 0,
  correctCount: 0,
  answered: false,
  selectedIndex: null,
  feedback: null,
  result: null,
  breathingPhase: -1,
  breathingCompleted: false
};

configureAudio(state.settings);

function refreshHeader() {
  topStars.textContent = String(totalStars(state.progress));
}

function render(route = state.route) {
  state.route = route;
  refreshHeader();

  if (!state.settings.ageMode && route !== "age") {
    state.route = "age";
    root.innerHTML = renderAgeSelection();
    return;
  }

  if (route === "age") root.innerHTML = renderAgeSelection();
  if (route === "home") root.innerHTML = renderDashboard(state.progress, state.settings);
  if (route === "settings") root.innerHTML = renderSettings(state.settings);
  if (route === "game") renderCurrentQuestion();
  if (route === "result" && state.result) root.innerHTML = renderResult(state.result);

  root.focus({ preventScroll:true });
}

function getMission(id) {
  return MISSIONS.find((mission) => mission.id === id);
}

function startMission(id) {
  if (!isMissionUnlocked(id, state.progress)) {
    showToast("Selesaikan misi sebelumnya terlebih dahulu.");
    return;
  }
  const mission = getMission(id);
  if (!mission) return;

  stopVoice();
  state.activeMission = mission;
  state.questions = mission.questions.map((question) =>
    prepareQuestion(question, AGE_MODES[state.settings.ageMode].optionCount)
  );
  state.questionIndex = 0;
  state.correctCount = 0;
  state.answered = false;
  state.selectedIndex = null;
  state.feedback = null;
  state.breathingPhase = -1;
  state.breathingCompleted = mission.id !== "m4-1";

  render("game");
  if (state.breathingCompleted) {
    speakCurrentQuestion();
  } else {
    speak("Selamat datang di Calm Island. Kita akan mencoba latihan napas yang lembut. Kamu boleh melewatinya.", "instruction");
  }
}

function currentQuestion() {
  return state.questions[state.questionIndex];
}

function speakCurrentQuestion() {
  const question = currentQuestion();
  if (question) speak(question.narration || question.prompt, "instruction");
}

function renderCurrentQuestion() {
  if (!state.activeMission) {
    render("home");
    return;
  }

  if (state.activeMission.id === "m4-1" && !state.breathingCompleted) {
    root.innerHTML = renderBreathingActivity({ phaseIndex: state.breathingPhase });
    return;
  }

  const question = currentQuestion();
  if (!question) {
    render("home");
    return;
  }

  root.innerHTML = renderGameplay({
    mission: state.activeMission,
    question,
    questionIndex: state.questionIndex,
    totalQuestions: state.questions.length,
    options: question.options,
    answered: state.answered,
    feedback: state.feedback,
    selectedIndex: state.selectedIndex
  });
}

function answerQuestion(index) {
  if (state.answered) return;
  const question = currentQuestion();
  const option = question?.options[index];
  if (!option) return;

  state.answered = true;
  state.selectedIndex = index;
  const isCorrect = Boolean(option.correct);

  if (isCorrect) {
    state.correctCount += 1;
    playSfx("correct");
    state.feedback = { good:true, text:"Hebat! " + option.feedback };
  } else {
    playSfx("wrong");
    state.feedback = { good:false, text:"Tidak apa-apa. " + option.feedback };
  }

  renderCurrentQuestion();
  if (isCorrect) speak("Hebat! Jawabanmu tepat.", "correct");
  else speak("Tidak apa-apa. Kita belajar bersama.", "try-again");
}

function nextQuestion() {
  if (!state.answered) return;
  if (state.questionIndex < state.questions.length - 1) {
    state.questionIndex += 1;
    state.answered = false;
    state.selectedIndex = null;
    state.feedback = null;
    render("game");
    speakCurrentQuestion();
  } else {
    finishMission();
  }
}

function finishMission() {
  const mission = state.activeMission;
  const stars = calculateStars(state.correctCount, state.questions.length);
  state.progress = completeMission(state.progress, mission.id, stars, state.correctCount);
  saveProgress(state.progress);
  playSfx("complete");

  const nextId = nextMissionId(mission.id);
  const nextMission = nextId && isMissionUnlocked(nextId, state.progress) ? getMission(nextId) : null;
  state.result = {
    mission,
    stars,
    correctCount: state.correctCount,
    totalQuestions: state.questions.length,
    nextMission
  };

  render("result");
  speak("Misi selesai. Hebat sekali, Little Hero!", "level-complete");
}

function beginBreathing() {
  state.breathingPhase = 0;
  renderCurrentQuestion();
  speak("Tarik napas perlahan dengan nyaman. Tidak perlu menahannya.", "instruction");
}

function nextBreathingPhase() {
  if (state.breathingPhase < 3) {
    state.breathingPhase += 1;
    renderCurrentQuestion();
    const prompts = [
      "Tarik napas perlahan.",
      "Hembuskan napas dengan lembut.",
      "Tarik napas dengan nyaman.",
      "Hembuskan napas perlahan. Latihan selesai."
    ];
    speak(prompts[state.breathingPhase], "instruction");
    return;
  }

  state.breathingCompleted = true;
  renderCurrentQuestion();
  speakCurrentQuestion();
}

function skipBreathing() {
  state.breathingCompleted = true;
  renderCurrentQuestion();
  speakCurrentQuestion();
}

function resetGameProgress() {
  const confirmed = window.confirm("Yakin ingin menghapus seluruh progres permainan di perangkat ini?");
  if (!confirmed) return;
  resetProgress();
  state.progress = loadProgress();
  showToast("Progres permainan sudah direset.");
  render("home");
}

document.body.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.tagName === "A") event.preventDefault();
  const action = button.dataset.action;

  if (action === "select-age") {
    state.settings.ageMode = button.dataset.age;
    saveSettings(state.settings);
    configureAudio(state.settings);
    playSfx("tap");
    render("home");
    speak("Selamat datang, Little Hero! Ayo mulai petualangan.", "welcome");
  }
  if (action === "home" || action === "dashboard") {
    stopVoice();
    render("home");
  }
  if (action === "settings") {
    stopVoice();
    render("settings");
  }
  if (action === "change-age") render("age");
  if (action === "play-mission" || action === "replay-mission") startMission(button.dataset.mission);
  if (action === "continue") {
    const next = MISSIONS.find((mission) =>
      isMissionUnlocked(mission.id, state.progress) &&
      !state.progress.completedMissions.includes(mission.id)
    ) || MISSIONS[0];
    if (next) startMission(next.id);
  }
  if (action === "answer") answerQuestion(Number(button.dataset.index));
  if (action === "next-question") nextQuestion();
  if (action === "repeat-question") {
    if (state.activeMission?.id === "m4-1" && !state.breathingCompleted) {
      speak("Ikuti latihan dengan nyaman, atau pilih lewati latihan.", "instruction");
    } else {
      speakCurrentQuestion();
    }
  }
  if (action === "start-breathing") beginBreathing();
  if (action === "breathing-next") nextBreathingPhase();
  if (action === "skip-breathing") skipBreathing();
  if (action === "toggle-setting") {
    const key = button.dataset.setting;
    state.settings[key] = !state.settings[key];
    saveSettings(state.settings);
    configureAudio(state.settings);
    if (key === "music") setMusic(state.settings.music);
    playSfx("tap");
    render("settings");
  }
  if (action === "reset-progress") resetGameProgress();
});

/* Drag-and-drop for Emotion Match. Tapping a card remains available for touch screens. */
root.addEventListener("dragstart", (event) => {
  const option = event.target.closest("[data-drag-option]");
  if (!option || state.answered || !event.dataTransfer) return;
  event.dataTransfer.setData("text/plain", option.dataset.dragOption);
  event.dataTransfer.effectAllowed = "move";
});

root.addEventListener("dragover", (event) => {
  if (event.target.closest("[data-dropzone]")) {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  }
});

root.addEventListener("drop", (event) => {
  const zone = event.target.closest("[data-dropzone]");
  if (!zone || state.answered) return;
  event.preventDefault();
  const index = Number(event.dataTransfer?.getData("text/plain"));
  if (Number.isInteger(index)) answerQuestion(index);
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  window.deferredInstallPrompt = event;
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service Worker gagal didaftarkan:", error);
    });
  });
}

if (!state.settings.ageMode) render("age");
else render("home");
