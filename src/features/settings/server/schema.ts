import { z } from "zod";
import { CURRENCIES } from "../schema";

// API schema for PUT /api/settings (the stored shape). Stricter than the form schema:
// the currency must be one we support, and the numbers must fit the database columns.
export const UpsertSettingsSchema = z.object({
  // numeric(20,8) holds up to 12 digits before the decimal point
  startingBalance: z.number().positive().lt(1e12),
  currency: z.enum(CURRENCIES),
  // numeric(7,4), and a risk above 100% makes no sense
  maxRiskPct: z.number().positive().max(100),
  strategies: z
    .array(z.string().trim().min(1).max(50))
    .max(50)
    .transform((list) => [...new Set(list)]), // drop duplicates, keep order
});

export type UpsertSettingsInput = z.infer<typeof UpsertSettingsSchema>;
