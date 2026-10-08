import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/http";
import type { Settings } from "../schema";
import { toSettings } from "./mappers";
import type { UpsertSettingsInput } from "./schema";

const SETTINGS_ID = 1; // single-user app: there is exactly one settings row (enforced by a CHECK)

/** The settings row, or null before onboarding is finished. */
export async function getSettings(): Promise<Settings | null> {
  const row = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
  return row ? toSettings(row) : null;
}

/** Creates the row on first save (onboarding), updates it afterwards. */
export async function saveSettings(
  input: UpsertSettingsInput,
): Promise<Settings> {
  const existing = await prisma.settings.findUnique({
    where: { id: SETTINGS_ID },
  });

  // Amounts are stored without a currency, so changing it later would silently relabel old trades.
  if (
    existing &&
    existing.currency !== input.currency &&
    (await prisma.trade.count()) > 0
  ) {
    throw new HttpError(
      409,
      "The currency cannot be changed after you have logged trades.",
    );
  }

  const row = await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...input },
    update: input,
  });
  return toSettings(row);
}
