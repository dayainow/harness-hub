/* eslint-disable */
/**
 * Extract { slug, description, readmeExcerpt } from prisma/seed.ts
 *
 * Strategy: load seed.ts as text, parse only the top-level harnesses array
 * region, and pull out each object's slug/description/readmeExcerpt fields
 * using a tiny stateful tokenizer. Writes the result to
 * `prisma/harness-descriptions.generated.ts` so update-descriptions.ts and
 * harnesses.service.ts can share a single source of truth.
 *
 * Run from repo root:
 *   ts-node back/prisma/extract-descriptions.ts
 * Or just `node -r ts-node/register back/prisma/extract-descriptions.ts`.
 */
import * as fs from 'fs';
import * as path from 'path';

const seedPath = path.resolve(__dirname, 'seed.ts');
const outPath = path.resolve(__dirname, 'harness-descriptions.generated.ts');

const src = fs.readFileSync(seedPath, 'utf8');

// Locate the `const harnesses: SeedHarness[] = [` block start and find the
// matching closing `];` by tracking bracket depth while respecting strings.
const startMarker = 'const harnesses: SeedHarness[] = [';
const startIdx = src.indexOf(startMarker);
if (startIdx === -1) throw new Error('Could not find harnesses array in seed.ts');
const arrStart = startIdx + startMarker.length - 1; // position of '['

let depth = 0;
let i = arrStart;
let inString: false | '\'' | '"' | '`' = false;
let inLineComment = false;
let inBlockComment = false;
let arrEnd = -1;

while (i < src.length) {
  const c = src[i];
  const n = src[i + 1];
  if (inLineComment) {
    if (c === '\n') inLineComment = false;
    i++;
    continue;
  }
  if (inBlockComment) {
    if (c === '*' && n === '/') {
      inBlockComment = false;
      i += 2;
      continue;
    }
    i++;
    continue;
  }
  if (inString) {
    if (c === '\\') {
      i += 2;
      continue;
    }
    if (c === inString) inString = false;
    i++;
    continue;
  }
  if (c === '/' && n === '/') {
    inLineComment = true;
    i += 2;
    continue;
  }
  if (c === '/' && n === '*') {
    inBlockComment = true;
    i += 2;
    continue;
  }
  if (c === '\'' || c === '"' || c === '`') {
    inString = c as any;
    i++;
    continue;
  }
  if (c === '[') depth++;
  else if (c === ']') {
    depth--;
    if (depth === 0) {
      arrEnd = i;
      break;
    }
  }
  i++;
}
if (arrEnd === -1) throw new Error('Could not find end of harnesses array');

const arrText = src.slice(arrStart, arrEnd + 1);

// Now walk top-level objects within the array.
type Entry = { slug: string; description: string; readmeExcerpt: string };
const entries: Entry[] = [];

let p = 1; // skip leading '['
let objStart = -1;
let objDepth = 0;
inString = false;
inLineComment = false;
inBlockComment = false;

while (p < arrText.length - 1) {
  const c = arrText[p];
  const n = arrText[p + 1];
  if (inLineComment) {
    if (c === '\n') inLineComment = false;
    p++;
    continue;
  }
  if (inBlockComment) {
    if (c === '*' && n === '/') {
      inBlockComment = false;
      p += 2;
      continue;
    }
    p++;
    continue;
  }
  if (inString) {
    if (c === '\\') {
      p += 2;
      continue;
    }
    if (c === inString) inString = false;
    p++;
    continue;
  }
  if (c === '/' && n === '/') {
    inLineComment = true;
    p += 2;
    continue;
  }
  if (c === '/' && n === '*') {
    inBlockComment = true;
    p += 2;
    continue;
  }
  if (c === '\'' || c === '"' || c === '`') {
    inString = c as any;
    p++;
    continue;
  }
  if (c === '{') {
    if (objDepth === 0) objStart = p;
    objDepth++;
  } else if (c === '}') {
    objDepth--;
    if (objDepth === 0 && objStart !== -1) {
      const objText = arrText.slice(objStart, p + 1);
      const entry = parseEntry(objText);
      if (entry) entries.push(entry);
      objStart = -1;
    }
  }
  p++;
}

function parseEntry(objText: string): Entry | null {
  const slug = extractField(objText, 'slug');
  const description = extractField(objText, 'description');
  const readmeExcerpt = extractField(objText, 'readmeExcerpt');
  if (slug === null || description === null || readmeExcerpt === null) {
    return null;
  }
  return { slug, description, readmeExcerpt };
}

/**
 * Find `<key>:` at top level of objText (not nested) and grab the following
 * string literal (single quote, double quote, or backtick). Handles
 * multi-line strings and escape sequences.
 */
function extractField(objText: string, key: string): string | null {
  // Walk objText, tracking depth/strings; when we hit depth==1 and see
  // `<key>:` followed by whitespace and a quote, parse the string.
  let d = 0;
  let s: false | '\'' | '"' | '`' = false;
  let inLine = false;
  let inBlock = false;
  let q = 0;
  while (q < objText.length) {
    const c = objText[q];
    const nx = objText[q + 1];
    if (inLine) {
      if (c === '\n') inLine = false;
      q++;
      continue;
    }
    if (inBlock) {
      if (c === '*' && nx === '/') {
        inBlock = false;
        q += 2;
        continue;
      }
      q++;
      continue;
    }
    if (s) {
      if (c === '\\') {
        q += 2;
        continue;
      }
      if (c === s) s = false;
      q++;
      continue;
    }
    if (c === '/' && nx === '/') {
      inLine = true;
      q += 2;
      continue;
    }
    if (c === '/' && nx === '*') {
      inBlock = true;
      q += 2;
      continue;
    }
    if (c === '\'' || c === '"' || c === '`') {
      s = c as any;
      q++;
      continue;
    }
    if (c === '{') {
      d++;
      q++;
      continue;
    }
    if (c === '}') {
      d--;
      q++;
      continue;
    }
    // We only consider the key when depth is exactly 1 (top level of the object).
    if (d === 1 && objText.startsWith(key, q)) {
      // Must be followed (after optional whitespace) by ':'.
      const after = q + key.length;
      // Make sure the char right before is not an identifier char (avoid partial match).
      const before = q > 0 ? objText[q - 1] : '';
      if (/[A-Za-z0-9_$]/.test(before)) {
        q++;
        continue;
      }
      let r = after;
      while (r < objText.length && /\s/.test(objText[r])) r++;
      if (objText[r] !== ':') {
        q++;
        continue;
      }
      r++;
      while (r < objText.length && /\s/.test(objText[r])) r++;
      const quote = objText[r];
      if (quote !== '\'' && quote !== '"' && quote !== '`') return null;
      // Parse string literal.
      let value = '';
      r++;
      while (r < objText.length) {
        const ch = objText[r];
        if (ch === '\\') {
          const esc = objText[r + 1];
          if (esc === 'n') value += '\n';
          else if (esc === 't') value += '\t';
          else if (esc === 'r') value += '\r';
          else if (esc === '\\') value += '\\';
          else if (esc === '\'') value += '\'';
          else if (esc === '"') value += '"';
          else if (esc === '`') value += '`';
          else value += esc;
          r += 2;
          continue;
        }
        if (ch === quote) break;
        value += ch;
        r++;
      }
      return value;
    }
    q++;
  }
  return null;
}

// Emit the generated TS module.
const header = `/* eslint-disable */
/**
 * AUTO-GENERATED FILE — do not edit by hand.
 * Source of truth: prisma/seed.ts (harnesses[] array).
 * Regenerate via: ts-node back/prisma/extract-descriptions.ts
 *
 * Used by both prisma/update-descriptions.ts (CLI) and
 * src/harnesses/harnesses.service.ts -> syncDescriptions() so the values stay
 * in sync without duplicating thousands of lines of Markdown.
 */
export type HarnessDescription = {
  slug: string;
  description: string;
  readmeExcerpt: string;
};

export const HARNESS_DESCRIPTIONS: HarnessDescription[] = `;

const body = JSON.stringify(entries, null, 2);

fs.writeFileSync(outPath, header + body + ';\n', 'utf8');
console.log(`Wrote ${entries.length} harness descriptions -> ${outPath}`);
