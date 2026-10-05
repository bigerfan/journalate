import z from "zod";

// ---------- Settings (from onboarding) ----------
export const SettingsSchema = z.object({
  startingBalance: z.number().positive(),
  currency: z.string().min(1),
  maxRiskPct: z.number().positive().max(100),
  strategies: z.array(z.string()),
});
export type Settings = z.infer<typeof SettingsSchema>;
