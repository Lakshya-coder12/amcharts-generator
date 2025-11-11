import { z } from 'zod';

// --- Structured Zod schema based on examples.js ---

// Common component bits
const axisRendererXSchema = z.object({ type: z.string() });
const axisRendererYSchema = z.object({ type: z.string() });
const tooltipSchema = z.object({ type: z.string(), settings: z.object({ labelText: z.string() }).optional() });
const xyCursorSchema = z.object({ type: z.string(), settings: z.object({ behavior: z.string().optional() }).optional() });
const scrollbarSchema = z.object({ type: z.string(), settings: z.object({ orientation: z.string().optional() }).optional() });

// Axis components
const baseIntervalSchema = z.object({ timeUnit: z.string(), count: z.number() });

const dateAxisSchema = z.object({ type: z.string(), settings: z.object({ baseInterval: baseIntervalSchema.optional(), maxDeviation: z.number().optional(), renderer: axisRendererXSchema }) });

const categoryAxisSchema = z.object({ type: z.string(), settings: z.object({ renderer: axisRendererXSchema }) });

const valueAxisSchema = z.object({ type: z.string(), settings: z.object({ renderer: axisRendererYSchema, maxDeviation: z.number().optional(), min: z.number().optional(), max: z.number().optional() }) });

// Simplify to a single xAxis schema to avoid JSON Schema unions
const xAxisSchema = z.object({
  type: z.string(),
  settings: z.object({
    renderer: axisRendererXSchema,
    baseInterval: baseIntervalSchema.optional(),
    maxDeviation: z.number().optional(),
  }),
});
const yAxisSchema = valueAxisSchema;

// Data must be array of objects with primitive values
// Enforce primitive values in data objects
const dataItemSchema = z.record(z.union([z.string(), z.number()]));
const dataArraySchema = z.array(dataItemSchema).min(1);

// Series
const seriesSchema = z.object({
  type: z.string(),
  settings: z.object({
    name: z.string().optional(),
    xAxis: z.string(),
    yAxis: z.string(),
    valueXField: z.string().optional(),
    categoryXField: z.string().optional(),
    valueYField: z.string(),
    tooltip: tooltipSchema.optional(),
  }),
  properties: z.object({ data: z.string() }),
});

// Chart settings
const chartSettingsSchema = z.object({
  panX: z.boolean().optional(),
  panY: z.boolean().optional(),
  wheelY: z.enum(['zoomX', 'zoomY']).optional(),
  cursor: xyCursorSchema.optional(),
  scrollbarX: scrollbarSchema.optional(),
});

// Chart properties
const chartPropertiesSchema = z.object({ xAxes: z.array(z.string()).min(1), yAxes: z.array(z.string()).min(1), series: z.array(seriesSchema).min(1) });

// Refs (mandatory when using references)
const refsSchema = z.object({ xAxis: xAxisSchema, yAxis: yAxisSchema, data: dataArraySchema });

// Main XYChart schema (structured)
export const amchartsXYChartSchema = z.object({
  type: z.string().describe('amCharts class name, e.g., "XYChart"'),
  settings: chartSettingsSchema.optional().describe('Chart settings'),
  properties: chartPropertiesSchema.describe('Chart properties'),
  refs: refsSchema.optional().describe('Reusable references: axes and data'),
});

// System prompt for the model.
export function buildSystemPrompt() {
  return [
    'You generate amCharts v5 JSON configs using the JSON plugin shape.',
    'Output MUST strictly match the Zod schema provided.',
    'Any nested object representing an amCharts component (e.g., for a setting or property) MUST have a "type" field.',
    'Component-like settings (e.g. `cursor`, `scrollbarX`) must be objects with a `type`, not strings.',
    'The `properties` field should be used for raw properties; component settings belong in `settings`.',
    'Do not include empty objects (e.g., `{}`).',
    'Use only fields present in the provided context unless clearly necessary to fulfill the request.',
    'You will also be provided with `config_examples` which are relevant examples of chart configurations that you can use as a reference.',
    'Respect enums and special types (e.g., wheelX/wheelY/layout, Percent/Color via nested objects).',
    'Use refs when an object needs to be reused; reference via "#id" in settings/properties.',
    'Important: When using references, define them under the top-level `refs` object and reference them using "#id" (e.g., "#xAxis", "#data"). Do not invent inline `ref` fields; always declare reusable components in `refs`.',
    'Important: ALL references MUST start with "#" (e.g., "#xAxis", "#yAxis", "#data"). Do NOT use plain names like "xAxis" or "data" in reference fields.',
    'Important: Do NOT use any "#id" references unless you FIRST declare the corresponding object in `refs`. If you output "#xAxis"/"#yAxis"/"#data", you MUST also output `refs.xAxis`/`refs.yAxis`/`refs.data` with valid definitions.',
    'Important: Data MUST always be an array of objects only (e.g., [{date: 1704153600000, value: 120}]); do NOT use object-of-arrays or arrays of primitives.',
    'Important: Use plain primitives for data values (numbers/strings). Do NOT use MongoDB Extended JSON wrappers like {"$date": "..."} or {"$numberInt": "..."}. For dates, use millisecond epoch numbers (e.g., 1704153600000) or ISO date strings (e.g., "2024-01-01").',
    'Important: Each data object MUST be flat key→primitive pairs (no nested objects). NEVER output {"$date": ...}, {"$numberInt": ...}, or similar wrappers; use direct numbers/strings only.',
    'For XY charts, properties.xAxes must be ["#xAxis"], properties.yAxes must be ["#yAxis"], each series must reference "#data" AND include settings.xAxis: "#xAxis" and settings.yAxis: "#yAxis".',
    'Prefer minimal, valid configs that amCharts JSON plugin can parse directly.',
  ].join(' ');
}