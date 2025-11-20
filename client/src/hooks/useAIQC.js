// Hook for AI QC analysis (Check-1 and Check-2) with improved error handling

import { useState } from 'react';
import { callOpenRouterAPI, getAPIKey, detectProvider, getCheapModels } from '../api/openRouter.js';
import { buildCheck1Prompt } from '../utils/promptCheck1.js';
import { buildCheck2Prompt } from '../utils/promptCheck2.js';
import { parseScoreFromResponse } from '../utils/scoringHelper.js';

export function useAIQC() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [check1Result, setCheck1Result] = useState(null);
  const [check2Result, setCheck2Result] = useState(null);
  const [apiConfig, setApiConfig] = useState(() => {
    // Load saved config from localStorage
    const saved = localStorage.getItem('api_config');
    return saved ? JSON.parse(saved) : {
      model: null, // Will use default
      maxTokens: 2000,
      provider: 'openrouter'
    };
  });
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => {
      const next = [...prev, { id: crypto.randomUUID ? crypto.randomUUID() : Date.now(), message, type, timestamp: new Date().toISOString() }];
      return next.slice(-200);
    });
  };

  const clearLogs = () => setLogs([]);

  const updateConfig = (newConfig) => {
    const updated = { ...apiConfig, ...newConfig };
    setApiConfig(updated);
    localStorage.setItem('api_config', JSON.stringify(updated));
  };

  const runCheck1 = async (documentType, specificType, discipline, isDrawing, fileContent) => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = getAPIKey();
      if (!apiKey) {
        throw new Error('API key not found. Please configure it in settings.');
      }

      const provider = detectProvider(apiKey);
      const prompt = buildCheck1Prompt(documentType, specificType, discipline, isDrawing);
      addLog(`▶️ Check-1 started (${provider.toUpperCase()}) for ${discipline} · ${specificType}`);
      
      // Try with current config, fallback to cheaper options on error
      let response;
      try {
        response = await callOpenRouterAPI(prompt, fileContent, apiKey, {
          model: apiConfig.model,
          maxTokens: apiConfig.maxTokens,
          provider: provider
        });
      } catch (err) {
        // If model not found or credit error, try with free models
        if (err.message.includes('No endpoints found') || 
            err.message.includes('model not found') || 
            err.message.includes('not available') ||
            err.message.includes('credits') || 
            err.message.includes('tokens')) {
          console.warn('Model/credit issue detected, trying with free models...');
          addLog('⚠️ Primary model unavailable or credit issue. Trying free-tier fallbacks...', 'warning');
          const cheapModels = getCheapModels(provider);
          // Try free models in order until one works
          let lastError = err;
          for (const freeModel of cheapModels.slice(0, 3)) { // Try first 3 free models
            try {
              response = await callOpenRouterAPI(prompt, fileContent, apiKey, {
                model: freeModel,
                maxTokens: 1500,
                provider: provider
              });
              console.log(`Successfully used model: ${freeModel}`);
              addLog(`✅ Switched to model: ${freeModel}`, 'success');
              break; // Success, exit loop
            } catch (fallbackErr) {
              lastError = fallbackErr;
              console.warn(`Model ${freeModel} failed, trying next...`);
              addLog(`⚠️ Model ${freeModel} failed (${fallbackErr.message}).`, 'warning');
            }
          }
          if (!response) {
            throw lastError; // All models failed
          }
        } else {
          throw err;
        }
      }
      
      const score = parseScoreFromResponse(response) || null;
      addLog(`✅ Check-1 completed. Parsed score: ${score !== null ? score.toFixed(1) + '%' : 'N/A'}`, 'success');
      
      const result = {
        response,
        score,
        timestamp: new Date().toISOString()
      };

      setCheck1Result(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to run Check-1 analysis';
      setError(errorMessage);
      addLog(`❌ Check-1 failed: ${errorMessage}`, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const runCheck2 = async (documentType, specificType, discipline, isDrawing, fileContent) => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = getAPIKey();
      if (!apiKey) {
        throw new Error('API key not found. Please configure it in settings.');
      }

      const provider = detectProvider(apiKey);
      const prompt = buildCheck2Prompt(documentType, specificType, discipline, isDrawing);
      addLog(`▶️ Check-2 started (${provider.toUpperCase()}) focusing on technical QA/QC`);
      
      // Try with current config, fallback to cheaper options on error
      let response;
      try {
        response = await callOpenRouterAPI(prompt, fileContent, apiKey, {
          model: apiConfig.model,
          maxTokens: apiConfig.maxTokens,
          provider: provider
        });
      } catch (err) {
        // If model not found or credit error, try with free models
        if (err.message.includes('No endpoints found') || 
            err.message.includes('model not found') || 
            err.message.includes('not available') ||
            err.message.includes('credits') || 
            err.message.includes('tokens')) {
          console.warn('Model/credit issue detected, trying with free models...');
          addLog('⚠️ Model/credit issue during Check-2. Rolling over to free models...', 'warning');
          const cheapModels = getCheapModels(provider);
          // Try free models in order until one works
          let lastError = err;
          for (const freeModel of cheapModels.slice(0, 3)) { // Try first 3 free models
            try {
              response = await callOpenRouterAPI(prompt, fileContent, apiKey, {
                model: freeModel,
                maxTokens: 1500,
                provider: provider
              });
              console.log(`Successfully used model: ${freeModel}`);
              addLog(`✅ Switched to model: ${freeModel}`, 'success');
              break; // Success, exit loop
            } catch (fallbackErr) {
              lastError = fallbackErr;
              console.warn(`Model ${freeModel} failed, trying next...`);
              addLog(`⚠️ Model ${freeModel} failed (${fallbackErr.message}).`, 'warning');
            }
          }
          if (!response) {
            throw lastError; // All models failed
          }
        } else {
          throw err;
        }
      }
      
      const score = parseScoreFromResponse(response) || null;
      addLog(`✅ Check-2 completed. Parsed score: ${score !== null ? score.toFixed(1) + '%' : 'N/A'}`, 'success');
      
      const result = {
        response,
        score,
        timestamp: new Date().toISOString()
      };

      setCheck2Result(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to run Check-2 analysis';
      setError(errorMessage);
      addLog(`❌ Check-2 failed: ${errorMessage}`, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const runBothChecks = async (documentType, specificType, discipline, isDrawing, fileContent) => {
    setLoading(true);
    setError(null);

    try {
      // Run checks sequentially to avoid overwhelming the API
      addLog(`🚀 Launching QC analysis for ${documentType} (${specificType}) in ${discipline}`, 'info');
      const check1 = await runCheck1(documentType, specificType, discipline, isDrawing, fileContent);
      const check2 = await runCheck2(documentType, specificType, discipline, isDrawing, fileContent);
      addLog('🏁 QC analysis complete. Generating report...', 'success');

      return { check1, check2 };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCheck1Result(null);
    setCheck2Result(null);
    setError(null);
    setLoading(false);
    clearLogs();
  };

  return {
    runCheck1,
    runCheck2,
    runBothChecks,
    check1Result,
    check2Result,
    loading,
    error,
    reset,
    apiConfig,
    updateConfig,
    logs,
    clearLogs,
    addLog
  };
}
