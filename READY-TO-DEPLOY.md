# ✅ Ready to Deploy!

Your webapp is now configured with the new API key and ready to deploy to Netlify.

## ✅ Configuration Complete

- ✅ New OpenRouter API key configured locally
- ✅ `.env` files properly gitignored
- ✅ GitHub repository clean and secure
- ✅ All dependencies installed

## 🚀 Deploy to Netlify (5 minutes)

### Step 1: Go to Netlify

Visit: https://app.netlify.com

### Step 2: Import from GitHub

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub**
3. Select repository: **0raclide/oshi3-webapp**
4. Configure settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions`
5. Click **"Deploy site"**

### Step 3: Set Environment Variables

After the first deploy, go to: **Site settings → Environment variables**

Add these 2 variables:

**1. OPENROUTER_API_KEY**
```
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
```

**2. GOOGLE_CREDENTIALS_BASE64**

Generate the base64 value:
```bash
base64 -i /Users/christopherhill/.gcp/oshi3-vision-key.json | tr -d '\n'
```

Copy the output and paste as the value.

### Step 4: Update Function Code

Edit `netlify/functions/translate.js` on GitHub or locally:

**Replace lines 5-7:**
```javascript
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
```

**With:**
```javascript
const visionClient = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString()
  )
});
```

**Commit and push:**
```bash
cd /Users/christopherhill/Desktop/Claude_project/Oshi3/webapp
git add netlify/functions/translate.js
git commit -m "Use base64 credentials for Netlify deployment"
git push origin main
```

Netlify will automatically redeploy.

### Step 5: Get Your Live URL

Netlify will assign a URL like:
```
https://oshi3-webapp-[random].netlify.app
```

Or set a custom domain in: **Site settings → Domain management**

## 🧪 Test Your Deployment

1. Visit your Netlify URL
2. Upload a test image (use one from `extracted/` directory)
3. Select a translation model (try GPT-5.2 first)
4. Click "Translate"
5. Verify:
   - ✅ Japanese OCR appears in the Japanese tab
   - ✅ English translation appears in the English tab
   - ✅ Can toggle between tabs
   - ✅ Translations look accurate and complete

### Test Images Available

Use these from your project:
```bash
# Item 1 - Kunitomo (Ground truth: nagasa=74.2cm)
/Users/christopherhill/Desktop/Claude_project/Oshi3/extracted/vol1_test/page-06.jpg

# Item 2 - Rai Kunitoshi (Ground truth: nagasa=73.3cm)
/Users/christopherhill/Desktop/Claude_project/Oshi3/extracted/vol1_test/page-08.jpg

# Item 3 - Ryōkai (Ground truth: nagasa=80.3cm)
/Users/christopherhill/Desktop/Claude_project/Oshi3/extracted/vol1_item3/page-10.jpg
```

## 📊 Monitor Costs

Set up alerts in:
- **OpenRouter:** https://openrouter.ai/dashboard
- **Google Cloud:** https://console.cloud.google.com/billing

Expected costs for community testing:
- **50 users × 3 images** = 150 translations
- **Cost range:** $4.50 - $9.00 total

## 📣 Share with Community

Once tested and working, share your Netlify URL with your community:

**Sample announcement:**

---

🗡️ **New Tool: Japanese Sword Catalog Translator**

I've built a web app to translate *Juyo Zufu* catalog pages:
👉 https://your-app.netlify.app

**Features:**
- Upload any setsumei (description page) image
- Choose from 4 AI translation models
- Get instant Japanese OCR + English translation
- Toggle between Japanese and English views

**I need your help testing it!**
1. Try translating a few catalog images
2. Check if translations are accurate and complete
3. Verify measurements match the catalog
4. Report any missing details or errors
5. Let me know which model works best

Your feedback will help us translate all 13,000 items in the catalog!

---

## 📋 Gather Feedback

Ask your community to evaluate:
- **Translation accuracy:** Are measurements correct?
- **Completeness:** Is historical context preserved?
- **Technical terms:** Are sword terms translated properly?
- **Missing data:** Any omissions?
- **Model comparison:** Which model is best?
- **Usability:** Is the interface clear?

## 🔄 After Feedback

Based on community input:

1. **Refine prompts** if accuracy issues found
2. **Add features** (batch upload, export, metadata display)
3. **Optimize costs** if needed (adjust default model)
4. **Scale up** to process all 13,000 items
5. **Build search interface** for completed database

## 📚 Documentation

- **Setup Guide:** `README.md`
- **Deployment Details:** `DEPLOY.md`
- **Security Incident:** `SECURITY-INCIDENT.md`
- **This File:** `READY-TO-DEPLOY.md`

## 🎉 You're All Set!

Everything is configured and ready to go. Just follow the steps above to deploy to Netlify and start community testing!

---

**Questions?** Review the documentation or check Netlify's deploy logs for troubleshooting.
