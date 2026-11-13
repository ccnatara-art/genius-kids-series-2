export function calculateStars(correctCount, totalQuestions) {
  if (totalQuestions <= 0) return 1;
  if (correctCount === totalQuestions) return 3;
  if (correctCount >= Math.ceil(totalQuestions * 0.66)) return 2;
  return 1;
}
