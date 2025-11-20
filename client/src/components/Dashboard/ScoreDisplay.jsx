// Score Display Component

import { SCORING_CATEGORIES } from '../../config/constants.js';
import './Dashboard.css';

export function ScoreDisplay({ check1Score, check2Score, combinedScore, scoreCategory }) {
  const getScoreColor = (score) => {
    if (score === null) return '#6b7280';
    const category = Object.values(SCORING_CATEGORIES).find(
      cat => score >= cat.min && score <= cat.max
    );
    return category?.color || SCORING_CATEGORIES.REJECTED.color;
  };

  const formatScore = (score) => {
    if (score === null || score === undefined) return 'N/A';
    return `${Math.round(score * 100) / 100}%`;
  };

  return (
    <div className="score-display">
      <h3>Quality Scores</h3>
      <div className="score-cards">
        {check1Score !== null && (
          <div className="score-card">
            <div className="score-label">Check-1 (QA/QC)</div>
            <div 
              className="score-value"
              style={{ color: getScoreColor(check1Score) }}
            >
              {formatScore(check1Score)}
            </div>
          </div>
        )}
        {check2Score !== null && (
          <div className="score-card">
            <div className="score-label">Check-2 (Technical)</div>
            <div 
              className="score-value"
              style={{ color: getScoreColor(check2Score) }}
            >
              {formatScore(check2Score)}
            </div>
          </div>
        )}
        {combinedScore !== null && (
          <div className="score-card combined">
            <div className="score-label">Overall Score</div>
            <div 
              className="score-value"
              style={{ color: getScoreColor(combinedScore) }}
            >
              {formatScore(combinedScore)}
            </div>
            {scoreCategory && (
              <div 
                className="score-category"
                style={{ color: scoreCategory.color }}
              >
                {scoreCategory.label}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

