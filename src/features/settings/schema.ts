import { z } from "zod";

export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "USDT",
  "USDC",
  "CAD",
  "AUD",
] as const;

export const SettingsSchema = z.object({
  startingBalance: z
    .number({ message: "Enter your starting balance" })
    .positive("Must be above 0"),
  currency: z.string().min(1, "Pick a currency"),
  maxRiskPct: z
    .number({ message: "Enter your max risk per trade" })
    .positive("Must be above 0")
    .max(100, "Cannot exceed 100%"),
  strategies: z.array(z.string()),
});

export type Settings = z.infer<typeof SettingsSchema>;
