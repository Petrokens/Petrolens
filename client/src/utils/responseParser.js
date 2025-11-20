// Parser to extract structured data from AI responses

/**
 * Parse Check-1 response into structured table data
 */
export function parseCheck1Response(response) {
  if (!response) return null;

  const text = typeof response === 'string' ? response : response.response || '';
  const rows = [];

  // Try to extract table data from markdown or text format
  // Look for table patterns like: | Check Point | Status | Remarks | Score | Source Basis |
  const tableRegex = /\|(.+?)\|/g;
  const lines = text.split('\n');

  let inTable = false;
  let headers = [];
  let currentRow = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect table start
    if (line.includes('Check Point') && line.includes('Status') && line.includes('|')) {
      inTable = true;
      // Extract headers
      headers = line.split('|').map(h => h.trim()).filter(h => h && !h.match(/^[-:]+$/));
      continue;
    }

    // Skip separator lines
    if (line.match(/^[\|\s\-:]+$/)) continue;

    // Parse table rows
    if (inTable && line.includes('|') && line.split('|').length > 3) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 3) {
        const row = {
          checkPoint: cells[0] || '',
          status: parseStatus(cells[1] || ''),
          remarks: cells[2] || '',
          score: parseScore(cells[3] || ''),
          sourceBasis: cells[4] || cells[3] || ''
        };
        rows.push(row);
      }
    }

    // Try to parse unstructured data
    if (!inTable && line.length > 0) {
      // Look for patterns like "1. Check Point: Title block"
      const numberedMatch = line.match(/^(\d+)\.?\s*(.+?)[:：]/);
      if (numberedMatch) {
        const checkPoint = numberedMatch[2].trim();
        // Look for status indicators in the same or next line
        const statusMatch = text.substring(text.indexOf(line)).match(/(OK|Partial|Not OK|Pass|Warning|Open Issue)/i);
        rows.push({
          checkPoint,
          status: statusMatch ? statusMatch[1] : 'Not OK',
          remarks: extractRemarks(text, line),
          score: 0,
          sourceBasis: 'Not Available'
        });
      }
    }
  }

  // If no structured data found, create from text patterns
  if (rows.length === 0) {
    rows.push(...extractFromUnstructuredText(text));
  }

  return {
    rows,
    summary: extractSummary(text),
    rawText: text
  };
}

/**
 * Parse Check-2 response into structured table data
 */
export function parseCheck2Response(response) {
  if (!response) return null;

  const text = typeof response === 'string' ? response : response.response || '';
  const rows = [];

  const lines = text.split('\n');
  let questionNo = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for question patterns
    if (line.match(/^\d+\.|Question|QA\/QC Question/i) || line.includes('?')) {
      const question = extractQuestion(line);
      if (question) {
        const nextLines = lines.slice(i + 1, i + 5).join(' ');
        const status = extractStatus(nextLines);
        const source = extractSource(nextLines);
        const notes = extractNotes(nextLines);

        rows.push({
          questionNo: questionNo++,
          question,
          status: status || 'Open Issue',
          source: source || 'Not Available',
          reviewerNotes: notes || ''
        });
      }
    }
  }

  // If no structured data, create from text
  if (rows.length === 0) {
    const questions = text.match(/([^.!?]*\?)/g) || [];
    questions.forEach((q, idx) => {
      rows.push({
        questionNo: idx + 1,
        question: q.trim(),
        status: 'Open Issue',
        source: 'Not Available',
        reviewerNotes: ''
      });
    });
  }

  return {
    rows,
    totalQuestions: rows.length,
    summary: extractSummary(text),
    rawText: text
  };
}

/**
 * Extract structured data from unstructured text
 */
function extractFromUnstructuredText(text) {
  const rows = [];
  const checkPoints = [
    'Title block', 'Scale & units', 'Revision history', 'Legend/symbols',
    'Readability/fonts', 'CAD/drafting standard', 'Discipline codes',
    'Client spec compliance', 'Previous comments closure', 'Dimensions verified',
    'Orientation consistency', 'Equipment routing', 'Tagging & numbering',
    'Safety & accessibility', 'Interdisciplinary consistency'
  ];

  checkPoints.forEach((point, idx) => {
    const regex = new RegExp(point + '[^\\n]*', 'i');
    const match = text.match(regex);
    if (match) {
      const status = extractStatus(match[0]);
      rows.push({
        checkPoint: point,
        status: status || 'Not OK',
        remarks: match[0].substring(point.length).trim(),
        score: status === 'OK' ? 1 : status === 'Partial' ? 0.5 : 0,
        sourceBasis: 'Not Available'
      });
    }
  });

  return rows;
}

function parseStatus(statusStr) {
  const upper = statusStr.toUpperCase();
  if (upper.includes('OK') || upper.includes('PASS')) return 'OK';
  if (upper.includes('PARTIAL') || upper.includes('WARNING')) return 'Partial';
  return 'Not OK';
}

function parseScore(scoreStr) {
  const match = scoreStr.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function extractStatus(text) {
  const statusMatch = text.match(/(OK|Partial|Not OK|Pass|Warning|Open Issue|✅|⚠️|❌)/i);
  if (statusMatch) {
    const status = statusMatch[1];
    if (status === '✅' || status.toUpperCase() === 'OK' || status.toUpperCase() === 'PASS') return 'OK';
    if (status === '⚠️' || status.toUpperCase() === 'PARTIAL' || status.toUpperCase() === 'WARNING') return 'Partial';
    if (status === '❌' || status.toUpperCase().includes('NOT OK') || status.toUpperCase().includes('OPEN')) return 'Not OK';
  }
  return null;
}

function extractQuestion(line) {
  // Remove numbering and extract question
  const cleaned = line.replace(/^\d+\.?\s*/, '').replace(/^(Question|QA\/QC Question)[:：]?\s*/i, '').trim();
  return cleaned || null;
}

function extractRemarks(text, contextLine) {
  const idx = text.indexOf(contextLine);
  const nextLines = text.substring(idx + contextLine.length, idx + 200);
  const remarksMatch = nextLines.match(/(Remarks|Note|Comment)[:：]?\s*(.+?)(?:\n|$)/i);
  return remarksMatch ? remarksMatch[2].trim() : '';
}

function extractSource(text) {
  const sourceMatch = text.match(/(Source|Source Basis)[:：]?\s*(.+?)(?:\n|$)/i);
  if (sourceMatch) return sourceMatch[2].trim();
  
  // Check for emoji indicators
  if (text.includes('📎')) return 'Input Document';
  if (text.includes('💊')) return 'Good Engineering Practice';
  if (text.includes('🔧')) return 'Engineering Logic';
  if (text.includes('❓')) return 'Not Available';
  
  return null;
}

function extractNotes(text) {
  const notesMatch = text.match(/(Reviewer Notes|Notes|Comment)[:：]?\s*(.+?)(?:\n|$)/i);
  return notesMatch ? notesMatch[2].trim() : '';
}

function extractSummary(text) {
  const summaryMatch = text.match(/(Summary|Final|Overall|Total)[^]*?(Score|Percentage|%)([^]*?)(?:\n\n|$)/i);
  return summaryMatch ? summaryMatch[0].trim() : null;
}

