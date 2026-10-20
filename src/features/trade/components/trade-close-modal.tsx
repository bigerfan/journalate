"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { getCurrencyFormatter, localNow } from "@/lib/format";
import { closePnl, remainingPct } from "../derive";
import { closeRepo } from "../repo";
import { makeCloseFormSchema, MISTAKES, type CloseFormValues } from "../schema";
import type { Close, Trade } from "../types";
import { Currency } from "@/features/settings/schema";
import { makeFieldProps } from "@/lib/form";

type Props = {
  trade: Trade;
  closes: Close[]; // existing closes of this trade
  currency: string;
  onCancel: () => void;
  onSaved: () => void;
};

const isNum = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n);

// Render with a `key={trade.id}` so the defaults reset for each trade.
export default function CloseTradeDialog({
  trade,
  closes,
  currency,
  onCancel,
  onSaved,
}: Props) {
  const remaining = remainingPct(closes); // % of the original position still open
  const schema = useMemo(
    () => makeCloseFormSchema(trade.openedAt),
    [trade.openedAt],
  );
  const money = useMemo(
    () => getCurrencyFormatter(currency as Currency),
    [currency],
  );
  const qty = useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 8 }),
    [],
  );

  const {
    register,
    control,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CloseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      percent: 100,
      reason: "manual",
      closedAt: localNow(),
      fees: 0,
      mistake: "",
    },
  });

  const [percent, price, fees, reason] = watch([
    "percent",
    "price",
    "fees",
    "reason",
  ]);

  // Live preview
  const sliceOfOriginal = isNum(percent) ? (remaining * percent) / 100 : 0;
  const closingSize = (trade.size * sliceOfOriginal) / 100;
  const pnl =
    isNum(price) && sliceOfOriginal > 0
      ? closePnl(trade, {
          percent: sliceOfOriginal,
          price,
          fees: isNum(fees) ? fees : 0,
        })
      : null;
  const sliceRisk = (trade.riskAmount * sliceOfOriginal) / 100;
  const r = pnl !== null && sliceRisk > 0 ? pnl / sliceRisk : null;
  const remainingAfter = Math.max(0, remaining - sliceOfOriginal);

  const field = makeFieldProps(register, errors);

  const onSubmit = async (v: CloseFormValues) => {
    try {
      await closeRepo.create({
        tradeId: trade.id,
        percent: (remaining * v.percent) / 100, // stored as % of the original size
        price: v.price,
        reason: v.reason,
        fees: v.fees ?? 0,
        mistake: v.mistake || undefined,
        note: v.note?.trim() || undefined,
        closedAt: new Date(v.closedAt).toISOString(),
        imageUrl: v.imageUrl,
      });
      onSaved();
    } catch (e) {
      setError("root.server", {
        message: e instanceof Error ? e.message : "ثبت بستن معامله انجام نشد.",
      });
    }
  };

  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>
          بستن معامله {trade.pair} ({trade.side === "long" ? "لانگ" : "شورت"})
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {errors.root?.server && (
              <Alert severity="error">{errors.root.server.message}</Alert>
            )}

            <Box>
              <TextField
                label="مقدار بستن (٪ از حجم باقی‌مانده)"
                fullWidth
                autoFocus
                {...field("percent", "number")}
              />
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1, alignItems: "center", flexWrap: "wrap" }}
              >
                {[25, 50, 75, 100].map((n) => (
                  <Chip
                    key={n}
                    label={`${n}٪`}
                    size="small"
                    variant={percent === n ? "filled" : "outlined"}
                    onClick={() =>
                      setValue("percent", n, { shouldValidate: true })
                    }
                  />
                ))}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  حجم باز فعلی: {qty.format((trade.size * remaining) / 100)} (
                  {remaining.toFixed(1)}٪ از حجم اولیه)
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                قیمت خروج
              </Typography>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    exclusive
                    fullWidth
                    size="small"
                    value={field.value}
                    onChange={(_, v) => {
                      if (!v) return;
                      field.onChange(v);
                      if (v === "stop")
                        setValue("price", trade.stop, { shouldValidate: true });
                      if (v === "target" && trade.target !== undefined)
                        setValue("price", trade.target, {
                          shouldValidate: true,
                        });
                    }}
                    sx={{ mb: 2 }}
                  >
                    <ToggleButton value="stop">حد ضرر</ToggleButton>
                    <ToggleButton
                      value="target"
                      disabled={trade.target === undefined}
                    >
                      حد سود
                    </ToggleButton>
                    <ToggleButton value="manual">دستی</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
              <TextField
                label="قیمت"
                fullWidth
                {...field("price", "number", {
                  readOnly: reason !== "manual",
                })}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              }}
            >
              <TextField
                label={`کارمزد خروج (${currency})`}
                {...field("fees", "number")}
              />
              <TextField
                label="تاریخ بستن"
                {...field("closedAt", "datetime-local")}
              />
            </Box>

            <Controller
              name="mistake"
              control={control}
              render={({ field }) => (
                <TextField select label="اشتباه (اختیاری)" {...field}>
                  <MenuItem value="">بدون مورد</MenuItem>
                  {MISTAKES.map((m) => {
                    const labels: Record<string, string> = {
                      FOMO: "ورود از روی ترس جا ماندن",
                      "Moved stop": "جابه‌جایی حد ضرر",
                      "Closed early": "بستن زودهنگام معامله",
                      "Held too long": "باز نگه داشتن بیش از حد معامله",
                      Oversized: "حجم بیش از حد",
                      "Broke my plan": "عمل نکردن به برنامه معاملاتی",
                    };

                    return (
                      <MenuItem key={m} value={m}>
                        {labels[m] ?? m}
                      </MenuItem>
                    );
                  })}
                </TextField>
              )}
            />

            <TextField
              label="لینک تصویر (اختیاری)"
              placeholder="https://"
              {...field("imageUrl")}
            />

            <TextField
              label="یادداشت (اختیاری)"
              multiline
              minRows={2}
              {...field("note")}
            />

            <Box
              sx={{ p: 2, borderRadius: 1, border: 1, borderColor: "divider" }}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  حجم بسته‌شده
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {sliceOfOriginal > 0 ? qty.format(closingSize) : "—"}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  نتیجه
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                  color={
                    pnl === null
                      ? "text.primary"
                      : pnl >= 0
                        ? "success.main"
                        : "error.main"
                  }
                >
                  {pnl !== null
                    ? `${money.format(pnl)}${r !== null ? ` (${r.toFixed(2)}R)` : ""}`
                    : "—"}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  حجم باقی‌مانده بعد از بستن
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {remainingAfter < 1e-8
                    ? "معامله کامل بسته می‌شود"
                    : `${remainingAfter.toFixed(1)}٪ از حجم اولیه`}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onCancel}>انصراف</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "در حال ثبت..." : "بستن معامله"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
