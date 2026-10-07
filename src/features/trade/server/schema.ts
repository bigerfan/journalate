import { z } from "zod";

// These are API schemas (the stored shape), not the form schemas. The server re-checks every
// rule the UI enforces, and computes riskAmount itself instead of trusting the client.
const httpsUrl = z
  .url()
  .refine((u) => u.startsWith("https://"), "Must be an https link");

export const IdSchema = z.object({ id: z.string().uuid() });

export const CreateTradeSchema = z
  .object({
    pair: z
      .string()
      .trim()
      .min(1)
      .transform((s) => s.toUpperCase()),
    side: z.enum(["long", "short"]),
    entry: z.number().positive(),
    stop: z.number().positive(),
    target: z.number().positive().optional(),
    size: z.number().positive(),
    riskPct: z.number().positive(),
    fees: z.number().min(0).default(0),
    strategy: z.string().trim().optional(),
    timeframe: z.string().trim().optional(),
    notes: z.string().optional(),
    imageUrl: httpsUrl.optional(),
    openedAt: z.coerce.date(),
  })
  .superRefine((v, ctx) => {
    const long = v.side === "long";
    if (long ? v.stop >= v.entry : v.stop <= v.entry) {
      ctx.addIssue({
        code: "custom",
        path: ["stop"],
        message: "Stop is on the wrong side of entry",
      });
    }
    if (
      v.target !== undefined &&
      (long ? v.target <= v.entry : v.target >= v.entry)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["target"],
        message: "Target is on the wrong side of entry",
      });
    }
  });
export type CreateTradeInput = z.infer<typeof CreateTradeSchema>;

export const CreateCloseSchema = z.object({
  percent: z.number().positive().max(100), // % of the ORIGINAL position
  price: z.number().positive(),
  reason: z.enum(["stop", "target", "manual"]),
  fees: z.number().min(0).default(0),
  mistake: z.string().optional(),
  note: z.string().optional(),
  imageUrl: httpsUrl.optional(),
  closedAt: z.coerce.date(),
});
export type CreateCloseInput = z.infer<typeof CreateCloseSchema>;
