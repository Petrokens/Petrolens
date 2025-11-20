// Hook for combining and managing scores

import { useState, useMemo } from 'react';
import { calculateCombinedScore, getScoreCategory, formatScore } from '../utils/scoringHelper.js';

export function useScoring(check1Score, check2Score, weights = { check1: 0.5, check2: 0.5 }) {
  const combinedScore = useMemo(() => {
    if (check1Score === null && check2Score === null) return null;
    if (check1Score === null) return check2Score;
    if (check2Score === null) return check1Score;
    return calculateCombinedScore(check1Score, check2Score, weights);
  }, [check1Score, check2Score, weights]);

  const scoreCategory = useMemo(() => {
    if (combinedScore === null) return null;
    return getScoreCategory(combinedScore);
  }, [combinedScore]);

  const formattedScores = useMemo(() => ({
    check1: formatScore(check1Score),
    check2: formatScore(check2Score),
    combined: formatScore(combinedScore)
  }), [check1Score, check2Score, combinedScore]);

  return {
    combinedScore,
    scoreCategory,
    formattedScores
  };
}

