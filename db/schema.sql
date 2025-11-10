-- Enable pgvector for embeddings and FTS for lexical search
CREATE EXTENSION IF NOT EXISTS vector;

-- Fields: atomic records per setting/property per chart
CREATE TABLE IF NOT EXISTS fields (
  id BIGSERIAL PRIMARY KEY,
  chart_type TEXT NOT NULL,
  owner_class TEXT,
  key TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('settings','properties')),
  description TEXT,
  data_type TEXT,
  default_value TEXT,
  inherited_from TEXT,
  doc_url TEXT,
  synonyms JSONB,
  examples TEXT[],
  source_version TEXT,
  scraped_at TIMESTAMPTZ,
  text_tsvector TSVECTOR,
  embedding VECTOR(768)
);

-- Prevent duplicate field entries per chart/kind/key
CREATE UNIQUE INDEX IF NOT EXISTS fields_chart_kind_key_unique
  ON fields (chart_type, kind, key);

-- Vector index for ANN search
CREATE INDEX IF NOT EXISTS fields_embedding_ivfflat
  ON fields USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Lexical index over text
CREATE INDEX IF NOT EXISTS fields_tsv_idx
  ON fields USING gin (text_tsvector);