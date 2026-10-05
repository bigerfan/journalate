import { KEYS, read, write } from "../shared/local-storage";
import { Settings, SettingsSchema } from "./types";

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

// Equity = starting balance + realized P&L. Closes don't exist yet, so for now it's just the
// starting balance. Replace the body once the close flow is built.
export async function currentEquity(settings: Settings): Promise<number> {
  return settings.startingBalance;
}
