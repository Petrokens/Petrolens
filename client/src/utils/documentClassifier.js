// Document classifier utility

import { classifyDocumentType } from '../config/documentTypes.js';
import { ENGINEERING_KEYWORDS, MAX_PAGES_TO_READ } from '../config/constants.js';
import { extractTextWithOCR, hasSelectableText, terminateOCRWorker } from './ocrProcessor.js';

/**
 * Validate if document is an engineering document
 */
export function validateEngineeringDocument(fileName, content = '') {
  const lowerFileName = fileName.toLowerCase();
  const lowerContent = content.toLowerCase();
  const combined = `${lowerFileName} ${lowerContent.substring(0, 5000)}`; // Check first 5000 chars for speed

  // Check if any engineering keyword is present
  const hasEngineeringKeyword = ENGINEERING_KEYWORDS.some(keyword => 
    combined.includes(keyword.toLowerCase())
  );

  // If content is very short, only check filename
  if (content.length < 100) {
    return ENGINEERING_KEYWORDS.some(keyword => 
      lowerFileName.includes(keyword.toLowerCase())
    );
  }

  return hasEngineeringKeyword;
}

/**
 * Classify document from file name and content
 */
export async function classifyDocument(fileName, fileContent = '') {
  try {
    // First validate if it's an engineering document
    const isValidEngineeringDoc = validateEngineeringDocument(fileName, fileContent);
    
    if (!isValidEngineeringDoc) {
      throw new Error('NOT_ENGINEERING_DOCUMENT');
    }

    const classification = classifyDocumentType(fileName, fileContent);
    return classification;
  } catch (error) {
    if (error.message === 'NOT_ENGINEERING_DOCUMENT') {
      throw error; // Re-throw validation error
    }
    console.error('Error classifying document:', error);
    return {
      type: 'Document',
      specificType: 'Unknown'
    };
  }
}

/**
 * Extract text content from file (for classification) with progress tracking
 * @param {File} file - File to extract text from
 * @param {Function} onProgress - Callback for progress updates (page, totalPages, content)
 */
export async function extractTextFromFile(file, onProgress = null) {
  if (!file) return '';

  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPDF(file, onProgress);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await extractTextFromDocx(file, onProgress);
    } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      // For .doc files, we'll need a different approach
      if (onProgress) onProgress(1, 1, fileName);
      return fileName; // Fallback to filename only
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileType === 'application/vnd.ms-excel' ||
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.xls')
    ) {
      // For Excel files, return filename for now (could add Excel parsing later)
      if (onProgress) onProgress(1, 1, fileName);
      return fileName;
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      // For text files, read as text
      return await extractTextFromTextFile(file, onProgress);
    } else if (fileName.endsWith('.dwg') || fileName.endsWith('.dxf')) {
      // For CAD files, return filename (text extraction not possible without specialized tools)
      if (onProgress) onProgress(1, 1, fileName);
      return fileName;
    } else if (fileType === 'application/rtf' || fileName.endsWith('.rtf')) {
      // For RTF files, try to read as text
      return await extractTextFromTextFile(file, onProgress);
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    if (onProgress) onProgress(1, 1, fileName);
    return fileName; // Fallback to filename
  }

  return fileName;
}

/**
 * Extract text from PDF with progress tracking
 * @param {File} file - PDF file
 * @param {Function} onProgress - Progress callback (page, totalPages, accumulatedText)
 */
async function extractTextFromPDF(file, onProgress = null) {
  try {
    // Dynamic import with error handling
    const pdfjsLib = await import('pdfjs-dist').catch(() => null);
    
    if (!pdfjsLib) {
      console.warn('pdfjs-dist not available, using filename for classification');
      if (onProgress) onProgress(1, 1, file.name);
      return file.name;
    }

    // Set worker if needed
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;
    
    console.log(`📄 PDF loaded: ${totalPages} pages detected`);
    
    // CRITICAL: Report total pages immediately so UI shows correct count
    if (onProgress) {
      onProgress(0, totalPages, '', `PDF detected: ${totalPages} pages. Starting extraction...`);
    }
    
    // Determine pages to read (unlimited if MAX_PAGES_TO_READ is null)
    const pagesToRead = MAX_PAGES_TO_READ ? Math.min(totalPages, MAX_PAGES_TO_READ) : totalPages;
    
    console.log(`📖 Will read ${pagesToRead} pages (MAX_PAGES_TO_READ: ${MAX_PAGES_TO_READ || 'unlimited'})`);
    
    let fullText = '';
    let ocrUsed = false;
    let pagesProcessed = 0;

    // Read all pages (no limit or up to MAX_PAGES_TO_READ)
    // Process all 781+ pages with proper error handling
    console.log(`🚀 Starting to process ${pagesToRead} pages...`);
    
    // Ensure we report the correct total from the start
    if (onProgress && totalPages > 1) {
      onProgress(0, totalPages, '', `Starting to read all ${totalPages} pages...`);
    }
    
    for (let i = 1; i <= pagesToRead; i++) {
      try {
        if (onProgress) {
          onProgress(i, totalPages, fullText, `Processing page ${i}/${totalPages}...`);
        }
        
        const page = await pdf.getPage(i);
        
        // Check if page has selectable text
        let hasText = false;
        let pageText = '';
        
        try {
          hasText = await hasSelectableText(page);
        } catch (error) {
          console.warn(`Error checking text on page ${i}:`, error);
          hasText = false;
        }
        
        if (hasText) {
          // Extract text normally
          try {
            const textContent = await page.getTextContent();
            pageText = textContent.items.map(item => item.str).join(' ');
          } catch (error) {
            console.warn(`Error extracting text from page ${i}:`, error);
            pageText = '';
          }
        }

        // If no text found or very short, try OCR for scanned pages
        if (!pageText || pageText.trim().length < 50) {
          if (onProgress) {
            onProgress(i, totalPages, fullText, `Using OCR for page ${i} (scanned/no text)`);
          }
          try {
            const ocrText = await extractTextWithOCR(page, i, (msg) => {
              if (onProgress) onProgress(i, totalPages, fullText, msg);
            });
            if (ocrText && ocrText.trim().length > 0) {
              pageText = ocrText;
              ocrUsed = true;
            }
          } catch (ocrError) {
            console.warn(`OCR failed for page ${i}:`, ocrError);
            // Continue with empty page text if OCR fails
          }
        }
        
        // Add page text (even if empty, to maintain page count)
        if (pageText.trim().length > 0) {
          fullText += `\n\n--- Page ${i} ---\n\n${pageText}`;
        } else {
          fullText += `\n\n--- Page ${i} (No text extracted) ---\n\n`;
        }
        
        pagesProcessed++;
        
        // Report progress after each page
        if (onProgress) {
          const lines = fullText.split('\n').filter(l => l.trim().length > 0);
          onProgress(i, totalPages, fullText, `Read page ${i}/${totalPages} (${lines.length} lines extracted)`);
        }
        
        // Log every 50 pages for large documents
        if (i % 50 === 0 || i === 1) {
          console.log(`✅ Processed ${i}/${totalPages} pages (${pagesProcessed} successful)`);
        }
        
        // Small delay for UI responsiveness (only 5ms to speed up large PDFs)
        await new Promise(resolve => setTimeout(resolve, 5));
        
      } catch (pageError) {
        // Continue processing even if one page fails
        console.error(`Error processing page ${i}:`, pageError);
        fullText += `\n\n--- Page ${i} (Error: ${pageError.message}) ---\n\n`;
        
        if (onProgress) {
          onProgress(i, totalPages, fullText, `Error on page ${i}, continuing...`);
        }
        
        // Continue to next page
        continue;
      }
    }

    // Final summary
    console.log(`✅ PDF extraction complete: ${pagesProcessed}/${pagesToRead} pages processed successfully`);
    console.log(`📊 Total text extracted: ${fullText.length} characters`);
    
    // Add note if document was truncated
    if (MAX_PAGES_TO_READ && totalPages > MAX_PAGES_TO_READ) {
      fullText += `\n\n[Note: Document has ${totalPages} pages. Only first ${MAX_PAGES_TO_READ} pages were read for analysis.]`;
      if (onProgress) {
        onProgress(pagesToRead, totalPages, fullText, `Read ${pagesToRead}/${totalPages} pages`);
      }
    } else {
      // Report final progress for all pages
      if (onProgress) {
        onProgress(totalPages, totalPages, fullText, `✅ Successfully read all ${totalPages} pages`);
      }
    }

    // Add OCR note if OCR was used
    if (ocrUsed) {
      fullText += `\n\n[Note: OCR (Optical Character Recognition) was used to extract text from scanned pages.]`;
    }

    // Cleanup OCR worker after use
    await terminateOCRWorker();

    // Final verification - ensure we processed all pages
    if (pagesProcessed < pagesToRead) {
      console.warn(`⚠️ Warning: Only processed ${pagesProcessed} out of ${pagesToRead} pages`);
    }
    
    return fullText || file.name;
  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    console.error('Error details:', error.stack);
    
    // Try to get page count even on error and report it
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist');
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      console.error(`⚠️ Error occurred but PDF has ${totalPages} pages`);
      
      // Report the actual total pages, not 1
      if (onProgress) {
        onProgress(0, totalPages, '', `❌ Error: ${error.message}. PDF has ${totalPages} pages but extraction failed. Please check console for details.`);
      }
      
      // Don't return early - try to continue with at least page count info
      return `[Error extracting PDF: ${error.message}. PDF has ${totalPages} pages.]`;
    } catch (e) {
      console.error('Could not get page count:', e);
      if (onProgress) onProgress(1, 1, file.name);
      return file.name; // Fallback only if we can't get page count
    }
  }
}

/**
 * Extract text from plain text files (TXT, RTF)
 * @param {File} file - Text file
 * @param {Function} onProgress - Progress callback (page, totalPages, accumulatedText)
 */
async function extractTextFromTextFile(file, onProgress = null) {
  try {
    if (onProgress) onProgress(0, 0, ''); // Start reading
    
    const text = await file.text();
    
    // Estimate page count (rough: 50 lines per page)
    const lines = text.split('\n');
    const estimatedPages = Math.max(1, Math.min(MAX_PAGES_TO_READ, Math.ceil(lines.length / 50)));
    const linesToRead = Math.min(lines.length, estimatedPages * 50);
    const truncatedLines = lines.slice(0, linesToRead);
    const finalText = truncatedLines.join('\n');
    
    // Add note if truncated
    let displayText = finalText;
    if (lines.length > linesToRead) {
      displayText += `\n\n[Note: File has ${lines.length} lines. Only first ${linesToRead} lines (${estimatedPages} pages) were read for analysis.]`;
    }
    
    // Report progress line-by-line
    if (onProgress) {
      let accumulatedText = '';
      for (let i = 0; i < linesToRead; i++) {
        accumulatedText += lines[i] + '\n';
        // Calculate current page based on lines read
        const currentPage = Math.ceil((i + 1) / 50);
        onProgress(currentPage, estimatedPages, accumulatedText);
        // Small delay to show real-time progress
        await new Promise(resolve => setTimeout(resolve, 5));
      }
    }
    
    return displayText;
  } catch (error) {
    console.error('Text file extraction error:', error);
    if (onProgress) onProgress(1, 1, file.name);
    return file.name; // Fallback
  }
}

/**
 * Extract text from DOCX with progress tracking
 * @param {File} file - DOCX file
 * @param {Function} onProgress - Progress callback (page, totalPages, accumulatedText)
 */
async function extractTextFromDocx(file, onProgress = null) {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    
    // Estimate pages (rough estimate: 1 page = ~500 words)
    if (onProgress) onProgress(0, 0, ''); // Start reading
    
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value || '';
    
    // Estimate page count (rough: 500 words per page), limit to MAX_PAGES_TO_READ
    const wordCount = text.split(/\s+/).length;
    const estimatedPages = Math.min(MAX_PAGES_TO_READ, Math.max(1, Math.ceil(wordCount / 500)));
    
    // Report progress line-by-line for DOCX
    if (onProgress) {
      const lines = text.split('\n');
      let accumulatedText = '';
      const maxLines = Math.min(lines.length, estimatedPages * 50); // Limit to reasonable number
      
      // Report line-by-line progress
      for (let i = 0; i < maxLines; i++) {
        accumulatedText += lines[i] + '\n';
        // Calculate current page based on lines read
        const currentPage = Math.ceil((i + 1) / 50);
        onProgress(currentPage, estimatedPages, accumulatedText);
        // Small delay to show real-time progress
        await new Promise(resolve => setTimeout(resolve, 5));
      }
      
      // Add remaining lines if any
      if (lines.length > maxLines) {
        accumulatedText += lines.slice(maxLines).join('\n');
      }
    }
    
    return text;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    if (onProgress) onProgress(1, 1, file.name);
    return file.name; // Fallback
  }
}

