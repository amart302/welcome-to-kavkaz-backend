export function normalizeNumber({ value }: { value: unknown }): unknown {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim();

    return normalizedValue ? Number(normalizedValue) : null;
  }

  return value;
}
