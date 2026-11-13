import { AGE_MODES } from "./data/age-modes.js";
import { WORLDS } from "./data/levels.js";
import { MISSIONS } from "./data/missions.js";
import { renderAgeSelection } from "./screens/age-selection.js";
import { renderDashboard } from "./screens/dashboard.js";
import { renderGameplay } from "./screens/gameplay.js";
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
  result: null
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

function getWorldForMission(id) {
  return WORLDS.find((world) => world.missions.includes(id));
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
  state.questions = mission.questions.map((question) => prepareQuestion(question, AGE_MODES[state.settings.ageMode].optionCount));
  state.questionIndex = 0;
  state.correctCount = 0;
  state.answered = false;
  state.selectedIndex = null;
  state.feedback = null;
  render("game");
  speakCurrentQuestion();
}

function currentQuestion() {
  return state.questions[state.questionIndex];
}

function speakCurrentQuestion() {
  const question = currentQuestion();
  if (question) speak(question.narration || question.prompt, "instruction");
}

function renderCurrentQuestion() {
  const question = currentQuestion();
  if (!question || !state.activeMission) {
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
    const next = MISSIONS.find((mission) => isMissionUnlocked(mission.id, state.progress) && !state.progress.completedMissions.includes(mission.id)) || MISSIONS[0];
    if (next) startMission(next.id);
  }
  if (action === "answer") answerQuestion(Number(button.dataset.index));
  if (action === "next-question") nextQuestion();
  if (action === "repeat-question") speakCurrentQuestion();
  if (action === "replay-mission") startMission(button.dataset.mission);
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
