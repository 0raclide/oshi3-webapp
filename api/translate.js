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
  const translationPrompt = `You are a specialist in translating Japanese sword catalog entries (重要刀剣等図譜).

**CRITICAL INSTRUCTIONS:**
1. Translate EVERY SINGLE WORD and detail from the Japanese text
2. Do NOT summarize, condense, or omit ANY information
3. Preserve all technical terminology with explanations in parentheses
4. Include ALL measurements, dates, names, and descriptions
5. Maintain the original structure and flow
6. If the Japanese mentions something, it MUST appear in English
7. Translate the historical background section VERBATIM and COMPLETELY

**Output Format:**

# [Sword Type] - [Smith/School Name]

## Basic Information
- **Classification:** [太刀/脇指/短刀/etc.]
- **Signature (銘):** [Transcribe signature]
- **Attribution:** [If unsigned, the attributed smith/school]
- **Period:** [Estimated period/era]

## Measurements (法量)
- **Total Length:** [XX cm]
- **Blade Length:** [XX cm]
- **Curvature (反り):** [XX cm]
- **Base Width (元幅):** [XX cm]
- **Tip Width (先幅):** [XX cm]
- **Blade Thickness:** [XX cm]

## Physical Description (形状)
[Detailed description of blade shape, curvature, thickness, tip form, etc.]

## Hamon (刃文) - Temper Pattern
[Description of the temper line pattern]

## Jigane (地鉄) - Steel Pattern
[Description of the steel grain pattern]

## Nakago (茎) - Tang
[Description of tang condition, file marks, patina, holes, etc.]

## Historical Background (説明)
[Translate the ENTIRE explanation section verbatim - include all information about the smith, school, historical context, brothers/family, imperial appointments, comparisons, condition notes, etc. - DO NOT SUMMARIZE]

## Fittings/Mountings (附属)
[If mentioned, describe all fittings and mountings in detail]

## Provenance (伝来)
[If mentioned separately, include historical ownership]

## Notes
[Any additional observations or scholarly notes]

---

**Japanese Text:**
${correctedOCR}

**English Translation (Markdown):**`;

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
