# 🚀 Final Setup Steps (5 minutes)

Your webapp is 95% deployed! Just need to complete the GitHub connection and add environment variables.

## Current Status

✅ Netlify site created: https://oshi3-nihonto.netlify.app
✅ GitHub repository: https://github.com/0raclide/oshi3-webapp
✅ Function code updated for deployment
⏳ **Need:** Connect GitHub + Add environment variables

## Step 1: Connect GitHub to Netlify

The site was created but needs GitHub authorization.

### Option A: Reconnect via Netlify Dashboard (Easiest)

1. **I've opened your Netlify dashboard** - you should see it in your browser
   - If not, go to: https://app.netlify.com/sites/oshi3-nihonto/settings/general

2. **Scroll down to "Build & deploy"**

3. **Click "Link site to Git"**

4. **Choose "GitHub"**

5. **Authorize Netlify** (if prompted)

6. **Select repository:** `0raclide/oshi3-webapp`

7. **Configure:**
   - Branch: `main`
   - Build command: (leave empty)
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

8. **Click "Save"**

### Option B: Delete & Recreate Site (If Option A doesn't work)

1. Go to: https://app.netlify.com/sites/oshi3-nihonto/settings/general
2. Scroll to bottom → "Delete site"
3. Then create new site:
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub → `0raclide/oshi3-webapp`
   - Configure as above

## Step 2: Add Environment Variables

**I've also opened this page:** https://app.netlify.com/sites/oshi3-nihonto/configuration/env

Add these TWO variables:

### Variable 1: OPENROUTER_API_KEY

Click "Add a variable":
- **Key:** `OPENROUTER_API_KEY`
- **Value:**
  ```
  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
  ```
- **Scopes:** Check all boxes (builds, functions, runtime, post-processing)
- Click "Create variable"

### Variable 2: GOOGLE_CREDENTIALS_BASE64

Click "Add a variable" again:
- **Key:** `GOOGLE_CREDENTIALS_BASE64`
- **Value:**
  ```
  ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAic2V2ZW50aC1ib3RhbnktNDgxNDEzLXIyIiwKICAicHJpdmF0ZV9rZXlfaWQiOiAiOTVjMmRjYjlkNDZkMTI2OWM0N2Q1OWQ1NmExZjNiYTQ3OTBjNzZmYSIsCiAgInByaXZhdGVfa2V5IjogIi0tLS0tQkVHSU4gUFJJVkFURSBLRVktLS0tLVxuTUlJRXZRSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS2N3Z2dTakFnRUFBb0lCQVFERDVwRWNqei9FdjhDeFxuS0pXSmQxT0pJVDI0eEZhUzFyNTB6NzBlUHU4dnlLdkRtM28xV2ZCUFYveGFHc3lLYmd5c2hlT2Y2Z294dVN3S1xuWHk3MDBnTVBEM3RMbDFWajdOQTV2T1RWK016c241a0h4L01vQVpYeituS0tvbE1Cdzc3d204YnJMY0ptYVpxQVxuRWZ0RlZIeXlOTHdHT3crcXlKU1RRRDU5cDFtVVRXYXA5emYwNnpwMUxyY3ppVlRBaThZc1VPcW4zWG4wVzdzc1xucFVTVVdTVGdhNGhRU1lEK244N1AzRnlhUStJSUt4bWdPMnYyamlaZVp1cWVidHY3VTR0VHlZUTVtMFQ3eU5HaFxuc2pieHVBVHJ6amQvUkdCSXhFMlgxZW1WRlNCZEJUOG9nYXhRRVBDTXpsdWNPaWhyL0o3YlRWY2JETE5MRW11UVxucWFVTjA0d2hBZ01CQUFFQ2dnRUFCazBZUmM3bHdqSll4Rm9GMVZJZFFiL3IrRkY0WjJpNDM1RC9DRVlGODRlRVxuM3RuVmFIbm9IT1U3bkxwWDhldndSR3hhRWY2NUxUaERqbUhaWk02TWdxT0ExOEdhWVlod2VpcjFRVnlyV3NFWFxuYndTamNabjdkTW1OZmFBVEEyK0VhTURaK1I2VHJpK2ZaSmN2ZWQ5cDAyR1cycXh6cUk2akdNbHNPU1owM3l3L1xudnhKMjJjTFRab3p1bjA3MkE4NVljRXplQ0NjTWhFUUdTVUN6YnJWdGFoRFpxMENLcldzOUszbTFHWkt2TjNsZ1xueGRtRzdHVmRPcTZ1N1dWQ0lPbzRHeXAwSVZIWTFwVXo5WnlqNy9MM1lybUhvRml1S3lyd1VybUVER3daWjdtNVxud0V3UmVtU3dvUnB3T1RieTZUS21TenNKMFVvVjEwZ3lFQlpjVG5FNVFRS0JnUUR0RW9odWNMR0FxTXo5L1hXaFxuUFhhcXBRT0tNQmNLREQvOXkvTTBjS1RhdE0rMktkNDZWdGlqSUtiaEgrYURyS0ZWWWp0VjJ0Sys4c0l3MkRmMlxuemxKaENNZUpYQ3o0ekkwUUx2MXJUU24vNUttb2tBRUwybk42WXZFRGh5MUp1S2ZlRk1rL3Y1NmJNSUJVOGNKMlxuZnc1ZzdRRklDbFBXeTRXZFZmTUJOWVQ5alFLQmdRRFRpb2pKQU4xSjU0dGJiYitBcC9VRVlFZzhaYXVqZXpzQlxuT3UyNnQwWUJYZHFFYWloOXkzMzlzVW5Ra3lwRVdZWFp0YlN5eHl4a0E3TWFic0RwU0thd01taVFCZjdMWjFXdFxuck96MDNJMGcvMEpqOVlwdXJrMThpYTRuNGlzamFpMllOWURVdEoydmZ1aFczQjNRQm55aVFhLy85M2xVellMdFxuU0wvU1laZng1UUtCZ0RsK295UFZwTmJGR1dJSDFEMVVnTEVGOEFQVmdlRG44NlVEajJvS1g1RERCUlR5dG5pRFxuazJxTWdxeGFaamRNNkp1aWhTMWZNbmtvdXJ2SjFGakExTzIvaVZUZ3krOVMvR3NPV2x0cGpXUUgrclZzcHpST1xudUc3WURBZUZBeEM3L2NvNFZFNW5sSG1pbTV6K1BPRXNFenFpZ0FzT3BpS1RuVVg1RUVRY3pMSUpBb0dBQ3p1WFxuOTlScjY3aTMxYXNHT0RheTlBQ0kxV3d3cVFXcUpHNlVvUTJLVWhoQnVqWkk0Q1VtRTRxT2VOelhxYmwzT2hCRVxuQUJwRGFTd3BIb1l6Q0RBcmFiL0RmYUpUM1VrbmE0bDdLNlZxZVE0VTRHbnhaOThwaml0aGJBeStiYXI5c005bVxuZitUM1dwSktsQklzSXhlMUZvaVdaK2trTURTWmR6QWR2M1lmTTJFQ2dZRUFpWlc1cFJwYi9Nb042aG84RDlXVFxuZGRBalZxVXFJK3dvWnYrbkx0dnBaNDZzb1ZwQWpvVVRtM3d4eUsvbDFXQmd4dWhRa1dJa1lyaDgxQU4xRWszUVxuS1VLNDNXY3RHWllXOGFoc2hYcVJlZTVnS25ERDJJd0daMkZpNC9mUjRMTldUL2dIcm1jNVNyTmVTQ0dIditDK1xuSTJ3R3lTOERnTjk5TFBWVk9JdHFScWc9XG4tLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tXG4iLAogICJjbGllbnRfZW1haWwiOiAiaWQtb3NoaTMtdmlzaW9uLW9jckBzZXZlbnRoLWJvdGFueS00ODE0MTMtcjIuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJjbGllbnRfaWQiOiAiMTA3NTk4NTkzOTcwNTkxNDczNzU0IiwKICAiYXV0aF91cmkiOiAiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGgiLAogICJ0b2tlbl91cmkiOiAiaHR0cHM6Ly9vYXV0aDIuZ29vZ2xlYXBpcy5jb20vdG9rZW4iLAogICJhdXRoX3Byb3ZpZGVyX3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YxL2NlcnRzIiwKICAiY2xpZW50X3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vcm9ib3QvdjEvbWV0YWRhdGEveDUwOS9pZC1vc2hpMy12aXNpb24tb2NyJTQwc2V2ZW50aC1ib3RhbnktNDgxNDEzLXIyLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAidW5pdmVyc2VfZG9tYWluIjogImdvb2dsZWFwaXMuY29tIgp9Cg==
  ```
- **Scopes:** Check all boxes
- Click "Create variable"

## Step 3: Trigger Deploy

After both variables are added:

1. Go to: https://app.netlify.com/sites/oshi3-nihonto/deploys
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait 1-2 minutes for build to complete

## Step 4: Test!

Once deployed:

1. Visit: **https://oshi3-nihonto.netlify.app**
2. Upload a test image (setsumei page)
3. Select "GPT-5.2" model
4. Click "Translate"
5. Verify Japanese OCR and English translation appear

### Test Images Available

```bash
# Item 1 - Kunitomo
/Users/christopherhill/Desktop/Claude_project/Oshi3/extracted/vol1_test/page-06.jpg

# Item 2 - Rai Kunitoshi
/Users/christopherhill/Desktop/Claude_project/Oshi3/extracted/vol1_test/page-08.jpg

# Item 3 - Ryōkai
/Users/christopherhill/Desktop/Claude_project/Oshi3/extracted/vol1_item3/page-10.jpg
```

## 🎉 Share with Community!

Once working, share this with your community:

---

🗡️ **Japanese Sword Catalog Translator**
https://oshi3-nihonto.netlify.app

Help test our new translation tool!

**Features:**
- Upload any setsumei (catalog description) image
- Choose from 4 AI translation models
- Get instant Japanese OCR + English translation
- Toggle between Japanese and English views

**Please test and provide feedback on:**
- Translation accuracy (especially measurements)
- Completeness (any missing details?)
- Technical terminology
- User interface

Your feedback will help us translate all 13,000 catalog items!

---

## 📊 Monitor Costs

- **OpenRouter:** https://openrouter.ai/dashboard
- **Google Cloud:** https://console.cloud.google.com/billing

Expected costs for 150 community test translations: **$4.50 - $9.00**

## 🐛 Troubleshooting

**If translation fails:**
- Check function logs: https://app.netlify.com/sites/oshi3-nihonto/logs/functions
- Verify both environment variables are set
- Check browser console (F12)

**If build fails:**
- Check deploy logs: https://app.netlify.com/sites/oshi3-nihonto/deploys
- Verify GitHub connection is authorized

## 📚 Quick Links

- **Live Site:** https://oshi3-nihonto.netlify.app
- **GitHub:** https://github.com/0raclide/oshi3-webapp
- **Netlify Dashboard:** https://app.netlify.com/sites/oshi3-nihonto
- **Environment Variables:** https://app.netlify.com/sites/oshi3-nihonto/configuration/env

---

**You're almost there!** Just connect GitHub and add the 2 environment variables. Should take ~5 minutes total.
