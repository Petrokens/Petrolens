// Table formatter for report generation

/**
 * Format check results as table data
 */
export function formatCheckResultsTable(checkResults) {
  if (!checkResults || !Array.isArray(checkResults)) {
    return [];
  }

  return checkResults.map((check, index) => ({
    id: index + 1,
    checkPoint: check.checkPoint || check.question || 'N/A',
    status: check.status || 'Not OK',
    remarks: check.remarks || check.reviewerNotes || '',
    score: check.score || (check.status === 'OK' ? 1 : check.status === 'Partial' ? 0.5 : 0),
    sourceBasis: check.sourceBasis || check.source || 'Not Available',
    riskLevel: check.riskLevel || 'Low'
  }));
}

/**
 * Format Check-2 questions as table data
 */
export function formatCheck2Table(questions) {
  if (!questions || !Array.isArray(questions)) {
    return [];
  }

  return questions.map((q, index) => ({
    questionNo: index + 1,
    question: q.question || q.qaQcQuestion || 'N/A',
    status: q.status || 'Open Issue',
    source: q.source || 'Not Available',
    reviewerNotes: q.reviewerNotes || q.remarks || ''
  }));
}

/**
 * Convert table data to markdown format
 */
export function tableToMarkdown(headers, rows) {
  if (!rows || rows.length === 0) return '';

  const headerRow = `| ${headers.join(' | ')} |`;
  const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
  const dataRows = rows.map(row => 
    `| ${headers.map(header => {
      const value = row[header] || row[header.toLowerCase()] || '';
      return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
    }).join(' | ')} |`
  );

  return [headerRow, separatorRow, ...dataRows].join('\n');
}

/**
 * Convert table data to HTML format
 */
export function tableToHTML(headers, rows) {
  if (!rows || rows.length === 0) return '';

  const headerHTML = `<thead><tr>${headers.map(h => `<th>${escapeHTML(h)}</th>`).join('')}</tr></thead>`;
  const bodyHTML = `<tbody>${rows.map(row => 
    `<tr>${headers.map(header => {
      const value = row[header] || row[header.toLowerCase()] || '';
      return `<td>${escapeHTML(String(value))}</td>`;
    }).join('')}</tr>`
  ).join('')}</tbody>`;

  return `<table style="border-collapse: collapse; width: 100%; margin: 20px 0;">${headerHTML}${bodyHTML}</table>`;
}

/**
 * Escape HTML special characters
 */
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format summary statistics
 */
export function formatSummaryStats(checkResults) {
  const stats = {
    total: checkResults.length,
    ok: 0,
    partial: 0,
    notOk: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0
  };

  checkResults.forEach(check => {
    const status = (check.status || '').toUpperCase();
    if (status === 'OK' || status === 'PASS') stats.ok++;
    else if (status === 'PARTIAL' || status === 'WARNING') stats.partial++;
    else stats.notOk++;

    const risk = (check.riskLevel || 'LOW').toUpperCase();
    if (risk === 'HIGH') stats.highRisk++;
    else if (risk === 'MEDIUM') stats.mediumRisk++;
    else stats.lowRisk++;
  });

  return stats;
}

