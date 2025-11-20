// Document classifier utility

import { classifyDocumentType } from '../config/documentTypes.js';

/**
 * Classify document from file name and content
 */
export async function classifyDocument(fileName, fileContent = '') {
  try {
    const classification = classifyDocumentType(fileName, fileContent);
    return classification;
  } catch (error) {
    console.error('Error classifying document:', error);
    return {
      type: 'Document',
      specificType: 'Unknown'
    };
  }
}

/**
 * Extract text content from file (for classification)
 */
export async function extractTextFromFile(file) {
  if (!file) return '';

  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPDF(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await extractTextFromDocx(file);
    } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      // For .doc files, we'll need a different approach
      return fileName; // Fallback to filename only
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    return fileName; // Fallback to filename
  }

  return fileName;
}

/**
 * Extract text from PDF (simplified - would need pdfjs-dist in production)
 */
async function extractTextFromPDF(file) {
  // This is a simplified version
  // In production, you'd use pdfjs-dist to extract text
  try {
    // Dynamic import with error handling
    const pdfjsLib = await import('pdfjs-dist').catch(() => null);
    
    if (!pdfjsLib) {
      console.warn('pdfjs-dist not available, using filename for classification');
      return file.name;
    }

    // Set worker if needed
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    // Limit to first 10 pages for performance
    const maxPages = Math.min(pdf.numPages, 10);
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + ' ';
    }

    return fullText || file.name;
  } catch (error) {
    console.error('PDF extraction error:', error);
    return file.name; // Fallback
  }
}

/**
 * Extract text from DOCX
 */
async function extractTextFromDocx(file) {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    return file.name; // Fallback
  }
}

