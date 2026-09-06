/**
 * client.js — the OpenRouter image call, its retries, and its cost line.
 *
 * Node's built-in fetch. No dependency, matching reference/engine.js's posture:
 * there is nothing to npm install, ever.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ENDPOINT = 'https://openrouter.ai/api/v1/images';

// One model, hardcoded, per the design spec section 3. A fallback (Nano Banana
// Pro was the candidate) is deliberately not wired in: YAGNI until this route
// actually fails in practice. If it does, this constant is the whole change.
const MODEL = 'openai/gpt-image-2';

// OpenRouter's OpenAI route accepts 1:1, 3:2, 2:3, 4:3, 3:4, 16:9, 9:16, 21:9,
// auto. 4:5 is not on that list, so 3:4 is the closest and the canvas is
// 1152x1536. Design spec section 3 records the decision.
const ASPECT = '3:4';

// Transport-level retries only: a 429 or a 5xx is a hiccup, not a verdict on the
// prompt. A refused or malformed request throws on the first try, and the
// three-attempt visual-check bound in the workflow is what governs THAT loop.
const TRANSPORT_RETRIES = 2;

const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
};

/** A local image file as a data: URI, for input_references. */
function dataUri(file) {
  const ext = path.extname(file).toLowerCase();
  const mime = MIME[ext];
  if (!mime) throw new Error(`unsupported reference image type '${ext}': ${file}`);
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Generate one image.
 *
 * @param {string} prompt
 * @param {string[]} references  local image paths, at most three (design spec 4)
 * @param {string} apiKey
 * @returns {Promise<{buffer: Buffer, cost: number, model: string}>}
 */
async function generate(prompt, references, apiKey) {
  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY is not set. Put it in the repo-root .env file '
      + '(gitignored) as OPENROUTER_API_KEY=<key>.');
  }
  const body = {
    model: MODEL,
    prompt,
    aspect_ratio: ASPECT,
    output_format: 'png',
    n: 1,
  };
  if (references && references.length) {
    body.input_references = references.map(f => ({
      type: 'image_url',
      image_url: { url: dataUri(f) },
    }));
  }

  let last = null;
  for (let attempt = 0; attempt <= TRANSPORT_RETRIES; attempt++) {
    let res;
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      last = new Error(`network error calling OpenRouter: ${e.message}`);
      if (attempt < TRANSPORT_RETRIES) { await sleep(2000 * (attempt + 1)); continue; }
      throw last;
    }

    if (res.status === 429 || res.status >= 500) {
      last = new Error(`OpenRouter returned ${res.status}: ${(await res.text()).slice(0, 400)}`);
      if (attempt < TRANSPORT_RETRIES) { await sleep(2000 * (attempt + 1)); continue; }
      throw last;
    }
    if (!res.ok) {
      // 4xx other than 429: a refusal or a malformed request. Surface it
      // verbatim; the caller counts it as one failed attempt.
      throw new Error(`OpenRouter returned ${res.status}: ${(await res.text()).slice(0, 800)}`);
    }

    const json = await res.json();
    const b64 = json && json.data && json.data[0] && json.data[0].b64_json;
    if (!b64) {
      throw new Error('OpenRouter returned no image data: '
        + JSON.stringify(json).slice(0, 400));
    }
    return {
      buffer: Buffer.from(b64, 'base64'),
      cost: (json.usage && json.usage.cost) || 0,
      model: json.model || MODEL,
    };
  }
  throw last;
}

module.exports = { generate, dataUri, ENDPOINT, MODEL, ASPECT };
