import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL || '';

export function getClient() {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL env var is required to connect to Postgres');
  }
  const client = new pg.Client({ connectionString: DATABASE_URL });
  return client;
}

export async function migrate() {
  const client = getClient();
  await client.connect();
  try {
    const schemaPath = path.resolve(__dirname, '../db/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(sql);
  } finally {
    await client.end();
  }
}

export async function drop() {
  const client = getClient();
  await client.connect();
  try {
    await client.query('DROP TABLE IF EXISTS config_examples;');
  } finally {
    await client.end();
  }
}