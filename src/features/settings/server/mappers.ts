import type { Settings as DbSettings } from "@/generated/prisma/client";
import type { Settings } from "../schema";

// Prisma returns Decimal objects; the UI works with plain numbers.
// The internal id (always 1) and updatedAt are not part of the UI type, so they're dropped here.
export const toSettings = (s: DbSettings): Settings => ({
  startingBalance: s.startingBalance.toNumber(),
  currency: s.currency,
  maxRiskPct: s.maxRiskPct.toNumber(),
  strategies: s.strategies,
});
