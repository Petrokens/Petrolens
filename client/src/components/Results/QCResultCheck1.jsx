// Check-1 Results Component

import './Results.css';

export function QCResultCheck1({ result, score }) {
  if (!result) return null;

  const getText = () => {
    if (!result) return '';
    if (typeof result === 'string') return result;
    return result.response || JSON.stringify(result, null, 2);
  };

  const formatScore = (score) => {
    if (score === null || score === undefined) return 'N/A';
    return `${Math.round(score * 100) / 100}%`;
  };

  return (
    <div className="qc-result-section">
      <h2>Check-1: QA/QC Review Results</h2>
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

