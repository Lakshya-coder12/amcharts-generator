import 'dotenv/config';
import { retrieveContext } from './retrieve.js';
import { amchartsXYChartSchema, buildSystemPrompt } from './schemas.js';
import { Ollama } from 'ollama';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { zodToJsonSchema } from 'zod-to-json-schema';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_CHAT_MODEL = 'qwen-custom';
console.log(`Using Ollama model: ${OLLAMA_CHAT_MODEL}`);
const ollamaClient = new Ollama({ host: OLLAMA_HOST });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ollamaChat(messages) {
  const jsonSchema = zodToJsonSchema(amchartsXYChartSchema);
  const data = await ollamaClient.chat({
    model: OLLAMA_CHAT_MODEL,
    messages,
    stream: false,
    format: jsonSchema,
  });
  return data?.message?.content;
}

function contextToText(fields, examples) {
  const fieldDocs = fields
    .map((r) => `- ${r.kind}.${r.key}: ${r.description || ''}`)
    .join('\n');

  const exampleConfigs = examples
    .map((r) => `- ${r.key}: ${JSON.stringify(r.config)}`)
    .join('\n');

  return { fieldDocs, exampleConfigs };
}

export async function generateConfig(chartType, userQuery, topK = 20) {
  const { fields, examples } = await retrieveContext(chartType, userQuery, topK);
  const { fieldDocs, exampleConfigs } = contextToText(fields, examples);
  const sys = buildSystemPrompt();
  const messages = [
    { role: 'system', content: sys },
    { role: 'user', content: `User request: ${userQuery}` },
    { role: 'user', content: `Chart type: ${chartType}` },
  ];

  if (fieldDocs.length > 0) {
    messages.push({ role: 'user', content: `Relevant fields:\n${fieldDocs}` });
  }
  if (exampleConfigs.length > 0) {
    messages.push({ role: 'user', content: `Relevant config examples:\n${exampleConfigs}` });
  }

  console.log(JSON.stringify(messages, null, 2));
  const content = await ollamaChat(messages);
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error(`Model output is not valid JSON: ${e.message}\n${content}`);
  }

  // Normalize references to use '#'-prefixed tokens if the model omitted them
  try {
    if (parsed?.properties) {
      if (Array.isArray(parsed.properties.xAxes)) {
        parsed.properties.xAxes = parsed.properties.xAxes.map((x) => (typeof x === 'string' && !x.startsWith('#') ? `#${x}` : x));
      }
      if (Array.isArray(parsed.properties.yAxes)) {
        parsed.properties.yAxes = parsed.properties.yAxes.map((y) => (typeof y === 'string' && !y.startsWith('#') ? `#${y}` : y));
      }
      if (Array.isArray(parsed.properties.series)) {
        parsed.properties.series = parsed.properties.series.map((s) => {
          if (s?.settings) {
            if (typeof s.settings.xAxis === 'string' && !s.settings.xAxis.startsWith('#')) s.settings.xAxis = `#${s.settings.xAxis}`;
            if (typeof s.settings.yAxis === 'string' && !s.settings.yAxis.startsWith('#')) s.settings.yAxis = `#${s.settings.yAxis}`;
          }
          if (s?.properties && typeof s.properties.data === 'string' && !s.properties.data.startsWith('#')) {
            s.properties.data = `#${s.properties.data}`;
          }
          return s;
        });
      }
    }
  } catch {}

  const validation = amchartsXYChartSchema.safeParse(parsed);
  if (!validation.success) {
    throw new Error(`Model output failed Zod validation: ${validation.error.message}\n${content}`);
  }

  // Write artifacts for the browser demo
  const previewOutPath = path.resolve(__dirname, `../output/preview.json`);
  const generatedOutPath = path.resolve(__dirname, `../output/generated.${chartType}.json`);
  try {
    fs.writeFileSync(previewOutPath, JSON.stringify(validation.data, null, 2));
  } catch (e) {
    console.warn(`Failed to write preview file: ${previewOutPath} - ${e.message}`);
  }
  try {
    fs.writeFileSync(generatedOutPath, JSON.stringify(validation.data, null, 2));
  } catch (e) {
    console.warn(`Failed to write generated file: ${generatedOutPath} - ${e.message}`);
  }
  return { config: validation.data, citations: { fields, examples } };
}

// CLI entry
const chartTypeArg = process.argv[2] || 'xychart';
const queryArg = process.argv.slice(3).join(' ') || 'Create a line chart showing daily website traffic over 7 days starting from January 1, 2024.'
'The traffic ranges from 5000 to 15000 visitors per day with realistic daily variations.';

generateConfig(chartTypeArg, queryArg)
  .then(({ config }) => {
    console.log(JSON.stringify(config, null, 2));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });