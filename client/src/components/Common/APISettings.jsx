// API Settings Component for configuring API options

import { useState, useEffect } from 'react';
import { getCheapModels, detectProvider, testAPIKey, getAPIKey as getCurrentAPIKey } from '../../api/openRouter.js';
import './APISettings.css';

export function APISettings({ apiConfig, onConfigChange, onClose }) {
  const [localConfig, setLocalConfig] = useState(apiConfig);
  const [apiKey, setApiKey] = useState(() => {
    // Get current API key (includes default hardcoded key)
    const currentKey = getAPIKey();
    // Only show user-set keys, not the default
    const storedKey = localStorage.getItem('openrouter_api_key');
    return storedKey || import.meta.env.VITE_OPENROUTER_API_KEY || '';
  });
  const [usingDefaultKey, setUsingDefaultKey] = useState(() => {
    const storedKey = localStorage.getItem('openrouter_api_key');
    const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    return !storedKey && !envKey; // Using default if no stored or env key
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    setLocalConfig(apiConfig);
  }, [apiConfig]);

  const handleSave = () => {
    onConfigChange(localConfig);
    if (apiKey) {
      localStorage.setItem('openrouter_api_key', apiKey);
    }
    if (onClose) onClose();
  };

  const handleTestKey = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      // Use the key from input, or fallback to current key
      const keyToTest = apiKey || getCurrentAPIKey();
      const result = await testAPIKey(keyToTest);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        valid: false,
        message: `Test failed: ${error.message}`,
        provider: detectProvider(apiKey || getCurrentAPIKey())
      });
    } finally {
      setTesting(false);
    }
  };

  const provider = detectProvider(apiKey);
  const cheapModels = getCheapModels(provider);

  return (
    <div className="api-settings-overlay" onClick={onClose}>
      <div className="api-settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2>API Configuration</h2>
        
        <div className="settings-section">
          <label>API Key:</label>
          {usingDefaultKey && (
            <div style={{ 
              padding: '8px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '4px', 
              marginBottom: '8px',
              fontSize: '0.875rem'
            }}>
              ✓ Using default API key (configured in code)
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setUsingDefaultKey(false);
                setTestResult(null); // Clear test result when key changes
              }}
              placeholder={usingDefaultKey ? "Leave empty to use default key" : "Enter your API key"}
              style={{ flex: 1 }}
            />
            <button
              onClick={handleTestKey}
              disabled={testing}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: testing ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              {testing ? 'Testing...' : 'Test Key'}
            </button>
          </div>
          <small>Detected provider: {provider} {usingDefaultKey && '(using default key)'}</small>
          {testResult && (
            <div style={{
              marginTop: '8px',
              padding: '8px',
              backgroundColor: testResult.valid ? '#e8f5e9' : '#ffebee',
              borderRadius: '4px',
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap',
              color: testResult.valid ? '#2e7d32' : '#c62828'
            }}>
              {testResult.message}
            </div>
          )}
        </div>

        <div className="settings-section">
          <label>Model:</label>
          <select
            value={localConfig.model || ''}
            onChange={(e) => setLocalConfig({ ...localConfig, model: e.target.value || null })}
          >
            <option value="">Default (Auto-select cheapest)</option>
            {cheapModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        <div className="settings-section">
          <label>Max Tokens:</label>
          <input
            type="number"
            min="500"
            max="8000"
            step="100"
            value={localConfig.maxTokens}
            onChange={(e) => setLocalConfig({ ...localConfig, maxTokens: parseInt(e.target.value) || 2000 })}
          />
          <small>Lower = cheaper. Recommended: 1500-2000 for free tier</small>
        </div>

        <div className="settings-section">
          <label>Provider:</label>
          <select
            value={localConfig.provider}
            onChange={(e) => setLocalConfig({ ...localConfig, provider: e.target.value })}
          >
            <option value="openrouter">OpenRouter</option>
            <option value="openai">OpenAI (Direct)</option>
            <option value="anthropic">Anthropic (Direct)</option>
          </select>
        </div>

        <div className="settings-actions">
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>

        <div className="settings-info">
          <h3>Tips to Reduce Costs:</h3>
          <ul>
            <li>Use max_tokens: 1500-2000 for free tier</li>
            <li>Try free models: {cheapModels[0]}</li>
            <li>Reduce document content size</li>
            <li>Run checks separately instead of both at once</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

