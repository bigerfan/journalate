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
    .number({ message: "موجودی اولیه را وارد کنید" })
    .positive("مقدار باید بیشتر از صفر باشد"),
  currency: z.enum(CURRENCIES),
  maxRiskPct: z
    .number({ message: "حداکثر ریسک هر معامله را وارد کنید" })
    .positive("مقدار باید بیشتر از صفر باشد")
    .max(100, "مقدار نمی‌تواند بیشتر از ۱۰۰٪ باشد"),
  strategies: z.array(z.string()),
});

export type Settings = z.infer<typeof SettingsSchema>;
export type Currency = (typeof CURRENCIES)[number];
