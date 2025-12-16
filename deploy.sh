#!/bin/bash

# Quick deploy script for Oshi3 webapp
# Usage: ./deploy.sh "Your commit message"

set -e

cd "$(dirname "$0")"

echo "📦 Committing changes to GitHub..."
git add .
git commit -m "${1:-Update webapp}" || echo "No changes to commit"
git push origin main

echo ""
echo "🚀 Deploying to Netlify..."
NETLIFY_AUTH_TOKEN=nfp_PYTv82V4ny7cBkiYANVTp2DLSXNEKZEn9c72 \
  netlify deploy --prod --dir=public --functions=netlify/functions

echo ""
echo "✅ Deploy complete!"
echo "🌐 Live at: https://oshi3-nihonto.netlify.app"
echo "📊 Dashboard: https://app.netlify.com/sites/oshi3-nihonto"
