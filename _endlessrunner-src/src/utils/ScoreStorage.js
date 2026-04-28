const HIGH_SCORE_KEY = 'endless-runner-high-score';

export function readHighScore() {
  try {
    const value = Number(window.localStorage.getItem(HIGH_SCORE_KEY));
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  } catch {
    return 0;
  }
}

export function writeHighScore(score) {
  const safeScore = Math.max(0, Math.floor(Number(score) || 0));
  try { window.localStorage.setItem(HIGH_SCORE_KEY, String(safeScore)); } catch {}
  return safeScore;
}

export function resetStoredScores() {
  try { window.localStorage.removeItem(HIGH_SCORE_KEY); } catch {}
}
