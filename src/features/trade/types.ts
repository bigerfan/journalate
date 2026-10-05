import { z } from "zod";

export type Side = "long" | "short";

// ---------- Settings (from onboarding) ----------
export const SettingsSchema = z.object({
  startingBalance: z.number().positive(),
  currency: z.string().min(1),
  maxRiskPct: z.number().positive().max(100),
  strategies: z.array(z.string()),
});
export type Settings = z.infer<typeof SettingsSchema>;

// ---------- Trade (what we store) ----------
export type Trade = {
  id: string;
  pair: string;
  side: Side;
  entry: number;
  stop: number;
  target?: number;
  size: number; // units of the asset
  riskPct: number; // planned risk % of equity at open
  riskAmount: number; // size * |entry - stop|, stored so R-multiples never drift
  fees: number;
  strategy?: string;
  timeframe?: string;
  notes?: string;
  openedAt: string; // ISO
  createdAt: string;
  updatedAt: string;
};
export type NewTrade = Omit<Trade, "id" | "createdAt" | "updatedAt">;

// ---------- Open-trade form ----------
// A factory because the max risk comes from the user's settings.
export const makeTradeFormSchema = (maxRiskPct: number) =>
  z
    .object({
      pair: z.string().trim().min(1, "Enter a pair, e.g. BTCUSDT"),
      side: z.enum(["long", "short"]),
      entry: z
        .number({ message: "Enter the entry price" })
        .positive("Must be above 0"),
      stop: z
        .number({ message: "Enter a stop loss" })
        .positive("Must be above 0"),
      target: z.number().positive("Must be above 0").optional(),
      size: z.number({ message: "Enter a size" }).positive("Must be above 0"),
      riskPct: z
        .number({ message: "Enter the risk %" })
        .positive("Must be above 0")
        .max(maxRiskPct, `Your max risk per trade is ${maxRiskPct}%`),
      fees: z.number().min(0, "Cannot be negative").optional(),
      strategy: z.string().optional(),
      timeframe: z.string().optional(),
      openedAt: z.string().min(1, "Pick a date"),
      notes: z.string().optional(),
    })
    .superRefine((v, ctx) => {
      const long = v.side === "long";
      if (long ? v.stop >= v.entry : v.stop <= v.entry) {
        ctx.addIssue({
          code: "custom",
          path: ["stop"],
          message: long
            ? "For a long, the stop must be below entry"
            : "For a short, the stop must be above entry",
        });
      }
      if (
        v.target !== undefined &&
        (long ? v.target <= v.entry : v.target >= v.entry)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["target"],
          message: long
            ? "For a long, the target must be above entry"
            : "For a short, the target must be below entry",
        });
      }
    });

export type TradeFormValues = z.infer<ReturnType<typeof makeTradeFormSchema>>;
