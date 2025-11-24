// OCR Processor using Tesseract.js for scanned PDFs

let workerInstance = null;
let isInitializing = false;

/**
 * Initialize OCR worker (lazy load)
 */
async function getOCRWorker() {
  if (workerInstance) {
    return workerInstance;
  }

  if (isInitializing) {
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return workerInstance;
  }

  try {
    isInitializing = true;
    // Dynamic import to reduce initial bundle size
    const { createWorker } = await import('tesseract.js');
    workerInstance = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    console.log('OCR Worker initialized');
    isInitializing = false;
    return workerInstance;
  } catch (error) {
    console.error('Failed to initialize OCR worker:', error);
    isInitializing = false;
    return null;
  }
}

/**
 * Extract text from PDF page using OCR (for scanned PDFs)
 * @param {Object} page - PDF.js page object
 * @param {number} pageNumber - Page number
 * @param {Function} onProgress - Progress callback
 */
export async function extractTextWithOCR(page, pageNumber, onProgress = null) {
  try {
    const worker = await getOCRWorker();
    if (!worker) {
      throw new Error('OCR worker not available');
    }

    if (onProgress) {
      onProgress(`OCR: Starting page ${pageNumber}...`);
    }

    // Render page to canvas
    const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    await page.render(renderContext).promise;

    // Perform OCR on canvas
    if (onProgress) {
      onProgress(`OCR: Processing page ${pageNumber}...`);
    }

    const { data: { text } } = await worker.recognize(canvas);

    if (onProgress) {
      onProgress(`OCR: Completed page ${pageNumber}`);
    }

    return text || '';
  } catch (error) {
    console.error(`OCR error on page ${pageNumber}:`, error);
    return '';
  }
}

/**
 * Check if PDF page has selectable text
 * @param {Object} page - PDF.js page object
 */
export async function hasSelectableText(page) {
  try {
    const textContent = await page.getTextContent();
    const items = textContent.items || [];
    
    // Check if there's meaningful text (not just empty strings)
    const hasText = items.some(item => item.str && item.str.trim().length > 0);
    
    // If there's text but it's very short, might still need OCR
    if (hasText) {
      const totalText = items.map(item => item.str).join(' ').trim();
      return totalText.length > 50; // If less than 50 chars, might be scanned
    }
    
    return false;
  } catch (error) {
    console.error('Error checking text:', error);
    return false;
  }
}

/**
 * Cleanup OCR worker
 */
export async function terminateOCRWorker() {
  if (workerInstance) {
    await workerInstance.terminate();
    workerInstance = null;
    console.log('OCR Worker terminated');
  }
}

