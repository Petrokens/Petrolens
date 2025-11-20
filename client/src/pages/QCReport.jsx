// QC Report Page

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FinalReport } from '../components/Results/FinalReport.jsx';
import { Loader } from '../components/Common/Loader.jsx';
import { saveReportToHistory } from '../utils/historyManager.js';

export function QCReport() {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load report data from session storage
    const storedData = sessionStorage.getItem('qcResults');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setReportData(data);
        
        // Save to history
        const reportId = saveReportToHistory({
          check1Result: data.check1,
          check2Result: data.check2,
          check1Score: data.check1Score,
          check2Score: data.check2Score,
          combinedScore: data.combinedScore,
          scoreCategory: data.scoreCategory,
          documentMeta: data.documentMeta,
          discipline: data.discipline,
          documentType: data.documentType
        });
        
        // Store report ID for reference
        if (reportId) {
          sessionStorage.setItem('currentReportId', reportId);
        }
      } catch (error) {
        console.error('Error parsing report data:', error);
        navigate('/upload');
      }
    } else {
      navigate('/upload');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <Loader message="Loading report..." />;
  }

  if (!reportData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>No report data found. Please upload a document first.</p>
        <button onClick={() => navigate('/upload')}>Go to Upload</button>
      </div>
    );
  }

  return (
    <FinalReport
      check1Result={reportData.check1}
      check2Result={reportData.check2}
      check1Score={reportData.check1Score}
      check2Score={reportData.check2Score}
      documentMeta={reportData.documentMeta}
      discipline={reportData.discipline}
      documentType={reportData.documentType}
    />
  );
}

