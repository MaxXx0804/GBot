const fs = require('fs');
const path = require('path');
const SCORES_FILE = path.join(__dirname, '../emojiquiz_scores.json');

function loadScores() {
  try {
    if (!fs.existsSync(SCORES_FILE)) return {};
    const data = fs.readFileSync(SCORES_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveScores(scores) {
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2), 'utf8');
}

function recordAnswer(userId, correct) {
  const scores = loadScores();
  if (!scores[userId]) scores[userId] = { correct: 0, wrong: 0 };
  if (correct) scores[userId].correct += 1;
  else scores[userId].wrong += 1;
  saveScores(scores);
}

function getUserScore(userId) {
  const scores = loadScores();
  return scores[userId] || { correct: 0, wrong: 0 };
}

module.exports = { recordAnswer, getUserScore, loadScores };