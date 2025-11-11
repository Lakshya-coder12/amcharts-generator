# Doc Generator — End-to-End Guide

This repository generates valid amCharts v5 JSON configurations from natural language requests, using a hybrid retrieval approach (semantic embeddings + PostgreSQL full‑text search) to guide a chat model. It also hosts a small preview server that renders the generated chart configuration in the browser via the amCharts JSON plugin.

This guide explains every file (except the `output` folder contents) and the database schema and index design. It also details how the generated JSON is set and used in `public/app.js`.


## Overview

- You describe a chart in plain English.
- The system retrieves relevant amCharts field docs and example configs from Postgres using a hybrid search (vector similarity + full‑text search).
- A constrained JSON schema (from Zod) guides the chat model to emit a valid amCharts JSON config.
- A normalization step ensures all references (`xAxis`, `yAxis`, `data`, etc.) use `#`‑prefixed tokens aligned with declared `refs`.
- The preview server serves the generated config to the browser; `public/app.js` renders it using the amCharts JSON plugin.


## Folder Structure

- `src/` — core code: retrieval, generation, schema, ingestion, preview server, scrapers, and examples.
- `public/` — browser preview app and assets.
- `db/` — SQL schema for Postgres tables.
- `output/` — generated artifacts (configs and debug files). Explained under “How the generated JSON is set and used in app.js”.


## src Files Explained

### src/schemas.js

Defines the structured Zod schema for the amCharts v5 JSON we generate and the system prompt used to steer the model.

Key parts:
- Zod schemas for common components (`AxisRendererX/Y`, `Tooltip`, `XYCursor`, `Scrollbar`).
- Axis schemas: `xAxisSchema` (unified to avoid complex unions), `yAxisSchema` (value axis).
- Data schema: `dataArraySchema` ensures `data` is an array of flat objects with primitive values only.
- Series schema: each series includes `settings.xAxis`, `settings.yAxis`, `valueXField/categoryXField`, `valueYField`, and `properties.data` — these are references and must align with `refs`.
- Chart schemas: `chartSettingsSchema`, `chartPropertiesSchema` (`xAxes`, `yAxes`, `series`).
- `refsSchema`: defines the reusable components (`xAxis`, `yAxis`, `data`) you can reference elsewhere.
- `amchartsXYChartSchema`: the root schema combining `type`, optional `settings`, required `properties`, and optional `refs`.
- `buildSystemPrompt()`: a strict set of rules the model must follow, notably:
  - Always declare reusable objects under `refs`.
  - Always reference via `"#id"` (e.g., `"#xAxis"`, `"#yAxis"`, `"#data"`).
  - Never use references unless they are first defined in `refs`.
  - Data must be an array of flat objects with primitive values (no nested objects, no extended JSON wrappers).

Design choice:
- Keep the JSON Schema (derived from Zod) simple and model‑friendly. Pattern‑level enforcement for `#` was avoided because some chat APIs reject complex schemas; instead we rely on prompt + a normalization pass in `generate.js` to reliably prefix `#`.


### src/generate.js

Orchestrates the config generation pipeline.

Key steps:
- `retrieveContext(chartType, userQuery)`: fetches relevant field docs and example configs (see `src/retrieve.js`).
- Builds messages with the system prompt and contextual snippets of fields/examples.
- Calls the chat model with a Zod‑derived JSON Schema (`zod-to-json-schema`) to constrain the output to the expected shape.
- Parses model output and normalizes references to include a `#` prefix if the model omitted it. Normalization covers:
  - `properties.xAxes` / `properties.yAxes` items
  - `series[i].settings.xAxis` / `series[i].settings.yAxis`
  - `series[i].properties.data`
- Validates the normalized JSON with Zod (`amchartsXYChartSchema`).
- Writes two artifacts into `output/`:
  - `generated.<chartType>.json` — used by the preview server.
  - `preview.json` — debug copy (not used by the server).

Design choices:
- Hybrid validation: constrain at generation time (JSON Schema) and again locally (Zod). This catches model format issues early and ensures the preview renders cleanly.
- Post‑generation normalization is pragmatic — it guarantees `"#"`‑prefixed references without requiring schema regex patterns that some model providers reject.


### src/retrieve.js

Implements hybrid retrieval for contextual guidance.

Key elements:
- Embeddings via Ollama (`nomic-embed-text:v1.5`) produce 768‑dim vectors.
- `buildTsQuery(query)`: tokenizes user query and ANDs terms for simple full‑text search.
- Retrieval flow:
  - Semantic examples: queries `config_examples` by `embedding` similarity.
  - Fields: either direct lookup for one-word queries or a weighted ranking for multi‑term queries:
    - Score = `0.7 * semantic_similarity + 0.3 * lexical_rank` (tsvector rank).
- Cleans descriptions to avoid leaking doc URLs into the prompt.

Design choices:
- Hybrid search balances semantic relevance (embeddings) with precise lexical matching (tsvector), mitigating the weaknesses of either signal alone.
- Direct lookup handles queries like `xAxis` or `wheelY` quickly and precisely.


### src/ingest.js

Populates Postgres with scraped field metadata and curated config examples.

Flow:
- Reads `output/<chart>.settings.json` and `output/<chart>.properties.json` (produced by `src/scrape.js`). If missing, skips field ingestion.
- Builds field records for `settings` and `properties` with descriptive text.
- Embeds each record’s text and stores it in `fields.embedding`.
- Computes `text_tsvector` via `to_tsvector('simple', text)` and stores it in `fields.text_tsvector`.
- Ingests curated examples from `src/examples.js` into `config_examples` with their own embeddings.
- Uses UPSERT for `config_examples` (`UNIQUE(chart_type, key)`). For `fields`, it attempts UPSERT on `(chart_type, kind, key)`.

Important note:
- The provided `db/schema.sql` does not include all columns referenced by `ingest.js` (e.g., `data_type`, `default_value`, `inherited_from`, `synonyms`, `examples`, `source_version`, `scraped_at`) nor a unique constraint on `(chart_type, kind, key)`. If you run ingestion as‑is, you’ll need to add those columns and constraints (see “Schema and Indexes” for recommendations) or adjust `ingest.js` to match the current schema.


### src/db.js

Database utilities.

- `getClient()`: constructs a Postgres client using `DATABASE_URL`.
- `migrate()`: applies `db/schema.sql`.
- `drop()`: drops the `config_examples` table only.

Design choice:
- Dropping only `config_examples` preserves scraped `fields` across runs while allowing `config_examples` to be refreshed. If you want full resets, extend `drop()` to include `fields`.


### src/preview.js

Minimal HTTP server for local preview.

- Serves static assets from `public/`.
- Serves the latest generated config from `output/generated.<chartType>.json` at `GET /config?chart=<chartType>` (defaults to `xychart`).
- Logs where it is listening (default `http://localhost:5500/`, overridable via `PREVIEW_PORT`).


### src/examples.js

Curated list of amCharts config examples, each with a `query` and a `config`. Used by `src/ingest.js` to seed the `config_examples` table.

Notable traits:
- Examples consistently declare `refs` (`xAxis`, `yAxis`, `data`) and reference them via `"#"` tokens.
- Data arrays hold flat objects with primitive values — this mirrors the constraints enforced in `schemas.js`.


### src/scrape.js

Scrapes amCharts v5 reference pages to build `settings` and `properties` maps per chart.

- Fetch logic with robust fallback to a text mirror (`r.jina.ai`) if the main site fails.
- Heuristics to parse names and descriptions from HTML headings and surrounding content.
- Table and plain‑text parsers to handle multiple documentation formats.
- Writes debug snapshots to `output/<chartType>.debug.txt` when parsing plain text.

Design choice:
- Heuristic parsing aims for resilience across doc format variations and is conservative about what it trusts, filtering non‑field content and normalizing whitespace.


## public Files Explained

### public/index.html

- Loads amCharts v5 core, XY, Animated theme, and the JSON plugin from CDN.
- Loads `public/app.js` to bootstrap the preview.

### public/styles.css

- Basic styling and full‑viewport height for `#chartdiv`.

### public/app.js

Render pipeline:
- `loadConfig()` requests `/config` from the preview server.
  - If not found, it prints a helpful message in `#status`.
  - On success, it prints the loaded JSON.
- In `am5.ready(...)` it:
  - Creates a `Root` and applies the Animated theme.
  - Sets date parsing for `valueX` fields (`root.dateFormatter.setAll({ dateFields: ['valueX'] })`).
  - Uses `am5plugins_json.JsonParser` to parse the loaded config and attach the chart under `root.container`.

How refs are used:
- The JSON plugin resolves references like `"#xAxis"`, `"#yAxis"`, and `"#data"` against the top‑level `refs` object.
- This allows axes and data arrays to be declared once under `refs` and reused across `properties.xAxes`, `properties.yAxes`, and each `series`.


## db/schema.sql — Tables and How They Work

The schema defines two tables:

- `fields`
  - `id SERIAL PRIMARY KEY`
  - `chart_type TEXT NOT NULL`
  - `owner_class TEXT NOT NULL`
  - `key TEXT NOT NULL`
  - `kind TEXT NOT NULL` — either `settings` or `properties`
  - `description TEXT`
  - `doc_url TEXT`
  - `embedding vector(768)` — requires the `pgvector` extension
  - `text_tsvector tsvector` — stores normalized text for full‑text search

- `config_examples`
  - `id SERIAL PRIMARY KEY`
  - `chart_type TEXT NOT NULL`
  - `key TEXT NOT NULL`
  - `config JSONB NOT NULL`
  - `embedding vector(768)` — requires `pgvector`
  - `UNIQUE(chart_type, key)` — supports UPSERT in ingestion

How ingestion uses these:
- `src/ingest.js` computes embeddings and `text_tsvector` for each `fields` record and UPSERTs `config_examples` with embeddings so retrieval can do hybrid ranking.
- `src/retrieve.js` combines vector similarity (`embedding <-> query_vector`) and tsvector rank (`ts_rank_cd(text_tsvector, to_tsquery('simple', ts_query))`).

Recommended additions (for production):
- Ensure `pgvector` is installed and enabled:
  - `CREATE EXTENSION IF NOT EXISTS vector;`
- Add a GIN index for `text_tsvector` to accelerate lexical search:
  - `CREATE INDEX IF NOT EXISTS fields_tsv_idx ON fields USING GIN (text_tsvector);`
- Add an IVFFLAT index for `embedding` to accelerate semantic search (approximate, tunable):
  - `CREATE INDEX IF NOT EXISTS fields_embedding_idx ON fields USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);`
  - `CREATE INDEX IF NOT EXISTS config_examples_embedding_idx ON config_examples USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);`
- Add a unique constraint to match ingestion’s UPSERT for `fields`:
  - `ALTER TABLE fields ADD CONSTRAINT fields_chart_kind_key_uniq UNIQUE (chart_type, kind, key);`
- Consider an index on `config_examples (chart_type, key)` — it’s implicit via `UNIQUE`, but a dedicated index may help depending on your workload.


## Design of Hybrid Search and Indexes

Why embeddings (pgvector)?
- Embeddings capture semantic relatedness. A request like “traffic over 8 weeks” should surface examples and fields about `DateAxis`, `LineSeries`, and “visitors”, even if the exact words differ.
- We store a 768‑dim vector (from `nomic-embed-text:v1.5`) alongside each record and example, enabling similarity search via `<->` operators.

Why tsvector (full‑text search)?
- Lexical precision matters. Queries like `wheelY` or `valueXField` need exact matches to surface the right fields.
- `tsvector` with `to_tsquery('simple', ...)` provides fast, term‑based matching and ranking (`ts_rank_cd`).

Why hybrid?
- Embeddings can be fuzzy; tsvector can be brittle. Combining signals addresses both:
  - Semantic similarity (0.7 weight) ranks conceptually relevant items.
  - Lexical rank (0.3 weight) favors exact matches and precise terminology.
- This mix improves context quality, which in turn improves the model’s accuracy and adherence to amCharts structure.

Index benefits:
- GIN index on `text_tsvector` yields fast full‑text filtering and ranking.
- IVFFLAT index on `embedding` supports efficient nearest‑neighbor search at scale.
- Unique constraints enable reliable UPSERT semantics for curated data.

Dictionary choice:
- The schema uses the `simple` dictionary to avoid stemming/stopword removal, which fits technical keys (e.g., `valueXField`, `wheelY`). If you need English stemming for descriptions, consider `to_tsvector('english', ...)` for that column and update the query accordingly.


## How the Generated JSON Is Set and Used in public/app.js

- `src/generate.js` writes the validated chart config to `output/generated.<chartType>.json`.
- `src/preview.js` exposes `GET /config?chart=<chartType>` and streams that file’s content.
- `public/app.js` fetches `/config` on load and prints the JSON in the `#status` element for inspection.
- In `am5.ready(...)`, the code creates a root, applies the Animated theme, sets date parsing for `valueX` fields, and invokes `am5plugins_json.JsonParser.parse(config, { parent: root.container })`.
- The parser reads:
  - `type`: the chart class (`XYChart`).
  - `settings`: chart‑level settings (cursor, scrollbar, pan/zoom behavior).
  - `properties`: `xAxes`, `yAxes`, `series` definitions.
  - `refs`: reusable objects (`xAxis`, `yAxis`, `data`) referenced elsewhere via `"#"` tokens.
- Reference resolution: any string beginning with `#` in a reference field (e.g., `xAxis: "#xAxis"`, `data: "#data"`) is resolved against `refs`. This guarantees you can declare components once and reuse them.


## Running and Operations

Environment variables:
- `DATABASE_URL` — PostgreSQL connection string.
- `OLLAMA_HOST` — Ollama server (default `http://localhost:11434`).
- `OLLAMA_EMBED_MODEL` — embedding model (default `nomic-embed-text:v1.5`).
- `PREVIEW_PORT` — preview server port (defaults to `5500`).

Typical flows:
- Preview server:
  - `node src/preview.js`
  - Open `http://localhost:<port>/` and it will fetch `/config`.
- Generate a config:
  - `node src/generate.js xychart "Create a line chart showing daily website traffic over 7 days"`
  - This writes `output/generated.xychart.json`.
- Ingest data:
  - Ensure Postgres is running and `DATABASE_URL` is set.
  - Ensure `pgvector` extension is installed (`CREATE EXTENSION IF NOT EXISTS vector;`).
  - Optionally add indexes from the recommendations section.
  - `node src/ingest.js xychart`

Operational notes:
- If ingestion errors due to missing columns or constraints, update `db/schema.sql` to include the recommended columns and unique constraint, or simplify the UPSERT in `ingest.js`.
- The preview server reads `generated.<chartType>.json`. `preview.json` is a debug artifact only.
- If the chat API rejects complex JSON schemas, keep `schemas.js` as is and rely on the normalization step in `generate.js` to enforce `"#"` references.


## FAQ and Cross‑Question Readiness

- Why not enforce `"#"` in the JSON Schema directly?
  - Some chat APIs reject schemas with regex patterns on strings. We found prompt + normalization more reliable. Zod still validates the overall structure locally.

- Why both embeddings and tsvector?
  - Embeddings provide semantic recall; tsvector provides exact lexical precision. Many chart field keys are technical terms; hybrid search catches both intents.

- Why `vector(768)`?
  - Matches the embedding dimensionality of `nomic-embed-text:v1.5`. If you switch models, update the column width and any indexes.

- Why is `drop()` only removing `config_examples`?
  - We often want to preserve scraped field data but refresh curated examples per run. You can extend `drop()` if your workflow needs full resets.

- What happens if references are missing or not prefixed with `#`?
  - The system prompt forbids missing refs; the normalization step adds `#` prefixes when the model omits them. The preview will fail if refs are missing — normalization + validation prevent this.

- Can the retrieval weighting be tuned?
  - Yes. Adjust the `0.7/0.3` weights in `src/retrieve.js` to fit your dataset and query mix.

- Do I need indexes?
  - For small datasets, not strictly. For realistic sizes, GIN on `text_tsvector` and IVFFLAT on `embedding` make a major difference in responsiveness and throughput.


## Closing Notes

This setup is intentionally pragmatic:
- Constrain the model tightly with a schema and strong prompt.
- Retrieve high‑quality context via hybrid search.
- Normalize references and validate locally to eliminate common errors.
- Keep the preview path simple and transparent so you can see exactly what was generated and how it renders.

For production, adopt the recommended indexes and constraints, harden ingestion to match your schema, and monitor retrieval quality to tune the weighting and dictionaries over time.