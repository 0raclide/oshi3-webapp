const vision = require('@google-cloud/vision');
const multipart = require('parse-multipart-data');

// Initialize Google Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString()
  )
});

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const VISION_MODEL = 'anthropic/claude-3.5-sonnet';

/**
 * Step 1: Extract OCR using Google Cloud Vision
 */
async function extractOCR(imageBuffer) {
  const [result] = await visionClient.textDetection(imageBuffer);
  const detections = result.textAnnotations;

  if (!detections || detections.length === 0) {
    throw new Error('No text detected in image');
  }

  return detections[0].description;
}

/**
 * Step 2: Correct OCR using LLM with vision
 */
async function correctOCR(rawOCR, imageBase64) {
  const correctionPrompt = `You are a Japanese historical sword catalog expert.

I have OCR text extracted from a Japanese sword catalog (重要刀剣等図譜). The OCR may contain errors due to:
- Old/historical kanji forms
- Vertical text layout confusion
- Similar-looking characters
- Technical sword terminology

**CRITICAL: The measurements section (法量) often has MULTIPLE LINES. You MUST preserve ALL measurement data including:**
- 身長 (blade length)
- 反 (curvature)
- 元巾 (base width)
- 先巾 (tip width)
- 鋒長 (kissaki length)
- 茎長 (nakago length)

**Your task:** Review the OCR text alongside the image and produce CORRECTED Japanese text.

**Instructions:**
1. Compare the OCR with the actual image
2. Fix any OCR errors you identify
3. **PRESERVE ALL LINES of the measurements section - do NOT omit any measurements**
4. Preserve the original structure and layout
5. Use proper historical kanji forms when appropriate
6. Output ONLY the corrected Japanese text, nothing else

**OCR Text:**
${rawOCR}

**Corrected Text:**`;

  const response = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/0raclide/oshi3-nihonto',
      'X-Title': 'Oshi3 Nihonto OCR Correction'
    },
    body: JSON.stringify({
      model: VISION_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
            },
            {
              type: 'text',
              text: correctionPrompt
            }
          ]
        }
      ],
      max_tokens: 4000,
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Step 3: Translate to English
 */
async function translateToMarkdown(correctedOCR, model) {
  const translationPrompt = `You are a specialist in translating Japanese sword catalog entries for Tokubetsu-Jūyō and Jūyō certifications.

Translate the Japanese text into scholarly English following this exact format and style:

**FORMAT:**

[Classification header - translate exactly as written, e.g.:]
- "Tokubetsu-Jūyō Tōken at the 27th Tokubetsu-Jūyō Shinsa from April 20, 2022"
- "Jūyō-Tōken at the 70th Jūyō Shinsa from November 6, 2024"

[Item line: e.g., "Katana, mumei: Hōshō (保昌)" or "Katana, kinzōgan-mei: Yukimitsu – Hon'a + kaō (Kōyū)"]

[Author credit if present: e.g., "Ōhira Takeko (大平岳子)"]

**Measurements**
[Inline comma-separated format with italicized Japanese terms, e.g.:]
Nagasa 68.3 cm, sori 2.0 cm, motohaba 3.2 cm, sakihaba 2.2 cm, kissaki-nagasa 3.8 cm, nakago-nagasa 18.0 cm, almost no nakago-sori

**Description**
[Paragraph format with subsections using italicized labels:]
Keijō: [blade construction and shape in flowing prose]
Kitae: [steel grain pattern description]
Hamon: [temper line description]
Bōshi: [tip temper pattern]
Horimono: [groove/carving if present]
Nakago: [tang description]

**Artisan**
[Smith or school attribution]

**Era**
[Time period]

**Explanation**
[Detailed historical and technical analysis in flowing paragraphs - translate completely and verbatim, preserving all details about the smith's history, techniques, comparisons, and analysis]

**CRITICAL TRANSLATION RULES:**
1. **Classification header**: NEVER confuse certification levels:
   - "Jūyō-Tōken" (重要刀剣) = Important Sword - translate as "Jūyō-Tōken at the [number]th Jūyō Shinsa from [date]"
   - "Tokubetsu-Jūyō Tōken" (特別重要刀剣) = Especially Important Sword - translate as "Tokubetsu-Jūyō Tōken at the [number]th Tokubetsu-Jūyō Shinsa from [date]"
   - "Tokubetsu Hozon" (特別保存) = Special Preservation - this is a DIFFERENT, LOWER certification level
   - Read the Japanese text carefully to identify which certification is actually being described
2. **Hon'ami family names**: Use on'yomi (Chinese readings), NOT kun'yomi (Japanese readings):
   - 光勇 = "Kōyū" (correct) NOT "Mitsuhaya" (wrong)
   - 光忠 = "Kōchū" (correct) NOT "Mitsutada" (wrong)
   - 光徳 = "Kōtoku" (correct) NOT "Mitsunori" (wrong)
   - Pattern: 光 = "Kō" (not "Mitsu"), 勇 = "Yū" (not "Haya"), 忠 = "Chū" (not "Tada"), 徳 = "Toku" (not "Nori")
3. **Proper names**: Romanize Japanese names correctly - do NOT translate them into different names
4. **Explanation section**: Translate EVERY detail completely - include all historical context, technical analysis, and scholarly observations from the Japanese text
5. **Names with dates**: When mentioning historical figures, preserve their dates if given (e.g., "Hon'ami Kōyū (本阿弥光勇, 1704–1770)")

**CRITICAL STYLE RULES:**
1. Use **bold** for section headings (NOT ## markdown headers)
2. Use *italics* for ALL Japanese technical terms (keijō, kitae, hamon, nie-deki, masame, chū-suguha, itame, mokume, etc.)
3. Write descriptions in flowing paragraphs, NOT bullet points
4. Keep Japanese technical terminology in romanized form with contextual English (e.g., "chū-suguha in nie-deki" not "medium straight tempering pattern")
5. Be scholarly and thorough - translate the explanation section completely with all details
6. Do NOT include Japanese characters (kanji/hiragana/katakana) except where they naturally appear in the item line or when giving dates/readings
7. Use measurements in the abbreviated inline format shown above

**EXAMPLES OF CORRECT STYLE:**
✓ "wide mihaba, relatively noticeable taper, deep koshizori"
✓ "chū-suguha in nie-deki and a bright and clear nioiguchi"
✓ "densely forged itame that is mixed with mokume"
✓ "Hon'ami Kōyū's (本阿弥光勇, 1704–1770) attribution"
✓ "Jūyō-Tōken at the 70th Jūyō Shinsa from November 6, 2024"
✓ "kinzōgan-mei: Yukimitsu – Hon'a + kaō (Kōyū)"
✗ "Medium-width blade base with significant tapering and deep curvature"
✗ "The tempering is a medium straight line made with nie particles"
✗ "Tokubetsu Hozon-designated" (when the text says Jūyō)
✗ "Hon'ami Mitsuhaya" (should be "Kōyū" for 光勇)

Maintain the natural, scholarly flow of authentic sword catalog translations with complete historical and technical detail.

**Japanese Text:**
${correctedOCR}

**English Translation:**`;

  const response = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/0raclide/oshi3-nihonto',
      'X-Title': 'Oshi3 Nihonto Translation'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: translationPrompt
        }
      ],
      max_tokens: 16000,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Helper to get raw body as buffer
 */
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/**
 * Vercel Function handler
 */
const handler = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get raw body buffer
    const contentType = req.headers['content-type'] || '';
    const bodyBuffer = await getRawBody(req);

    // Parse multipart form data
    const boundary = multipart.getBoundary(contentType);
    const parts = multipart.parse(bodyBuffer, boundary);

    // Extract image and parameters
    const imagePart = parts.find(part => part.name === 'image');
    const modelPart = parts.find(part => part.name === 'model');

    if (!imagePart) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const imageBuffer = imagePart.data;
    const model = modelPart ? modelPart.data.toString() : 'openai/gpt-5.2';
    const imageBase64 = imageBuffer.toString('base64');

    console.log('Starting translation pipeline...');

    // Step 1: Google Cloud Vision OCR
    console.log('Step 1: Running OCR...');
    const rawOCR = await extractOCR(imageBuffer);
    console.log(`OCR extracted ${rawOCR.length} characters`);

    // Step 2: Correct OCR with Claude
    console.log('Step 2: Correcting OCR...');
    const correctedOCR = await correctOCR(rawOCR, imageBase64);
    console.log('OCR corrected');

    // Step 3: Translate with selected model
    console.log(`Step 3: Translating with ${model}...`);
    const englishMarkdown = await translateToMarkdown(correctedOCR, model);
    console.log(`Translation complete (${englishMarkdown.length} chars)`);

    return res.status(200).json({
      japanese: correctedOCR,
      english: englishMarkdown,
      model: model
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: error.message || 'Translation failed'
    });
  }
};

// Disable Vercel's automatic body parsing
handler.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = handler;
