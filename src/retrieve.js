import 'dotenv/config';
import { getClient } from './db.js';
import { Ollama } from 'ollama';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text:v1.5';
const ollamaClient = new Ollama({ host: OLLAMA_HOST });

async function embedText(text) {
  try {
    const data = await ollamaClient.embeddings({ model: OLLAMA_EMBED_MODEL, prompt: text });
    return data.embedding;
  } catch (err) {
    throw new Error(`Embedding request failed: ${err.message}`);
  }
}

function buildTsQuery(query) {
  // naive term ANDing for simple FTS; improve later
  const terms = query
    .toLowerCase()
    .replace(/["\(\)\|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
  return terms.join(' & ');
}

export async function retrieveContext(chartType, query, topK = 20) {
  const client = getClient();
  await client.connect();
  try {
    const qvec = await embedText(query);
    const embeddingLiteral = `[${qvec.join(',')}]`;
    const tsq = buildTsQuery(query);

    // If the query is a single, specific term, perform a direct lookup.
    if (query.split(/\s+/).length === 1) {
      const directLookupSql = `
        SELECT id, chart_type, owner_class, key, kind, description, doc_url
        FROM fields
        WHERE chart_type = $1 AND key = $2
        LIMIT 1;
      `;
      const directLookupParams = [chartType, query];
      const { rows: directRows } = await client.query(directLookupSql, directLookupParams);
      if (directRows.length > 0) {
        return directRows;
      }
    }

    const sql = `
      SELECT id, chart_type, owner_class, key, kind, description, doc_url,
        (1 - (embedding <-> $1::vector)) AS vec_sim,
        ts_rank_cd(text_tsvector, to_tsquery('simple', $2)) AS lex_rank
      FROM fields
      WHERE chart_type = $3
      ORDER BY (0.7 * (1 - (embedding <-> $1::vector)) + 0.3 * ts_rank_cd(text_tsvector, to_tsquery('simple', $2))) DESC
      LIMIT $4;
    `;
    const params = [embeddingLiteral, tsq, chartType, topK];
    const { rows } = await client.query(sql, params);
    return rows;
  } finally {
    await client.end();
  }
}