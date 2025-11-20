// History Manager for storing and retrieving QC reports

/**
 * Save QC report to history
 */
export function saveReportToHistory(reportData) {
  try {
    const history = getHistory();
    const report = {
      id: generateReportId(),
      ...reportData,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    history.unshift(report); // Add to beginning
    // Keep only last 100 reports
    const limitedHistory = history.slice(0, 100);
    localStorage.setItem('qc_reports_history', JSON.stringify(limitedHistory));
    
    return report.id;
  } catch (error) {
    console.error('Error saving report to history:', error);
    return null;
  }
}

/**
 * Get all reports from history
 */
export function getHistory() {
  try {
    const stored = localStorage.getItem('qc_reports_history');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

/**
 * Get report by ID
 */
export function getReportById(id) {
  const history = getHistory();
  return history.find(report => report.id === id);
}

/**
 * Delete report from history
 */
export function deleteReport(id) {
  try {
    const history = getHistory();
    const filtered = history.filter(report => report.id !== id);
    localStorage.setItem('qc_reports_history', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    return false;
  }
}

/**
 * Clear all history
 */
export function clearHistory() {
  try {
    localStorage.removeItem('qc_reports_history');
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
}

/**
 * Filter history by discipline, date range, etc.
 */
export function filterHistory(filters = {}) {
  let history = getHistory();
  
  if (filters.discipline) {
    history = history.filter(r => r.discipline === filters.discipline);
  }
  
  if (filters.documentType) {
    history = history.filter(r => r.documentType === filters.documentType);
  }
  
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    history = history.filter(r => new Date(r.createdAt) >= fromDate);
  }
  
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    history = history.filter(r => new Date(r.createdAt) <= toDate);
  }
  
  if (filters.minScore !== undefined) {
    history = history.filter(r => (r.combinedScore || 0) >= filters.minScore);
  }
  
  if (filters.maxScore !== undefined) {
    history = history.filter(r => (r.combinedScore || 0) <= filters.maxScore);
  }
  
  return history;
}

/**
 * Get statistics from history
 */
export function getHistoryStats() {
  const history = getHistory();
  
  if (history.length === 0) {
    return {
      totalReports: 0,
      averageScore: 0,
      byDiscipline: {},
      byStatus: {}
    };
  }
  
  const scores = history
    .map(r => r.combinedScore)
    .filter(s => s !== null && s !== undefined);
  
  const averageScore = scores.length > 0
    ? scores.reduce((sum, s) => sum + s, 0) / scores.length
    : 0;
  
  const byDiscipline = {};
  history.forEach(r => {
    const disc = r.discipline || 'Unknown';
    byDiscipline[disc] = (byDiscipline[disc] || 0) + 1;
  });
  
  const byStatus = {};
  history.forEach(r => {
    const status = r.scoreCategory?.key || 'unknown';
    byStatus[status] = (byStatus[status] || 0) + 1;
  });
  
  return {
    totalReports: history.length,
    averageScore: Math.round(averageScore * 100) / 100,
    byDiscipline,
    byStatus
  };
}

/**
 * Generate unique report ID
 */
function generateReportId() {
  return `QC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

