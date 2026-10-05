// ---------- Open-trade form ----------

import z from "zod";

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
