import { z } from "zod";

// A factory because the max risk comes from the user's settings.
export const makeTradeFormSchema = (maxRiskPct: number) =>
  z
    .object({
      pair: z.string().trim().min(1, "جفت‌ارز رو وارد کن؛ مثلاً BTCUSDT"),
      side: z.enum(["long", "short"]),
      entry: z
        .number({ message: "قیمت ورود رو وارد کن" })
        .positive("قیمت باید بیشتر از صفر باشه"),
      stop: z
        .number({ message: "حد ضرر رو وارد کن" })
        .positive("قیمت باید بیشتر از صفر باشه"),
      target: z.number().positive("قیمت باید بیشتر از صفر باشه").optional(),
      size: z
        .number({ message: "حجم معامله رو وارد کن" })
        .positive("حجم باید بیشتر از صفر باشه"),
      riskPct: z
        .number({ message: "درصد ریسک رو وارد کن" })
        .positive("ریسک باید بیشتر از صفر باشه")
        .max(maxRiskPct, `حداکثر ریسک هر معامله ${maxRiskPct}٪ است`),
      imageUrl: z.preprocess(
        (value: string) => (value === "" ? undefined : value),
        z.url().optional(),
      ),
      fees: z.number().min(0, "کارمزد نمی‌تونه منفی باشه").optional(),
      strategy: z.string().optional(),
      timeframe: z.string().optional(),
      openedAt: z.string().min(1, "تاریخ رو انتخاب کن"),
      notes: z.string().optional(),
    })
    .superRefine((v, ctx) => {
      const long = v.side === "long";
      if (long ? v.stop >= v.entry : v.stop <= v.entry) {
        ctx.addIssue({
          code: "custom",
          path: ["stop"],
          message: long
            ? "در معامله لانگ، حد ضرر باید پایین‌تر از قیمت ورود باشه"
            : "در معامله شورت، حد ضرر باید بالاتر از قیمت ورود باشه",
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
            ? "در معامله لانگ، حد سود باید بالاتر از قیمت ورود باشه"
            : "در معامله شورت، حد سود باید پایین‌تر از قیمت ورود باشه",
        });
      }
    });

export type TradeFormValues = z.infer<ReturnType<typeof makeTradeFormSchema>>;

// ---------- Close form ----------
export const MISTAKES = [
  "FOMO",
  "Moved stop",
  "Closed early",
  "Held too long",
  "Oversized",
  "Broke my plan",
] as const;

export const makeCloseFormSchema = (openedAt: string) =>
  z
    .object({
      // % of the REMAINING position; the dialog converts it to % of the original when saving
      percent: z
        .number({ message: "درصد حجمی که می‌خوای ببندی رو وارد کن" })
        .positive("درصد باید بیشتر از صفر باشه")
        .max(100, "نمی‌تونی بیشتر از ۱۰۰٪ حجم باقی‌مونده رو ببندی"),
      reason: z.enum(["stop", "target", "manual"]),
      price: z
        .number({ message: "قیمت خروج رو وارد کن" })
        .positive("قیمت باید بیشتر از صفر باشه"),
      fees: z.number().min(0, "کارمزد نمی‌تونه منفی باشه").optional(),
      closedAt: z.string().min(1, "تاریخ رو انتخاب کن"),
      mistake: z.string().optional(),
      note: z.string().optional(),
      imageUrl: z.preprocess(
        (value: string) => (value === "" ? undefined : value),
        z.url().optional(),
      ),
    })
    .refine(
      (v) => new Date(v.closedAt).getTime() >= new Date(openedAt).getTime(),
      {
        path: ["closedAt"],
        message: "تاریخ بستن معامله نمی‌تونه قبل از تاریخ باز شدنش باشه",
      },
    );

export type CloseFormValues = z.infer<ReturnType<typeof makeCloseFormSchema>>;
