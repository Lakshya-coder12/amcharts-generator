import 'dotenv/config';
import { retrieveContext } from './retrieve.js';
import { amchartsXYSchema, buildSystemPrompt } from './schemas.js';
import { Ollama } from 'ollama';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { zodToJsonSchema } from 'zod-to-json-schema';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_CHAT_MODEL = 'llama3.1:8b';
console.log(`Using Ollama model: ${OLLAMA_CHAT_MODEL}`);
const ollamaClient = new Ollama({ host: OLLAMA_HOST });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ollamaChat(messages) {
  try {
    const jsonSchema = zodToJsonSchema(amchartsXYSchema, "amchartsXYSchema");
    const data = await ollamaClient.chat({
      model: OLLAMA_CHAT_MODEL,
      messages,
      stream: false,
      format: jsonSchema,
    });
    return data?.message?.content;
  } catch (err) {
    throw new Error(`Chat request failed: ${err.message}`);
  }
}

function contextToText(contextRows) {
  return contextRows
    .map((r) => `- ${r.kind}.${r.key}: ${r.description || ''}`)
    .join('\n');
}

export async function generateConfig(chartType, userQuery, topK = 20) {
  const contextRows = await retrieveContext(chartType, userQuery, topK);
  const contextText = contextToText(contextRows);
  const sys = buildSystemPrompt();
  const messages = [
    { role: 'system', content: sys },
    { role: 'user', content: `User request: ${userQuery}` },
    { role: 'user', content: `Chart type: ${chartType}` },
    { role: 'user', content: `Relevant fields:\n${contextText}` },
  ];
  const content = await ollamaChat(messages);
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error(`Model output is not valid JSON: ${e.message}\n${content}`);
  }

  const validation = amchartsXYSchema.safeParse(parsed);
  if (!validation.success) {
    throw new Error(`Model output failed Zod validation: ${validation.error.message}\n${content}`);
  }

  // Write preview artifact for the browser demo
  const outPath = path.resolve(__dirname, `../output/generated.${chartType}.json`);
  try {
    fs.writeFileSync(outPath, JSON.stringify(validation.data, null, 2));
  } catch (e) {
    console.warn(`Failed to write preview file: ${outPath} - ${e.message}`);
  }
  return { config: validation.data, citations: contextRows };
}

// CLI entry
const chartTypeArg = process.argv[2] || 'xychart';
const queryArg = process.argv.slice(3).join(' ') || 'XY chart with panX false, scrollbars, and wheel zoom';

generateConfig(chartTypeArg, queryArg)
  .then(({ config }) => {
    console.log(JSON.stringify(config, null, 2));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });