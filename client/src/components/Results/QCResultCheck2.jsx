// Check-2 Results Component

import './Results.css';

export function QCResultCheck2({ result, score }) {
  if (!result) return null;

  const getText = () => {
    if (typeof result === 'string') return result;
    return result.response || JSON.stringify(result, null, 2);
  };

  const formatScore = (score) => {
    if (score === null || score === undefined) return 'N/A';
    return `${Math.round(score * 100) / 100}%`;
  };

  return (
    <div className="qc-result-section">
      <h2>Check-2: Technical Review Results</h2>
      {score !== null && (
        <div className="result-score">
          <strong>Score: {formatScore(score)}</strong>
        </div>
      )}
      <div className="result-content">
        <pre className="result-text">
{getText()}
        </pre>
      </div>
    </div>
  );
}

