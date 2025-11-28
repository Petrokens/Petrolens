// OpenRouter API integration with multiple provider support

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Cheaper/free models that work with limited credits
// Verified working models on OpenRouter
const CHEAP_MODELS = {
  openrouter: [
    'meta-llama/llama-3.2-3b-instruct:free', // FREE - Most reliable
    'mistralai/mistral-7b-instruct:free', // FREE
    'google/gemini-flash-1.5-8b', // Low cost, if available
    'google/gemini-pro-1.5', // Alternative Gemini
    'openchat/openchat-7b:free', // FREE
    'qwen/qwen-2-7b-instruct:free', // FREE
    'gpt-3.5-turbo', // Low cost via OpenRouter
    'anthropic/claude-3-haiku' // Low cost
  ],
  openai: [
    'gpt-3.5-turbo', // Cheaper option
    'gpt-4o-mini' // Cheaper than gpt-4
  ],
  anthropic: [
    'claude-3-haiku-20240307' // Cheapest Claude model
  ]
};

const DEFAULT_MODEL = 'openai/gpt-4o'; // Premium default model
const DEFAULT_MAX_TOKENS = 200000; // Reduced from 8000 to fit free tier

/**
 * Call OpenRouter API for AI QC analysis
 */
export async function callOpenRouterAPI(prompt, fileContent = '', apiKey, options = {}) {
  if (!apiKey) {
    throw new Error('API key is required. Please set it in .env file or settings.');
  }

  const model = options.model || DEFAULT_MODEL;
  const maxTokens = options.maxTokens || DEFAULT_MAX_TOKENS;
  const provider = options.provider || 'openrouter';

  // Support chunked content for large documents
  // If fileContent is an array, it's chunks; otherwise use full content
  let contentToSend = '';
  
  if (Array.isArray(fileContent)) {
    // Multiple chunks - combine intelligently
    contentToSend = fileContent.join('\n\n--- Next Section ---\n\n');
  } else if (fileContent) {
    // Single content or full document
    // Use larger limit for better analysis (100K chars)
    const contentLimit = options.contentLimit || 100000;
    contentToSend = fileContent.length > contentLimit 
      ? fileContent.substring(0, contentLimit) + '\n\n[Note: Content truncated to first ' + contentLimit + ' characters]'
      : fileContent;
  }

  // Build messages array - support conversation history for chat
  const messages = [];
  
  // Add system prompt (use provided or default)
  const systemPrompt = options.systemPrompt || 
    'You are an expert QA/QC Engineer with 40+ years of experience in EPC projects. Provide detailed, structured QA/QC analysis in the requested format. Be concise but thorough.';
  
  messages.push({
    role: 'system',
    content: systemPrompt
  });
  
  // Add conversation history if provided (for chat)
  if (options.conversationHistory && Array.isArray(options.conversationHistory)) {
    messages.push(...options.conversationHistory);
  }
  
  // Add current user message
  const userMessage = contentToSend
    ? `${prompt}\n\nDocument Content:\n${contentToSend}`
    : prompt;
  
  messages.push({
    role: 'user',
    content: userMessage
  });

  try {
    let response;
    
    if (provider === 'openai' && apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-')) {
      // Direct OpenAI API
      response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.3,
          max_tokens: maxTokens
        })
      });
    } else if (provider === 'anthropic' && apiKey.startsWith('sk-ant-')) {
      // Direct Anthropic API
      response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model || 'claude-3-haiku-20240307',
          max_tokens: maxTokens,
          messages: messages
        })
      });
    } else {
      // OpenRouter API (default)
      response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Petrolenz QC Platform'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.3,
          max_tokens: maxTokens
        })
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
      
      // Handle authentication/user not found errors
      if (errorMessage.includes('User not found') || 
          errorMessage.includes('user not found') ||
          errorMessage.includes('Invalid API key') ||
          errorMessage.includes('invalid api key') ||
          errorMessage.includes('Unauthorized') ||
          response.status === 401 ||
          response.status === 403) {
        throw new Error(
          `API Key Authentication Failed.\n\n` +
          `The API key is invalid, expired, or the user account doesn't exist.\n\n` +
          `Solutions:\n` +
          `1. Check your API key in API Settings (⚙️ button)\n` +
          `2. Get a new API key from:\n` +
          `   - OpenRouter: https://openrouter.ai/keys\n` +
          `   - OpenAI: https://platform.openai.com/api-keys\n` +
          `   - Anthropic: https://console.anthropic.com/\n` +
          `3. Clear localStorage and use a fresh key\n` +
          `4. If using default key, it may have expired - set your own key`
        );
      }
      
      // Handle model not found errors
      if (errorMessage.includes('No endpoints found') || errorMessage.includes('model not found') || errorMessage.includes('not available')) {
        throw new Error(
          `Model "${model}" not available.\n\n` +
          `Please try one of these free models:\n` +
          `- ${CHEAP_MODELS.openrouter[0]}\n` +
          `- ${CHEAP_MODELS.openrouter[1]}\n` +
          `- ${CHEAP_MODELS.openrouter[2]}\n\n` +
          `Or check available models at: https://openrouter.ai/models`
        );
      }
      
      // Handle credit/token limit errors
      if (errorMessage.includes('credits') || errorMessage.includes('tokens')) {
        throw new Error(
          `Insufficient credits. ${errorMessage}\n\n` +
          `Solutions:\n` +
          `1. Reduce max_tokens (currently ${maxTokens})\n` +
          `2. Use a free model: ${CHEAP_MODELS.openrouter[0]}\n` +
          `3. Add credits at https://openrouter.ai/settings/credits`
        );
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Handle different response formats
    let content;
    if (provider === 'anthropic') {
      content = data.content?.[0]?.text || data.content || '';
    } else {
      content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
    }
    
    if (!content) {
      throw new Error('Invalid API response format - no content received');
    }

    return content;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Get API key from environment, localStorage, or default hardcoded key
 */
export function getAPIKey() {
  // Default hardcoded API key (user's key)
  const DEFAULT_API_KEY = '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';
  
  // First try environment variable (set in .env file)
  const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (envKey) return envKey;

  // Fallback to localStorage (user can set it in UI)
  const storedKey = localStorage.getItem('openrouter_api_key');
  if (storedKey) return storedKey;

  // Use default hardcoded key
  return DEFAULT_API_KEY;
}

/**
 * Save API key to localStorage
 */
export function saveAPIKey(apiKey) {
  localStorage.setItem('openrouter_api_key', apiKey);
}

/**
 * Get available cheap/free models
 */
export function getCheapModels(provider = 'openrouter') {
  return CHEAP_MODELS[provider] || CHEAP_MODELS.openrouter;
}

/**
 * Detect API provider from key format
 */
export function detectProvider(apiKey) {
  if (!apiKey) return 'openrouter';
  if (apiKey.startsWith('sk-ant-')) return 'anthropic';
  if (apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-')) return 'openai';
  return 'openrouter';
}

/**
 * Test API key by making a simple request
 * Returns { valid: boolean, message: string, provider: string }
 */
export async function testAPIKey(apiKey) {
  if (!apiKey) {
    return {
      valid: false,
      message: 'No API key provided',
      provider: null
    };
  }

  const provider = detectProvider(apiKey);
  
  try {
    // Make a minimal test request
    const testPrompt = 'Say "OK" if you can read this.';
    const response = await callOpenRouterAPI(
      testPrompt,
      '',
      apiKey,
      {
        model: provider === 'openrouter' ? DEFAULT_MODEL : null,
        maxTokens: 10,
        provider: provider
      }
    );

    return {
      valid: true,
      message: `✅ API key is valid! (${provider.toUpperCase()})`,
      provider: provider,
      testResponse: response
    };
  } catch (error) {
    let message = error.message;
    
    // Provide specific guidance based on error
    if (error.message.includes('API Key Authentication Failed') ||
        error.message.includes('User not found') ||
        error.message.includes('Invalid API key') ||
        error.message.includes('Unauthorized')) {
      message = `❌ API key is invalid or expired.\n\n${error.message}`;
    } else if (error.message.includes('credits') || error.message.includes('tokens')) {
      message = `⚠️ API key is valid but has insufficient credits.\n\n${error.message}`;
    } else {
      message = `❌ API key test failed: ${error.message}`;
    }

    return {
      valid: false,
      message: message,
      provider: provider,
      error: error.message
    };
  }
}

