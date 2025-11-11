import { z } from 'zod';

// Recursive types for flexible values
export const amchartsSerializedValue = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.record(z.lazy(() => amchartsSerializedValue)), // Nested objects
    z.array(z.lazy(() => amchartsSerializedValue)), // Arrays
  ])
);

// Simple recursive object schema
export const amchartsSerializedObject = z.lazy(() =>
  z.object({
    type: z.string().optional(),
    settings: z.record(amchartsSerializedValue).optional(),
    properties: z.record(amchartsSerializedValue).optional(),
    refs: z.record(amchartsSerializedValue).optional(),
  })
);

// Main XYChart schema - 4 top-level keys only
export const amchartsXYChartSchema = z.object({
  type: z.string().describe('amCharts class name, e.g., "XYChart"'),
  settings: z.record(amchartsSerializedValue).optional().describe('Chart settings'),
  properties: z.record(amchartsSerializedValue).optional().describe('Chart properties'),
  refs: z.record(amchartsSerializedObject).optional().describe('Reusable component references'),
});

// System prompt for the model.
export function buildSystemPrompt() {
  return [
    'You generate amCharts v5 JSON configs using the JSON plugin shape.',
    'Output MUST strictly match the Zod schema provided.',
    'Any nested object representing an amCharts component (e.g., for a setting or property) MUST have a "type" field.',
    'Component-like settings (e.g. `cursor`) must be objects with a `type`, not strings.',
    'The `properties` field should not be used for component settings; it is for raw, non-component properties.',
    'Do not include empty objects (e.g., `{}`).',
    'Use only fields present in the provided context unless clearly necessary to fulfill the request.',
    'You will also be provided with `config_examples` which are relevant examples of chart configurations that you can use as a reference.',
    'Respect enums and special types (e.g., wheelX/wheelY/layout, Percent/Color via nested objects).',
    'Use refs when an object needs to be reused; reference via "#id" in settings/properties.',
    'The `refs` section must contain full object definitions, not strings.',
    'Prefer minimal, valid configs that amCharts JSON plugin can parse directly.',
  ].join(' ');
}