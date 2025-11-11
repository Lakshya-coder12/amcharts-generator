import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getClient, migrate, drop } from './db.js';
import { Ollama } from 'ollama';
import * as examples from './examples.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text:v1.5'; // 768-dim
const ollamaClient = new Ollama({ host: OLLAMA_HOST });

async function embedText(text) {
  try {
    const data = await ollamaClient.embeddings({ model: OLLAMA_EMBED_MODEL, prompt: text });
    const vec = data.embedding;
    if (!Array.isArray(vec) || vec.length === 0) {
      throw new Error('Invalid embedding vector from Ollama');
    }
    return vec;
  } catch (err) {
    throw new Error(`Embedding request failed: ${err.message}`);
  }
}

function toEmbeddingLiteral(vec) {
  // pgvector accepts string like "[0.1,0.2,...]"
  return `[${vec.join(',')}]`;
}

function buildRecords(chartType, settingsMap, propertiesMap) {
  const now = new Date();
  const records = [];
  for (const [key, description] of Object.entries(settingsMap)) {
    records.push({
      chart_type: chartType,
      owner_class: chartType,
      key,
      kind: 'settings',
      description,
      data_type: null,
      default_value: null,
      inherited_from: null,
      doc_url: null,
      synonyms: [],
      examples: [],
      source_version: 'v5',
      scraped_at: now,
    });
  }
  for (const [key, description] of Object.entries(propertiesMap)) {
    records.push({
      chart_type: chartType,
      owner_class: chartType,
      key,
      kind: 'properties',
      description,
      data_type: null,
      default_value: null,
      inherited_from: null,
      doc_url: null,
      synonyms: [],
      examples: [],
      source_version: 'v5',
      scraped_at: now,
    });
  }
  return records;
}

async function insertRecord(client, rec, embedding) {
  const textForTsv = `${rec.chart_type} ${rec.owner_class} ${rec.key} ${rec.description ?? ''}`;
  const embeddingLiteral = toEmbeddingLiteral(embedding);
  const sql = `
    INSERT INTO fields (
      chart_type, owner_class, key, kind, description,
      data_type, default_value, inherited_from, doc_url,
      synonyms, examples, source_version, scraped_at,
      text_tsvector, embedding
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9,
      $10, $11, $12, $13,
      to_tsvector('simple', $14), $15::vector
    ) ON CONFLICT (chart_type, kind, key)
    DO UPDATE SET description = EXCLUDED.description,
      owner_class = EXCLUDED.owner_class,
      synonyms = EXCLUDED.synonyms,
      examples = EXCLUDED.examples,
      source_version = EXCLUDED.source_version,
      scraped_at = EXCLUDED.scraped_at,
      text_tsvector = EXCLUDED.text_tsvector,
      embedding = EXCLUDED.embedding;
  `;
  const params = [
    rec.chart_type,
    rec.owner_class,
    rec.key,
    rec.kind,
    rec.description,
    rec.data_type,
    rec.default_value,
    rec.inherited_from,
    rec.doc_url,
    JSON.stringify(rec.synonyms ?? []),
    rec.examples ?? null,
    rec.source_version,
    rec.scraped_at,
    textForTsv,
    embeddingLiteral,
  ];
  await client.query(sql, params);
}

async function ingestChart(chartType) {
  const settingsPath = path.resolve(__dirname, `../output/${chartType}.settings.json`);
  const propertiesPath = path.resolve(__dirname, `../output/${chartType}.properties.json`);
  // If output files are missing, skip fields ingestion instead of failing.
  if (!fs.existsSync(settingsPath) || !fs.existsSync(propertiesPath)) {
    console.warn(
      `Skipping fields ingestion: missing output files for ${chartType}. ` +
      `Expected: ${settingsPath} and ${propertiesPath}.`
    );
    return; // Continue with config examples ingestion
  }
  const settingsMap = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  const propertiesMap = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));
  const records = buildRecords(chartType, settingsMap, propertiesMap);

  const client = getClient();
  await client.connect();
  try {
    for (const rec of records) {
      const embText = `${rec.chart_type} ${rec.owner_class} ${rec.key} ${rec.description}`;
      let emb;
      try {
        emb = await embedText(embText);
      } catch (e) {
        console.warn(`Embedding failed for ${rec.key}: ${e.message}`);
        emb = null;
      }
      await insertRecord(client, rec, emb ?? Array(768).fill(0));
    }
  } finally {
    await client.end();
  }
}

async function ingestConfigExamples() {
  await drop();
  await migrate();
  const client = getClient();
  await client.connect();
  try {
    for (const [exampleName, exampleConfig] of Object.entries(examples)) {
      const chartType = exampleConfig.type.toLowerCase();
      const embText = `${chartType} ${exampleName} ${JSON.stringify(exampleConfig)}`;
      let emb;
      try {
        emb = await embedText(embText);
      } catch (e) {
        console.warn(`Embedding failed for example ${exampleName}: ${e.message}`);
        emb = null;
      }
      const embeddingLiteral = toEmbeddingLiteral(emb ?? Array(768).fill(0));
      const sql = `
        INSERT INTO config_examples (chart_type, key, config, embedding)
        VALUES ($1, $2, $3, $4::vector)
        ON CONFLICT (chart_type, key) DO UPDATE SET
          config = EXCLUDED.config,
          embedding = EXCLUDED.embedding;
      `;
      const params = [chartType, exampleName, JSON.stringify(exampleConfig), embeddingLiteral];
      await client.query(sql, params);
    }
  } finally {
    await client.end();
  }
}

const chartTypeArg = process.argv[2] || 'xychart';
Promise.all([ingestChart(chartTypeArg), ingestConfigExamples()])
  .then(() => {
    console.log(`Ingested records for ${chartTypeArg} into Postgres.`);
    console.log('Ingested config examples into Postgres.');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });