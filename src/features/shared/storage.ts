import {
  SettingsSchema,
  type NewTrade,
  type Settings,
  type Trade,
} from "@/features/trade/types";

const SCHEMA_VERSION = 1;
const KEYS = { settings: "tj:settings", trades: "tj:trades" } as const;

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return (JSON.parse(raw) as { data: T }).data;
  } catch {
    return null; // corrupted blob: treat as empty (add a migration/repair step later)
  }
}

function write(key: string, data: unknown) {
  localStorage.setItem(
    key,
    JSON.stringify({ schemaVersion: SCHEMA_VERSION, data }),
  );
}

// Every method is async so swapping in an API-backed repo later changes nothing in the UI.
export const settingsRepo = {
  async get(): Promise<Settings | null> {
    const parsed = SettingsSchema.safeParse(read(KEYS.settings));
    return parsed.success ? parsed.data : null;
  },
  async save(settings: Settings): Promise<void> {
    write(KEYS.settings, SettingsSchema.parse(settings));
  },
};

export const tradeRepo = {
  async list(): Promise<Trade[]> {
    return read<Trade[]>(KEYS.trades) ?? [];
  },
  async create(input: NewTrade): Promise<Trade> {
    const now = new Date().toISOString();
    const trade: Trade = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    write(KEYS.trades, [trade, ...(await this.list())]);
    return trade;
  },
};

// Equity = starting balance + realized P&L. Closes don't exist yet, so for now it's just the
// starting balance. Replace the body once the close flow is built.
export async function currentEquity(settings: Settings): Promise<number> {
  return settings.startingBalance;
}
