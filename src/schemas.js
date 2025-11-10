import { z } from 'zod';

// Base schema for a serialized amCharts object, which will be extended.
const baseAmchartsObject = z.object({
  type: z.string().describe('amCharts class name, e.g., "XYChart" or "Scrollbar"'),
  settings: z.record(z.lazy(() => amchartsSerializedValue)).optional(),
  properties: z.record(z.lazy(() => amchartsSerializedValue)).optional(),
  refs: z.record(z.lazy(() => amchartsSerializedObject)).optional(),
});

// The root schema is a serialized object, constrained to XYChart for now to improve determinism.
export const amchartsXYSchema = baseAmchartsObject.extend({
  type: z.literal('XYChart'),
});

// Recursive schema for nested objects.
const amchartsSerializedObject = z.lazy(() => baseAmchartsObject);

// A serialized value can be a primitive, a reference string, a nested object, or an array of values.
const amchartsSerializedValue = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.string().regex(/^#.+$/, 'Reference to an object in refs section, e.g. "#xAxis"'),
    amchartsSerializedObject,
    z.array(z.lazy(() => amchartsSerializedValue)),
  ])
);

export function buildSystemPrompt() {
  return [
    'You generate amCharts v5 JSON configs using the JSON plugin shape.',
    'Output MUST strictly match the Zod schema provided.',
    'Any nested object representing an amCharts component (e.g., for a setting or property) MUST have a "type" field.',
    'Use only fields present in the provided context unless clearly necessary to fulfill the request.',
    'Respect enums and special types (e.g., wheelX/wheelY/layout, Percent/Color via nested objects).',
    'Use refs when an object needs to be reused; reference via "#id" in settings/properties.',
    'Prefer minimal, valid configs that amCharts JSON plugin can parse directly.',
  ].join(' ');
}