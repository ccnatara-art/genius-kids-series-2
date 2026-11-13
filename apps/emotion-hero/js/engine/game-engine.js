import { shuffle } from "../utils/shuffle.js";

export function prepareQuestion(question, optionCount) {
  const correct = question.options.find((option) => option.correct);
  const wrong = question.options.filter((option) => !option.correct);
  const selectedWrong = shuffle(wrong).slice(0, Math.max(1, optionCount - 1));
  return { ...question, options:shuffle([correct, ...selectedWrong]) };
}
