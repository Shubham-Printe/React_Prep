export interface ListResponseEnvelope<T> {
  items: T[];
  page: number;
  limit: number;
  total?: number;
}

/** Builds the standard list response. Omit total for MVP if you don't have it yet. */
export function listResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total?: number
): ListResponseEnvelope<T> {
  const envelope: ListResponseEnvelope<T> = { items, page, limit };
  if (total !== undefined) envelope.total = total;
  return envelope;
}
