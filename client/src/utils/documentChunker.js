// Document Chunking Utility for Large Documents
// Intelligently splits large documents into chunks for AI processing

import { CHUNK_SIZE, CHUNK_OVERLAP } from '../config/constants.js';

/**
 * Intelligent chunking of large documents
 * Splits document into chunks with overlap to maintain context
 * @param {string} text - Full document text
 * @param {number} chunkSize - Maximum characters per chunk
 * @param {number} overlap - Characters to overlap between chunks
 * @returns {Array<string>} Array of text chunks
 */
export function chunkDocument(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  if (!text || text.length <= chunkSize) {
    return [text];
  }

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;
    
    // If not the last chunk, try to break at sentence boundary
    if (end < text.length) {
      // Look for sentence endings within the last 500 chars
      const searchStart = Math.max(start + chunkSize - 500, start);
      const searchEnd = Math.min(end, text.length);
      const chunkText = text.substring(searchStart, searchEnd);
      
      // Try to find sentence boundaries
      const sentenceMatch = chunkText.match(/([.!?]\s+|\.\n+)[^.!?]*$/);
      if (sentenceMatch && sentenceMatch.index !== undefined) {
        end = searchStart + sentenceMatch.index + sentenceMatch[0].length;
      } else {
        // Try paragraph boundary
        const paraBoundary = chunkText.lastIndexOf('\n\n');
        if (paraBoundary !== -1) {
          end = searchStart + paraBoundary + 2;
        } else {
          // Try line break
          const lineBoundary = chunkText.lastIndexOf('\n');
          if (lineBoundary !== -1) {
            end = searchStart + lineBoundary + 1;
          }
        }
      }
    }

    const chunk = text.substring(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move start forward, accounting for overlap
    start = end - overlap;
    if (start >= text.length) break;
  }

  return chunks;
}

/**
 * Chunk by pages for PDFs (preserves page context)
 * @param {string} text - Full document text with page markers
 * @param {number} pagesPerChunk - Number of pages per chunk
 * @returns {Array<{text: string, pages: Array<number>, chunkIndex: number}>} Array of chunks with metadata
 */
export function chunkByPages(text, pagesPerChunk = 10) {
  const chunks = [];
  const pagePattern = /--- Page (\d+) ---/g;
  
  // Extract pages with their numbers
  const pages = [];
  let lastIndex = 0;
  let match;
  
  while ((match = pagePattern.exec(text)) !== null) {
    const pageNum = parseInt(match[1]);
    const pageStart = match.index + match[0].length;
    
    // Find next page or end
    const nextMatch = text.substring(pageStart).match(pagePattern);
    const pageEnd = nextMatch ? pageStart + nextMatch.index : text.length;
    
    pages.push({
      number: pageNum,
      text: text.substring(pageStart, pageEnd).trim(),
      start: pageStart,
      end: pageEnd
    });
  }

  // If no page markers found, chunk normally
  if (pages.length === 0) {
    return chunkDocument(text).map((chunk, idx) => ({
      text: chunk,
      pages: [],
      chunkIndex: idx
    }));
  }

  // Group pages into chunks
  for (let i = 0; i < pages.length; i += pagesPerChunk) {
    const pageGroup = pages.slice(i, i + pagesPerChunk);
    const chunkText = pageGroup.map(p => `--- Page ${p.number} ---\n\n${p.text}`).join('\n\n');
    const pageNumbers = pageGroup.map(p => p.number);
    
    chunks.push({
      text: chunkText,
      pages: pageNumbers,
      chunkIndex: chunks.length,
      totalChunks: Math.ceil(pages.length / pagesPerChunk)
    });
  }

  return chunks;
}

/**
 * Chunk large document for AI processing
 * Automatically selects best chunking strategy
 * @param {string} text - Document text
 * @param {number} totalPages - Total pages (if known)
 * @returns {Array<{text: string, pages: Array<number>, chunkIndex: number, metadata?: object}>} Chunks
 */
export function intelligentChunk(text, totalPages = null) {
  // For very large documents (500+ pages), chunk by pages
  if (totalPages && totalPages > 500) {
    const pagesPerChunk = Math.max(5, Math.floor(500 / Math.ceil(totalPages / 50)));
    return chunkByPages(text, pagesPerChunk);
  }
  
  // For documents with page markers, chunk by pages (smaller chunks)
  if (text.includes('--- Page')) {
    return chunkByPages(text, 10);
  }
  
  // Otherwise, use intelligent text chunking
  return chunkDocument(text).map((chunk, idx) => ({
    text: chunk,
    pages: [],
    chunkIndex: idx
  }));
}

/**
 * Get summary stats for chunks
 * @param {Array} chunks - Array of chunks
 * @returns {object} Statistics
 */
export function getChunkStats(chunks) {
  return {
    totalChunks: chunks.length,
    avgChunkSize: chunks.reduce((sum, c) => sum + c.text.length, 0) / chunks.length,
    totalChars: chunks.reduce((sum, c) => sum + c.text.length, 0),
    totalPages: chunks.reduce((sum, c) => sum + (c.pages?.length || 0), 0)
  };
}
