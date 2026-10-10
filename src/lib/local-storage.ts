export const SCHEMA_VERSION = 1;
export const KEYS = { settings: "tj:settings", trades: "tj:trades" } as const;

export function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return (JSON.parse(raw) as { data: T }).data;
  } catch {
    return null; // corrupted blob: treat as empty (add a migration/repair step later)
  }
}

export function write(key: string, data: unknown) {
  localStorage.setItem(
    key,
    JSON.stringify({ schemaVersion: SCHEMA_VERSION, data }),
  );
}
