// API Settings Component for configuring API options

import { useState, useEffect } from 'react';
import { getCheapModels, detectProvider } from '../../api/openRouter.js';
import './APISettings.css';

import { getAPIKey } from '../../api/openRouter.js';

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
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setUsingDefaultKey(false);
            }}
            placeholder={usingDefaultKey ? "Leave empty to use default key" : "Enter your API key"}
          />
          <small>Detected provider: {provider} {usingDefaultKey && '(using default key)'}</small>
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

