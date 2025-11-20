// Final Report Component with download functionality

import { useMemo } from 'react';
import { QCResultCheck1 } from './QCResultCheck1.jsx';
import { QCResultCheck2 } from './QCResultCheck2.jsx';
import { ScoreDisplay } from '../Dashboard/ScoreDisplay.jsx';
import { useScoring } from '../../hooks/useScoring.js';
import { generatePDFReport, generateWordReport } from '../../utils/reportGenerator.js';
import './Results.css';

const DISCLAIMER = `This QA/QC report is system-generated based on a standardized checklist and automated review logic. Ensure that only the latest approved revisions of all documents, drawings, and references are used in the preparation of this deliverable. Each input shall be cross-verified against the official document register and confirmed with the respective owner before inclusion. Superseded or unverified inputs must not be used. While it provides a structured and objective assessment of the deliverable, it should not be relied upon as a sole basis for approval or construction. Professional engineering judgment, experience, and good engineering practices must be applied in conjunction with this report. Reviewers are advised to perform a thorough manual validation where applicable and consult relevant discipline experts or project authorities for critical observations.`;

export function FinalReport({ 
  check1Result, 
  check2Result, 
  check1Score, 
  check2Score,
  documentMeta,
  discipline,
  documentType
}) {
  const { combinedScore, scoreCategory, formattedScores } = useScoring(check1Score, check2Score);

  const handleDownloadPDF = async () => {
    try {
      await generatePDFReport({
        check1Result,
        check2Result,
        check1Score,
        check2Score,
        combinedScore,
        scoreCategory,
        documentMeta,
        discipline,
        documentType,
        disclaimer: DISCLAIMER
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const handleDownloadWord = async () => {
    try {
      await generateWordReport({
        check1Result,
        check2Result,
        check1Score,
        check2Score,
        combinedScore,
        scoreCategory,
        documentMeta,
        discipline,
        documentType,
        disclaimer: DISCLAIMER
      });
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Failed to generate Word report. Please try again.');
    }
  };

  return (
    <div className="final-report">
      <div className="report-header">
        <h1>QC Report</h1>
        <div className="report-actions">
          <button onClick={handleDownloadPDF} className="download-btn pdf">
            Download PDF
          </button>
          <button onClick={handleDownloadWord} className="download-btn word">
            Download Word
          </button>
        </div>
      </div>

      {documentMeta && (
        <div className="report-meta-section">
          <h3>Document Information</h3>
          <div className="meta-info">
            <p><strong>Title:</strong> {documentMeta.title || 'N/A'}</p>
            <p><strong>Number:</strong> {documentMeta.documentNumber || 'N/A'}</p>
            <p><strong>Revision:</strong> {documentMeta.revision || 'N/A'}</p>
            <p><strong>Status:</strong> {documentMeta.status || 'N/A'}</p>
            <p><strong>Discipline:</strong> {discipline || 'N/A'}</p>
            <p><strong>Type:</strong> {documentType || 'N/A'}</p>
          </div>
        </div>
      )}

      <ScoreDisplay
        check1Score={check1Score}
        check2Score={check2Score}
        combinedScore={combinedScore}
        scoreCategory={scoreCategory}
      />

      {check1Result && (
        <QCResultCheck1 result={check1Result} score={check1Score} />
      )}

      {check2Result && (
        <QCResultCheck2 result={check2Result} score={check2Score} />
      )}

      {combinedScore !== null && (
        <div className="consolidated-score">
          <h2>Consolidated Overall Score</h2>
          <div className="consolidated-content">
            <p><strong>Check-1 Score:</strong> {formattedScores.check1}</p>
            <p><strong>Check-2 Score:</strong> {formattedScores.check2}</p>
            <p><strong>Overall Score:</strong> {formattedScores.combined}</p>
            {scoreCategory && (
              <p><strong>Category:</strong> {scoreCategory.label}</p>
            )}
          </div>
        </div>
      )}

      <div className="report-disclaimer">
        <p style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
          {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}

