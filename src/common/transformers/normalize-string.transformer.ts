export function normalizeString({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}
