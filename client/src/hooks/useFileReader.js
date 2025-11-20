// Hook for reading file content

import { useState } from 'react';
import { extractTextFromFile } from '../utils/documentClassifier.js';

export function useFileReader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');

  const readFile = async (file) => {
    if (!file) {
      setError('No file provided');
      return null;
    }

    setLoading(true);
    setError(null);
    setContent('');

    try {
      const textContent = await extractTextFromFile(file);
      setContent(textContent);
      return textContent;
    } catch (err) {
      const errorMessage = err.message || 'Failed to read file';
      setError(errorMessage);
      console.error('File reading error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setContent('');
    setError(null);
    setLoading(false);
  };

  return {
    readFile,
    content,
    loading,
    error,
    reset
  };
}

