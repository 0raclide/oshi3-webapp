# 🔧 Quick Fix: Connect GitHub to Netlify

The deployment failed because the site needs to be connected to your GitHub repository.

## The Issue

Error: `Host key verification failed - Could not read from remote repository`

This means Netlify doesn't have permission to access your GitHub repo yet.

## Quick Fix (2 minutes)

I've opened the settings page for you. Follow these steps:

### Option A: Link to Git (Recommended)

1. **On the page that just opened** (or go to: https://app.netlify.com/sites/oshi3-nihonto/settings/deploys#continuous-deployment)

2. **Look for "Link repository" or "Continuous deployment"**

3. **Click "Link site to Git repository"**

4. **Choose "GitHub"**

5. **Authorize Netlify** (if prompted - this lets Netlify access your GitHub)

6. **Select:** `0raclide/oshi3-webapp`

7. **Configure:**
   - Branch: `main`
   - Build command: (leave empty)
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

8. **Click "Save" or "Deploy site"**

### Option B: Delete & Recreate (If Option A doesn't work)

If you can't find the "Link repository" option:

1. **Go to:** https://app.netlify.com/sites/oshi3-nihonto/settings/general

2. **Scroll to bottom** → Click "Delete site"

3. **Create new site:**
   - Go to: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select `0raclide/oshi3-webapp`
   - Configure as above
   - **Important:** Don't forget to add the 2 environment variables again!

## After Connecting

The site will automatically deploy. You should see:

1. **Deploy in progress** at: https://app.netlify.com/sites/oshi3-nihonto/deploys
2. **Build logs** showing the progress
3. **"Published" status** when complete (1-2 minutes)

Then visit: **https://oshi3-nihonto.netlify.app** to test!

## Test Images

After deployment, test with:
```
/Users/christopherhill/Desktop/Claude_project/Oshi3/extracted/vol1_test/page-06.jpg
/Users/christopherhill/Desktop/Claude_project/Oshi3/extracted/vol1_test/page-08.jpg
/Users/christopherhill/Desktop/Claude_project/Oshi3/extracted/vol1_item3/page-10.jpg
```

---

**Root cause:** Netlify needs GitHub OAuth authorization to clone your repository. This can only be done through the web UI, not via API.
