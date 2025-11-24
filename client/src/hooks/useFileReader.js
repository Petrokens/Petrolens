// Hook for reading file content with progress tracking

import { useState } from 'react';
import { extractTextFromFile } from '../utils/documentClassifier.js';

export function useFileReader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [progress, setProgress] = useState({
    currentPage: 0,
    totalPages: 0,
    isReading: false,
    currentLine: 0,
    totalLines: 0,
    status: ''
  });
  const [extractedText, setExtractedText] = useState(''); // Full extracted text with line numbers
  const [isAIProcessing, setIsAIProcessing] = useState(false); // Track if AI is using the text

  const readFile = async (file) => {
    if (!file) {
      setError('No file provided');
      return null;
    }

    setLoading(true);
    setError(null);
    setContent('');
    setExtractedText('');
      setProgress({ currentPage: 0, totalPages: 0, isReading: true, currentLine: 0, totalLines: 0, status: 'Starting file read...' });

    try {
      let fullText = '';
      let totalPages = 0;

      // Progress callback to track pages and lines being read
      // Supports: (page, total, text) or (page, total, text, status)
      const onProgress = (currentPage, totalPagesCount, accumulatedText, status = '') => {
        totalPages = totalPagesCount;
        fullText = accumulatedText;
        const lines = accumulatedText.split('\n').filter(line => line.trim().length > 0);
        setProgress({
          currentPage,
          totalPages: totalPagesCount,
          isReading: true,
          currentLine: lines.length,
          totalLines: lines.length, // Will be updated as more lines are read
          status: status || `Reading page ${currentPage} of ${totalPagesCount}...`
        });
        setExtractedText(accumulatedText);
      };

      // Extract text with progress tracking
      console.log('📂 Starting file extraction...');
      const textContent = await extractTextFromFile(file, onProgress);
      
      console.log(`📄 File extraction complete. Total pages detected: ${totalPages}`);
      console.log(`📝 Text content length: ${textContent.length} characters`);
      
      // Final update - ensure we use the actual totalPages from progress
      const finalLines = textContent.split('\n').filter(line => line.trim().length > 0);
      const finalTotalPages = totalPages > 0 ? totalPages : 1;
      
      setContent(textContent);
      setExtractedText(textContent);
      setProgress({
        currentPage: finalTotalPages,
        totalPages: finalTotalPages,
        isReading: false,
        currentLine: finalLines.length,
        totalLines: finalLines.length,
        status: `✅ Successfully read ${finalTotalPages} page${finalTotalPages !== 1 ? 's' : ''}`
      });
      
      console.log(`✅ Final progress: ${finalTotalPages} pages, ${finalLines.length} lines`);

      return textContent;
    } catch (err) {
      // Don't set error if it's the engineering validation error (already set)
      if (err.message && err.message.includes('engineering document')) {
        // Error already set above
      } else {
        const errorMessage = err.message || 'Failed to read file';
        setError(errorMessage);
      }
      console.error('File reading error:', err);
      setProgress({ currentPage: 0, totalPages: 0, isReading: false });
      return null;
    } finally {
      setLoading(false);
      setProgress(prev => ({ ...prev, isReading: false }));
    }
  };

  const reset = () => {
    setContent('');
    setExtractedText('');
    setError(null);
    setLoading(false);
    setProgress({ currentPage: 0, totalPages: 0, isReading: false });
  };

  return {
    readFile,
    content,
    extractedText, // Full text with progress tracking
    loading,
    error,
    progress, // { currentPage, totalPages, isReading, currentLine, totalLines }
    isAIProcessing,
    setIsAIProcessing, // Function to mark when AI is processing
    reset
  };
}

