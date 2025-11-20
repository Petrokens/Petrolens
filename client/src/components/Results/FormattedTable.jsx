// Formatted Table Component for displaying QC results

import { parseCheck1Response, parseCheck2Response } from '../../utils/responseParser.js';
import './FormattedTable.css';

export function FormattedCheck1Table({ result }) {
  if (!result) return null;

  const parsed = parseCheck1Response(result);
  if (!parsed || !parsed.rows || parsed.rows.length === 0) {
    // Fallback to raw text if parsing fails
    return (
      <div className="formatted-table-container">
        <pre className="raw-text-fallback">{typeof result === 'string' ? result : result.response || JSON.stringify(result)}</pre>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    const upper = status?.toUpperCase() || '';
    if (upper.includes('OK') || upper.includes('PASS')) return '✅';
    if (upper.includes('PARTIAL') || upper.includes('WARNING')) return '⚠️';
    return '❌';
  };

  const getStatusClass = (status) => {
    const upper = status?.toUpperCase() || '';
    if (upper.includes('OK') || upper.includes('PASS')) return 'status-ok';
    if (upper.includes('PARTIAL') || upper.includes('WARNING')) return 'status-partial';
    return 'status-not-ok';
  };

  const getSourceIcon = (source) => {
    if (!source) return '❓';
    const upper = source.toUpperCase();
    if (upper.includes('INPUT') || upper.includes('DOCUMENT')) return '📎';
    if (upper.includes('PRACTICE') || upper.includes('GEP')) return '💊';
    if (upper.includes('LOGIC') || upper.includes('ENGINEERING')) return '🔧';
    return '❓';
  };

  return (
    <div className="formatted-table-container">
      <table className="qc-results-table">
        <thead>
          <tr>
            <th className="col-checkpoint">Check Point</th>
            <th className="col-status">Status</th>
            <th className="col-remarks">Remarks</th>
            <th className="col-score">Score</th>
            <th className="col-source">Source Basis</th>
          </tr>
        </thead>
        <tbody>
          {parsed.rows.map((row, index) => (
            <tr key={index}>
              <td className="col-checkpoint">{row.checkPoint || `Check ${index + 1}`}</td>
              <td className={`col-status ${getStatusClass(row.status)}`}>
                <span className="status-icon">{getStatusIcon(row.status)}</span>
                <span className="status-text">{row.status || 'Not OK'}</span>
              </td>
              <td className="col-remarks">{row.remarks || '-'}</td>
              <td className="col-score">{row.score !== undefined ? row.score : 0}</td>
              <td className="col-source">
                <span className="source-icon">{getSourceIcon(row.sourceBasis)}</span>
                <span className="source-text">{row.sourceBasis || 'Not Available'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {parsed.summary && (
        <div className="table-summary">
          <h4>Summary</h4>
          <p>{parsed.summary}</p>
        </div>
      )}
    </div>
  );
}

export function FormattedCheck2Table({ result }) {
  if (!result) return null;

  const parsed = parseCheck2Response(result);
  if (!parsed || !parsed.rows || parsed.rows.length === 0) {
    // Fallback to raw text if parsing fails
    return (
      <div className="formatted-table-container">
        <pre className="raw-text-fallback">{typeof result === 'string' ? result : result.response || JSON.stringify(result)}</pre>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    const upper = status?.toUpperCase() || '';
    if (upper.includes('OK') || upper.includes('PASS')) return '✅';
    if (upper.includes('PARTIAL') || upper.includes('WARNING')) return '⚠️';
    return '❌';
  };

  const getStatusClass = (status) => {
    const upper = status?.toUpperCase() || '';
    if (upper.includes('OK') || upper.includes('PASS')) return 'status-ok';
    if (upper.includes('PARTIAL') || upper.includes('WARNING')) return 'status-partial';
    return 'status-not-ok';
  };

  return (
    <div className="formatted-table-container">
      <div className="table-header-info">
        <p><strong>Total Questions Raised:</strong> {parsed.totalQuestions || parsed.rows.length}</p>
      </div>
      <table className="qc-results-table">
        <thead>
          <tr>
            <th className="col-question-no">Question No</th>
            <th className="col-question">QA/QC Question</th>
            <th className="col-status">Status</th>
            <th className="col-source">Source</th>
            <th className="col-notes">Reviewer Notes</th>
          </tr>
        </thead>
        <tbody>
          {parsed.rows.map((row) => (
            <tr key={row.questionNo}>
              <td className="col-question-no">{row.questionNo}</td>
              <td className="col-question">{row.question || '-'}</td>
              <td className={`col-status ${getStatusClass(row.status)}`}>
                <span className="status-icon">{getStatusIcon(row.status)}</span>
                <span className="status-text">{row.status || 'Open Issue'}</span>
              </td>
              <td className="col-source">{row.source || 'Not Available'}</td>
              <td className="col-notes">{row.reviewerNotes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {parsed.summary && (
        <div className="table-summary">
          <h4>Summary</h4>
          <p>{parsed.summary}</p>
        </div>
      )}
    </div>
  );
}

