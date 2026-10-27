import {
  INITIAL_SCOREBOARD,
  SESSION_STORAGE_SCOREBOARD_KEY,
} from '../constants/gameConstants';
import type { ScoreboardState } from '../types/game';

/**
 * Loads the current scoreboard tally from browser sessionStorage.
 * Defensively falls back to INITIAL_SCOREBOARD if storage is empty, corrupted, or unavailable.
 */
export function loadScoreboard(): ScoreboardState {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return { ...INITIAL_SCOREBOARD };
  }

  try {
    const rawData = window.sessionStorage.getItem(
      SESSION_STORAGE_SCOREBOARD_KEY
    );
    if (!rawData) {
      return { ...INITIAL_SCOREBOARD };
    }

    const parsed = JSON.parse(rawData);
    if (
      typeof parsed?.xWins === 'number' &&
      typeof parsed?.oWins === 'number' &&
      typeof parsed?.draws === 'number'
    ) {
      return {
        xWins: Math.max(0, parsed.xWins),
        oWins: Math.max(0, parsed.oWins),
        draws: Math.max(0, parsed.draws),
      };
    }
  } catch (err) {
    console.warn('Failed to parse scoreboard from sessionStorage:', err);
  }

  return { ...INITIAL_SCOREBOARD };
}

/**
 * Persists the given scoreboard tally into browser sessionStorage.
 */
export function saveScoreboard(scoreboard: ScoreboardState): void {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      SESSION_STORAGE_SCOREBOARD_KEY,
      JSON.stringify(scoreboard)
    );
  } catch (err) {
    console.warn('Failed to write scoreboard to sessionStorage:', err);
  }
}

/**
 * Clears the scoreboard from sessionStorage and resets to 0.
 */
export function clearScoreboardStorage(): void {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return;
  }

  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_SCOREBOARD_KEY);
  } catch (err) {
    console.warn('Failed to clear scoreboard from sessionStorage:', err);
  }
}
