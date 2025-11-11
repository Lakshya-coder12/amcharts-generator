CREATE TABLE IF NOT EXISTS fields (
  id SERIAL PRIMARY KEY,
  chart_type TEXT NOT NULL,
  owner_class TEXT NOT NULL,
  key TEXT NOT NULL,
  kind TEXT NOT NULL,
  description TEXT,
  doc_url TEXT,
  embedding vector(768),
  text_tsvector tsvector
);

CREATE TABLE IF NOT EXISTS config_examples (
  id SERIAL PRIMARY KEY,
  chart_type TEXT NOT NULL,
  key TEXT NOT NULL,
  config JSONB NOT NULL,
  embedding vector(768),
  UNIQUE(chart_type, key)
);