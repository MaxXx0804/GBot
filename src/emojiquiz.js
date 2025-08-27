let currentQuiz = null;
const API_BASE = process.env.API_BASE; // Change this if your API is hosted elsewhere

async function getRandomQuiz() {
  const res = await fetch(`${API_BASE}/quizzes/random`);
  if (!res.ok) throw new Error("Failed to fetch quiz");
  const quiz = await res.json();
  console.log("Fetched quiz:", quiz); // Add this line
  currentQuiz = quiz;
  return quiz;
}

async function checkAnswer(msgContent) {
  if (!currentQuiz) return false;
  const userAnswer = msgContent.slice(1).trim();
  const params = new URLSearchParams({
    emojis: currentQuiz.emojis,
    guess: userAnswer
  });
  const res = await fetch(`${API_BASE}/quizzes/check?${params.toString()}`);
  if (!res.ok) return false;
  const data = await res.json();
  return data.correct;
}

function clearQuiz() {
  currentQuiz = null;
}

function hasActiveQuiz() {
  return !!currentQuiz;
}

function getCurrentQuiz() {
  return currentQuiz;
}

module.exports = {
  getRandomQuiz,
  checkAnswer,
  clearQuiz,
  hasActiveQuiz,
  getCurrentQuiz
};