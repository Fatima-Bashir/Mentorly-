# @author: fatima bashir
# OpenAI API Key Setup for Resume Analysis

## Quick Setup Instructions

The ATS Resume Optimizer needs an OpenAI API key to provide AI-powered resume analysis.

### Step 1: Get Your OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in to your OpenAI account  
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### Step 2: Set Up Environment Variable
Create a file called `.env.local` in the `apps/web` directory with:

```
OPENAI_API_KEY=sk-your_actual_api_key_here
```

Replace `sk-your_actual_api_key_here` with your real API key.

### Step 3: Restart Development Server
```bash
npm run dev
# or
pnpm dev
```

## Without API Key
If you don't set up the API key, the system will automatically use a fallback analysis system that provides basic resume scoring and tips without AI features.

## Troubleshooting
- Make sure your API key starts with `sk-`
- Ensure `.env.local` is in the `apps/web` directory
- Restart your development server after adding the key
- Check the browser console for API key status logs

