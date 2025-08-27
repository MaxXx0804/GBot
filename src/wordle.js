const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = process.env.API_BASE; // Change if your API is hosted elsewhere

let todayWord = null;
let todayKey = null;

function getTodayKey() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${now.getUTCMonth()+1}-${now.getUTCDate()}`;
}

async function getDailyWord() {
  const key = getTodayKey();
  if (todayWord && todayKey === key) return todayWord;

  const res = await fetch(`${API_BASE}/words/random`);
  if (!res.ok) throw new Error("Failed to fetch daily word");
  const data = await res.json();
  todayWord = data.word;
  todayKey = key;
  return todayWord;
}

async function checkGuess(guess) {
  const word = await getDailyWord();
  guess = guess.toLowerCase();
  if (guess.length !== 5) return { valid: false, message: "Guess must be 5 letters." };

  const res = await fetch(`${API_BASE}/words/check?word=${word}&guess=${guess}`);
  if (!res.ok) {
    const err = await res.json();
    return { valid: false, message: err.error || "Invalid guess." };
  }
  const data = await res.json();
  if (data.correct) {
    // If guessed correctly, pick a new word for the next round
    todayWord = null;
    todayKey = null;
    return { valid: true, result: data.result, win: true, word: word };
  } else {
    return { valid: true, result: data.result, win: false, word: word };
  }
}

module.exports = { getDailyWord, checkGuess };