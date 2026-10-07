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
import { getCurrencyFormatter, localNow } from "@/features/shared/format";
import { closePnl, remainingPct } from "../derive";
import { closeRepo } from "../repo";
import { makeCloseFormSchema, MISTAKES, type CloseFormValues } from "../schema";
import type { Close, Trade } from "../types";
import { Currency } from "@/features/settings/schema";
import { makeFieldProps } from "@/features/shared/form";

type Props = {
  trade: Trade;
  closes: Close[]; // existing closes of this trade
  currency: string;
  onCancel: () => void;
  onSaved: () => void;
};

const toNum = (v: unknown) => (v === "" || v == null ? undefined : Number(v));
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
      });
      onSaved();
    } catch (e) {
      setError("root.server", {
        message: e instanceof Error ? e.message : "Could not save the close.",
      });
    }
  };

  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>
          Close {trade.pair} {trade.side}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {errors.root?.server && (
              <Alert severity="error">{errors.root.server.message}</Alert>
            )}

            <Box>
              <TextField
                label="Amount to close (% of remaining)"
                fullWidth
                autoFocus
                {...field("percent", "number", {
                  register: { setValueAs: toNum },
                })}
              />
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1, alignItems: "center" }}
              >
                {[25, 50, 75, 100].map((n) => (
                  <Chip
                    key={n}
                    label={`${n}%`}
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
                  Open now: {qty.format((trade.size * remaining) / 100)} (
                  {remaining.toFixed(1)}% of original)
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Exit price
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
                    <ToggleButton value="stop">Stop loss</ToggleButton>
                    <ToggleButton
                      value="target"
                      disabled={trade.target === undefined}
                    >
                      Take profit
                    </ToggleButton>
                    <ToggleButton value="manual">Manual</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
              <TextField
                label="Price"
                fullWidth
                {...field("price", "number", {
                  register: { setValueAs: toNum },
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
                label={`Exit fees (${currency})`}
                {...field("fees", "number", {
                  register: { setValueAs: toNum },
                })}
              />
              <TextField
                label="Closed at"
                {...field("closedAt", "datetime-local")}
              />
            </Box>

            <Controller
              name="mistake"
              control={control}
              render={({ field }) => (
                <TextField select label="Mistake (optional)" {...field}>
                  <MenuItem value="">None</MenuItem>
                  {MISTAKES.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <TextField
              label="Note (optional)"
              multiline
              minRows={2}
              {...field("note")}
            />

            <Box
              sx={{ p: 2, borderRadius: 1, border: 1, borderColor: "divider" }}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Closing
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {sliceOfOriginal > 0 ? qty.format(closingSize) : "—"}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Result
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
                  Left open after
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {remainingAfter < 1e-8
                    ? "Nothing (fully closed)"
                    : `${remainingAfter.toFixed(1)}% of original`}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Close position
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
