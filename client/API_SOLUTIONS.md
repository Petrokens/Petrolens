# API Solutions for Token/Credit Limits

## Problem
You're getting an error: "This request requires more credits, or fewer max_tokens. You requested up to 8000 tokens, but can only afford 2331."

## Solutions Implemented

### 1. **Reduced Default Token Limit** ✅
- Changed from `max_tokens: 8000` to `max_tokens: 2000`
- Automatically fits within free tier limits
- Configurable in API Settings

### 2. **Cheaper Model Support** ✅
- Default model changed to `google/gemini-flash-1.5` (cheaper)
- Automatic fallback to free models when credits are low
- Free models available:
  - `meta-llama/llama-3.2-3b-instruct:free`
  - `mistralai/mistral-7b-instruct:free`
  - `openchat/openchat-7b:free`
  - `qwen/qwen-2-7b-instruct:free`

### 3. **Multiple API Provider Support** ✅
- **OpenRouter** (default) - Access to multiple models
- **OpenAI Direct** - Use your OpenAI API key directly
- **Anthropic Direct** - Use your Anthropic API key directly

### 4. **Automatic Error Recovery** ✅
- If credit error occurs, automatically retries with:
  - Cheaper model
  - Lower token limit (1500)
  - Reduced content size

### 5. **Configurable Settings** ✅
- Click "⚙️ API Settings" button on Upload page
- Adjust:
  - Max tokens (recommended: 1500-2000 for free tier)
  - Model selection
  - API provider
  - API key

## Quick Fixes

### Option 1: Use Free Model (Recommended - Default)
The app now defaults to `meta-llama/llama-3.2-3b-instruct:free` which is FREE and reliable.

If you get "No endpoints found" error:
1. Click "⚙️ API Settings" on Upload page
2. Select model: `meta-llama/llama-3.2-3b-instruct:free` (FREE)
3. Or try: `mistralai/mistral-7b-instruct:free` (FREE)
4. Set max_tokens: `1500`
5. Save and try again

The app will automatically try free models if your selected model fails.

### Option 2: Reduce Token Usage
1. Open API Settings
2. Set max_tokens to `1500` or `2000`
3. Save and retry

### Option 3: Add Credits
- Visit https://openrouter.ai/settings/credits
- Add credits to your account
- Then you can use higher token limits

### Option 4: Use Alternative API
- Get OpenAI API key: https://platform.openai.com/api-keys
- Or Anthropic API key: https://console.anthropic.com/
- Set in API Settings → Provider → Select provider
- Enter your API key

## Cost Comparison

| Model | Cost per 1K tokens | Quality | Status |
|-------|-------------------|---------|--------|
| `meta-llama/llama-3.2-3b-instruct:free` | FREE | Good | ✅ Default |
| `mistralai/mistral-7b-instruct:free` | FREE | Good | ✅ Available |
| `openchat/openchat-7b:free` | FREE | Good | ✅ Available |
| `qwen/qwen-2-7b-instruct:free` | FREE | Good | ✅ Available |
| `gpt-3.5-turbo` | Low | Excellent | ✅ Available |
| `claude-3-haiku` | Low | Excellent | ✅ Available |
| `claude-3.5-sonnet` | High | Excellent | ✅ Available |
| `google/gemini-flash-1.5` | Very Low | Excellent | ❌ Not available on OpenRouter |

## Recommended Settings for Free Tier

**Default (Automatic):**
- The app now defaults to `meta-llama/llama-3.2-3b-instruct:free`
- Automatically tries free models if one fails
- Max tokens: 2000 (reduced to 1500 on fallback)

**Manual Configuration:**
```javascript
{
  model: "meta-llama/llama-3.2-3b-instruct:free", // FREE
  maxTokens: 1500,
  provider: "openrouter"
}
```

**Alternative Free Models:**
- `mistralai/mistral-7b-instruct:free`
- `openchat/openchat-7b:free`
- `qwen/qwen-2-7b-instruct:free`

## Troubleshooting

### Still getting credit errors?
1. Check your OpenRouter account credits: https://openrouter.ai/settings/credits
2. Try a free model (see list above)
3. Reduce max_tokens to 1000
4. Reduce document content size (currently limited to 20,000 chars)

### Model not responding?
- Some free models may have rate limits
- Try a different free model
- Or use a paid but cheaper model like `google/gemini-flash-1.5`

### Want better quality?
- Use `google/gemini-flash-1.5` (cheap, excellent quality)
- Or `gpt-3.5-turbo` (low cost, excellent)
- Increase max_tokens to 3000-4000 if you have credits

## API Key Formats

- **OpenRouter**: `sk-or-v1-...`
- **OpenAI**: `sk-...` (not starting with `sk-or-`)
- **Anthropic**: `sk-ant-...`

The app automatically detects the provider from your key format.

