import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://www.amcharts.com/docs/v5/reference/';

function normalizeText(s) {
  return (s || '')
    .replace(/\s+/g, ' ')
    .replace(/\u00A0/g, ' ')
    .trim();
}

function sanitizeFieldName(s) {
  return normalizeText(s).replace(/\s*#\s*$/, '');
}

function pickDescription(lines) {
  const skipStarts = [
    'Type ',
    'Inherited from',
    'Click here',
    '@since',
    'Range of values',
    'IMPORTANT:',
  ];
  for (const ln of lines) {
    const t = normalizeText(ln);
    if (!t) continue;
    if (skipStarts.some((p) => t.startsWith(p))) continue;
    // Avoid lone '#' or single-word anchors
    if (t === '#') continue;
    return t;
  }
  // Fallback: join non-skipped lines
  const kept = lines
    .map((l) => normalizeText(l))
    .filter((t) => t && !skipStarts.some((p) => t.startsWith(p)) && t !== '#');
  return kept.join(' ').trim();
}

function blockToLines($block) {
  const raw = $block.text();
  return raw
    .split(/\r?\n/)
    .map((l) => normalizeText(l))
    .filter((l) => l.length > 0);
}

function parseSectionByHeading($, headingName) {
  // Find section heading (usually h2). Fallback to h3.
  let $heading = $('h2').filter((i, el) => normalizeText($(el).text()).toLowerCase() === headingName.toLowerCase());
  if ($heading.length === 0) {
    $heading = $('h2, h3').filter((i, el) => normalizeText($(el).text()).toLowerCase().includes(headingName.toLowerCase()));
  }
  if ($heading.length === 0) {
    throw new Error(`Could not find section heading: ${headingName}`);
  }

  const block = $heading.first().nextUntil('h2');
  const lines = blockToLines(block);

  // Primary: use generic item parser that handles inline "name #" markers
  let items = parseItemsFromLines(lines);

  // Fallback: if no items found, parse based on 'Type ' markers
  if (Object.keys(items).length === 0) {
    items = parseItemsByType(lines);
  }

  return items;
}

async function fetchPageWithFallback(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': `${BASE_URL}`,
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1'
    },
  });
  if (res.ok) {
    return { content: await res.text(), type: 'html' };
  }
  const chartSlug = url.split('/').pop();
  const mirrorUrl = `https://r.jina.ai/http://www.amcharts.com/docs/v5/reference/${chartSlug}`;
  const resMirror = await fetch(mirrorUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!resMirror.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return { content: await resMirror.text(), type: 'text' };
}

function isNameLine(line) {
  const t = normalizeText(line);
  return t === '#' || /#\s*$/.test(t) || t.includes(' #');
}

function extractNameFromLine(line, prevLine) {
  const t = normalizeText(line);
  if (t === '#') {
    return sanitizeFieldName(prevLine || '');
  }
  // Inline marker like: "active #"
  const beforeHash = t.split('#')[0];
  return sanitizeFieldName(beforeHash);
}

function parseItemsFromLines(lines) {
  const items = {};
  for (let i = 0; i < lines.length; i++) {
    if (isNameLine(lines[i])) {
      const nameCandidate = extractNameFromLine(lines[i], lines[i - 1]);
      const lower = (nameCandidate || '').toLowerCase();
      if (lower === 'settings' || lower === 'properties') continue;
      if (!nameCandidate || nameCandidate.length > 50) continue;
      const descCandidates = [];
      let j = i + 1;
      while (j < lines.length && !isNameLine(lines[j])) {
        descCandidates.push(lines[j]);
        j++;
      }
      const desc = pickDescription(descCandidates);
      if (nameCandidate && desc) items[nameCandidate] = desc;
      i = j - 1;
    }
  }
  return items;
}

function isPlausibleFieldName(name) {
  const t = normalizeText(name);
  if (!t) return false;
  const lower = t.toLowerCase();
  if (lower === 'settings' || lower === 'properties' || lower === 'sources' || lower === 'inheritance') return false;
  if (t.length > 50) return false;
  // camelCase / PascalCase / simple words
  return /^[A-Za-z][A-Za-z0-9]*$/.test(t);
}

function parseItemsByType(lines) {
  const items = {};
  for (let i = 0; i < lines.length; i++) {
    const t = normalizeText(lines[i]);
    if (t.startsWith('Type ')) {
      // field name likely on the previous non-empty line
      let k = i - 1;
      while (k >= 0 && !normalizeText(lines[k])) k--;
      const nameCandidate = sanitizeFieldName(lines[k] || '');
      if (!isPlausibleFieldName(nameCandidate)) continue;
      const descCandidates = [];
      let j = i + 1;
      while (j < lines.length && !normalizeText(lines[j]).startsWith('Type ')) {
        descCandidates.push(lines[j]);
        j++;
      }
      const desc = pickDescription(descCandidates);
      if (nameCandidate && desc) items[nameCandidate] = desc;
      i = j - 1;
    }
  }
  return items;
}

function parseFromPlainText(content) {
  const lines = content
    .split(/\r?\n/)
    .map((l) => normalizeText(l))
    .filter(Boolean);
  const idxSettings = lines.findIndex((l) => l.toLowerCase().startsWith('settings'));
  const idxProperties = lines.findIndex((l) => l.toLowerCase().startsWith('properties'));
  if (idxSettings === -1 || idxProperties === -1) {
    throw new Error('Plain-text parse: could not locate Settings/Properties headings');
  }
  const settingsLines = lines.slice(idxSettings + 1, idxProperties);
  const propertiesLines = lines.slice(idxProperties + 1);
  // Prefer parsing markdown tables if present
  const settingsItems = parseItemsFromTable(settingsLines) ||
    (Object.keys(parseItemsFromLines(settingsLines)).length ? parseItemsFromLines(settingsLines) : parseItemsByType(settingsLines));
  const propertiesItems = parseItemsFromTable(propertiesLines) ||
    (Object.keys(parseItemsFromLines(propertiesLines)).length ? parseItemsFromLines(propertiesLines) : parseItemsByType(propertiesLines));
  return {
    settings: settingsItems,
    properties: propertiesItems,
  };
}

function extractDescFromCell(text) {
  let t = normalizeText(text).replace(/`/g, '').trim();
  // If "Inherited from ..." is present, try to take text after it
  const inhIdx = t.toLowerCase().indexOf('inherited from');
  if (inhIdx !== -1) {
    t = normalizeText(t.substring(inhIdx + 'inherited from'.length));
    // Remove entity/class names that may follow
    t = t.replace(/^\s*`?\w+`?\s*/i, '').trim();
  }
  // Remove common prefixes
  t = t.replace(/^read only type\s+.*?\s+/i, '').trim();
  // Finally, try to pick description sentence via existing helper
  const picked = pickDescription([t]);
  return picked || t;
}

function parseItemsFromTable(lines) {
  const items = {};
  let anyRow = false;
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    if (/\|\s*-+\s*\|/.test(line)) continue; // separator row
    anyRow = true;
    const rawCells = line.split('|');
    // Drop leading/trailing empty due to table bars
    const cells = rawCells.slice(1, rawCells.length - 1).map((c) => normalizeText(c));
    if (cells.length === 0) continue;
    const nameCell = cells[0] || '';
    const nameCandidate = sanitizeFieldName(nameCell.split('[')[0]);
    if (!isPlausibleFieldName(nameCandidate)) continue;
    const descCell = cells[cells.length - 1] || '';
    const desc = extractDescFromCell(descCell);
    if (nameCandidate && desc) items[nameCandidate] = desc;
  }
  return Object.keys(items).length > 0 || anyRow ? items : null;
}

async function scrapeChart(chartType) {
  const url = `${BASE_URL}${chartType}`;
  const { content, type } = await fetchPageWithFallback(url);
  if (type === 'html') {
    const $ = cheerio.load(content);
    const settings = parseSectionByHeading($, 'Settings');
    const properties = parseSectionByHeading($, 'Properties');
    return { settings, properties };
  } else {
    // Write debug snapshot of plain text for inspection
    try {
      const outDir = path.resolve(process.cwd(), 'output');
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(path.join(outDir, `${chartType}.debug.txt`), content, 'utf8');
    } catch {}
    return parseFromPlainText(content);
  }
}

async function main() {
  const chartType = (process.argv[2] || 'piechart').toLowerCase();
  console.log(`Scraping amCharts v5 docs for chart: ${chartType}...`);
  try {
    const { settings, properties } = await scrapeChart(chartType);
    const outDir = path.resolve(process.cwd(), 'output');
    await fs.mkdir(outDir, { recursive: true });
    const settingsPath = path.join(outDir, `${chartType}.settings.json`);
    const propertiesPath = path.join(outDir, `${chartType}.properties.json`);
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
    await fs.writeFile(propertiesPath, JSON.stringify(properties, null, 2), 'utf8');
    console.log('Wrote:');
    console.log(`- ${settingsPath}`);
    console.log(`- ${propertiesPath}`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

main();