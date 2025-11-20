// Reports Archive Page (simplified - would connect to backend in production)

import { useAuth } from '../context/AuthContext.jsx';
import './Reports.css';

export function Reports() {
  const { user, isAdmin } = useAuth();

  // In production, this would fetch from a backend API
  const reports = JSON.parse(localStorage.getItem('qc_reports') || '[]');

  const filteredReports = isAdmin() 
    ? reports 
    : reports.filter(r => r.discipline === user?.discipline);

  return (
    <div className="reports-page">
      <h1>QC Reports Archive</h1>
      <p className="reports-subtitle">
        {filteredReports.length === 0 
          ? 'No reports found. Upload a document to generate your first QC report.'
          : `Showing ${filteredReports.length} report(s)`
        }
      </p>

      {filteredReports.length > 0 && (
        <div className="reports-list">
          {filteredReports.map((report, index) => (
            <div key={index} className="report-item">
              <div className="report-header">
                <h3>{report.documentMeta?.title || `Report ${index + 1}`}</h3>
                <span className="report-date">
                  {new Date(report.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="report-details">
                <p><strong>Discipline:</strong> {report.discipline}</p>
                <p><strong>Type:</strong> {report.documentType}</p>
                <p><strong>Score:</strong> {report.combinedScore ? `${report.combinedScore.toFixed(1)}%` : 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

