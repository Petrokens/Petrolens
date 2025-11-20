// Scoring helper utilities

import { SCORING_CATEGORIES, RISK_LEVELS, CHECK_STATUS } from '../config/constants.js';

/**
 * Calculate normal score based on check status
 */
export function calculateNormalScore(checkResults) {
  if (!checkResults || checkResults.length === 0) return 0;

  const totalScore = checkResults.reduce((sum, check) => {
    const status = check.status?.toUpperCase() || 'NOT_OK';
    const score = CHECK_STATUS[status]?.score || 0;
    return sum + score;
  }, 0);

  const maxScore = checkResults.length;
  return maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
}

/**
 * Calculate risk-weighted score
 */
export function calculateRiskWeightedScore(checkResults) {
  if (!checkResults || checkResults.length === 0) return 0;

  let weightedScore = 0;
  let totalWeight = 0;

  checkResults.forEach(check => {
    const riskLevel = check.riskLevel?.toUpperCase() || 'LOW';
    const weight = RISK_LEVELS[riskLevel]?.weight || RISK_LEVELS.LOW.weight;
    const status = check.status?.toUpperCase() || 'NOT_OK';
    const statusScore = CHECK_STATUS[status]?.score || 0;

    weightedScore += statusScore * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
}

/**
 * Get score category based on percentage
 */
export function getScoreCategory(score) {
  for (const [key, category] of Object.entries(SCORING_CATEGORIES)) {
    if (score >= category.min && score <= category.max) {
      return { ...category, key };
    }
  }
  return SCORING_CATEGORIES.REJECTED;
}

/**
 * Calculate combined score from Check-1 and Check-2
 */
export function calculateCombinedScore(check1Score, check2Score, weights = { check1: 0.5, check2: 0.5 }) {
  const combined = (check1Score * weights.check1) + (check2Score * weights.check2);
  return Math.round(combined * 100) / 100;
}

/**
 * Parse score from AI response
 */
export function parseScoreFromResponse(response) {
  // Try to extract percentage from response
  const percentageMatch = response.match(/(\d+(?:\.\d+)?)\s*%/i);
  if (percentageMatch) {
    return parseFloat(percentageMatch[1]);
  }

  // Try to extract score from "X/Y" format
  const fractionMatch = response.match(/(\d+)\s*\/\s*(\d+)/);
  if (fractionMatch) {
    const numerator = parseFloat(fractionMatch[1]);
    const denominator = parseFloat(fractionMatch[2]);
    if (denominator > 0) {
      return (numerator / denominator) * 100;
    }
  }

  return null;
}

/**
 * Format score for display
 */
export function formatScore(score) {
  if (score === null || score === undefined) return 'N/A';
  return `${Math.round(score * 100) / 100}%`;
}

