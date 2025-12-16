# 🗡️ Oshi3 Nihonto Translation Web App

Simple, beautiful web application for translating Japanese sword catalog images.

## Features

- 📤 **Drag & drop** image upload
- 🤖 **Multiple AI models** - Choose between GPT-5.2, Claude, Qwen, DeepSeek
- 🔄 **Toggle views** - Switch between Japanese OCR and English translation
- ⚡ **Fast processing** - 30-60 seconds per translation
- 💰 **Cost transparent** - See pricing for each model

## Quick Start

### 1. Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/0raclide/oshi3-webapp)

Or manually:

1. Push this directory to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Configure:
   - Build command: (leave empty)
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

### 2. Set Environment Variables

In Netlify dashboard → Site settings → Environment variables:

1. **OPENROUTER_API_KEY** - Your OpenRouter API key
2. **GOOGLE_CREDENTIALS_BASE64** - Base64-encoded Google Cloud Vision credentials

To generate the base64 credentials:

```bash
base64 -i ~/.gcp/oshi3-vision-key.json | tr -d '\n'
```

Then update `netlify/functions/translate.js` line 5-9 to:

```javascript
const visionClient = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString()
  )
});
```

### 3. Test

Visit your Netlify URL and upload a test image!

## Local Development

```bash
# Install dependencies
npm install

# Install Netlify CLI globally
npm install -g netlify-cli

# Run locally
netlify dev
```

Visit http://localhost:8888

## How It Works

### 3-Step Pipeline

1. **Google Cloud Vision OCR** - Extract Japanese text from image ($0.0015/image)
2. **Claude 3.5 Sonnet Correction** - Fix OCR errors using vision model ($0.015/image)
3. **Translation Model** - Translate to English ($0.017-$0.046/image depending on model)

Total: ~30-60 seconds, $0.03-$0.06 per image

### Models Available

| Model | Quality | Speed | Cost/item |
|-------|---------|-------|-----------|
| **GPT-5.2** | ⭐⭐⭐⭐⭐ | Medium | $0.046 |
| **Claude Sonnet 4.5** | ⭐⭐⭐⭐⭐ | Medium | $0.043 |
| **Qwen 2.5 72B** | ⭐⭐⭐⭐ | Fast | $0.017 |
| **DeepSeek V3.2** | ⭐⭐⭐ | Fast | $0.018 |

## Community Testing

Share with your community and gather feedback on:

- ✅ Translation completeness
- ✅ Measurement accuracy
- ✅ Technical term translation
- ✅ Historical context preservation
- ✅ User interface

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no framework overhead)
- **Backend:** Netlify Serverless Functions
- **APIs:** Google Cloud Vision + OpenRouter
- **Deployment:** Netlify (free tier works!)

## Project Structure

```
webapp/
├── public/
│   └── index.html          # Frontend UI
├── netlify/
│   └── functions/
│       └── translate.js    # Translation pipeline
├── netlify.toml           # Netlify configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## Cost Monitoring

For 100 users × 5 tests each = 500 translations:
- Minimum: 500 × $0.03 = **$15**
- Maximum: 500 × $0.06 = **$30**

Set up alerts in:
- Google Cloud Console (Vision API usage)
- OpenRouter dashboard (LLM usage)

## Next Steps

After gathering feedback:

1. Refine translation prompts based on accuracy issues
2. Add metadata extraction and display
3. Implement batch upload for multiple images
4. Add export functionality (PDF, CSV)
5. Scale to process all 13,000 catalog items

## License

MIT

## Contact

Questions? Open an issue on GitHub or contact the project maintainer.
