# Oshi3 Nihonto Web App - Deployment Guide

## Overview

Simple web application that allows users to:
1. Upload a JPG image of a sword catalog description (setsumei)
2. Select their preferred translation model
3. Get instant Japanese OCR + English translation
4. Toggle between Japanese and English views

## Architecture

- **Frontend:** Vanilla HTML/CSS/JavaScript (no build step needed)
- **Backend:** Netlify Serverless Functions
- **APIs:** Google Cloud Vision (OCR) + OpenRouter (LLM translation)

## Prerequisites

1. Netlify account (you already have this set up)
2. Google Cloud Vision API credentials
3. OpenRouter API key

## Local Development

### 1. Install dependencies

```bash
cd webapp
npm install
```

### 2. Set up environment variables

Create a `.env` file in the `webapp` directory:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/Users/christopherhill/.gcp/oshi3-vision-key.json
OPENROUTER_API_KEY=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
```

### 3. Run locally

```bash
npm run dev
```

This will start Netlify Dev at http://localhost:8888

### 4. Test the application

1. Open http://localhost:8888 in your browser
2. Upload a test image (e.g., one of the extracted setsumei images)
3. Select a translation model
4. Click "Translate"
5. Verify you see both Japanese and English outputs

## Deploy to Netlify

### Option 1: Deploy from CLI

```bash
# First time: link to Netlify site
netlify link

# Deploy to production
npm run deploy
```

### Option 2: Deploy from GitHub (Recommended)

1. Create a new repository on GitHub for the webapp:
   ```bash
   cd webapp
   git init
   git add .
   git commit -m "Initial commit: Oshi3 Nihonto webapp"
   git branch -M main
   git remote add origin https://github.com/0raclide/oshi3-webapp.git
   git push -u origin main
   ```

2. Connect to Netlify:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub → Select your `oshi3-webapp` repository
   - Configure build settings:
     - Build command: `echo 'No build needed'`
     - Publish directory: `public`
     - Functions directory: `netlify/functions`

3. Set environment variables in Netlify:
   - Go to Site settings → Environment variables
   - Add:
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
     - `GOOGLE_APPLICATION_CREDENTIALS`: *See note below*

**Important: Google Cloud Credentials on Netlify**

Netlify doesn't support file-based credentials. You need to convert to base64:

```bash
base64 -i /Users/christopherhill/.gcp/oshi3-vision-key.json
```

Then update the function to use credentials from environment variable:

In `netlify/functions/translate.js`, replace:
```javascript
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
```

With:
```javascript
const visionClient = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString()
  )
});
```

Then set `GOOGLE_CREDENTIALS_BASE64` as the environment variable in Netlify.

## Testing with Community

### Share the URL

Once deployed, share the Netlify URL with your community (e.g., https://oshi3-nihonto.netlify.app)

### Gather Feedback

Ask users to test:
1. **Upload experience:** Is drag-and-drop intuitive?
2. **Model selection:** Do they understand the trade-offs?
3. **Translation quality:** Are translations complete and accurate?
4. **Missing details:** What information is being omitted?
5. **Speed:** Is 30-60 seconds acceptable?
6. **Interface:** Is the toggle between Japanese/English useful?

### Feedback Collection

Consider adding:
- A feedback form at the bottom of the page
- Google Forms link
- Email address for bug reports
- GitHub Issues link

## Cost Monitoring

Each translation costs:
- GCV OCR: $0.0015
- Claude OCR Correction: ~$0.015
- Translation model: $0.017-$0.046 depending on choice

If 100 community members each test 5 images:
- 500 translations × $0.03-$0.06 = $15-$30 total

Set up usage alerts in:
- Google Cloud Console (for Vision API)
- OpenRouter dashboard (for LLM calls)

## Troubleshooting

### Function timeout
If translations take too long, Netlify functions timeout at 10 seconds (free tier) or 26 seconds (Pro tier). You may need to upgrade or optimize.

### CORS errors
Already handled in function with proper headers. If issues persist, check Netlify deploy logs.

### Out of memory
Netlify functions have 1GB memory limit. Image processing should be fine, but monitor logs.

### API rate limits
- OpenRouter: Check your rate limits
- Google Cloud Vision: Default is 1800 requests/minute

## Next Steps After Feedback

1. **Collect feedback** for 1-2 weeks
2. **Analyze common issues:**
   - Are measurements accurate?
   - Is historical context preserved?
   - Are technical terms translated correctly?
3. **Refine prompts** based on feedback
4. **Test model alternatives** if GPT-5.2 is too expensive
5. **Add features:**
   - Save translations
   - Batch upload
   - Export to PDF
   - Metadata extraction display
6. **Scale to 13,000 items** once satisfied with quality

## URLs

- **Local Dev:** http://localhost:8888
- **Production:** Will be assigned by Netlify (e.g., https://oshi3-nihonto.netlify.app)
- **GitHub Repo:** https://github.com/0raclide/oshi3-webapp (to be created)
