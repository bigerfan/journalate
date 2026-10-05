"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { makeTradeFormSchema, type TradeFormValues } from "../schema";
import type { Settings } from "@/features/settings/types";
import { riskAmount, rewardRisk, suggestedSize } from "../calc";
import { tradeRepo } from "@/features/trade/repo";

type NumericField = "entry" | "stop" | "target" | "size" | "riskPct" | "fees";

// Empty input -> undefined so optional fields stay optional and required ones show their message.
const toNum = (v: unknown) => (v === "" || v == null ? undefined : Number(v));

const localNow = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16); // value format for <input type="datetime-local">
};

const isNum = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n);

export default function TradeForm({
  settings,
  equity,
}: {
  settings: Settings;
  equity: number;
}) {
  const router = useRouter();
  const schema = useMemo(
    () => makeTradeFormSchema(settings.maxRiskPct),
    [settings.maxRiskPct],
  );
  const money = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: settings.currency !== "USDT" ? settings.currency : "USD",
        maximumFractionDigits: 2,
      }),
    [settings.currency],
  );

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TradeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      side: "long",
      riskPct: settings.maxRiskPct,
      openedAt: localNow(),
      fees: 0,
    },
  });

  const [side, entry, stop, target, size, riskPct] = watch([
    "side",
    "entry",
    "stop",
    "target",
    "size",
    "riskPct",
  ]);

  const suggested = suggestedSize(equity, riskPct, entry, stop);
  const plannedRisk = riskAmount(size, entry, stop);
  const plannedRiskPct = equity > 0 ? (plannedRisk / equity) * 100 : 0;
  const rr = rewardRisk(side, entry, stop, target);
  const overRisk = isNum(riskPct) && plannedRiskPct > riskPct + 1e-9;

  // Spread helper: MUI TextField needs the RHF ref on the input element, not the root.
  const num = (name: NumericField) => {
    const { ref, ...rest } = register(name, { setValueAs: toNum });
    return {
      ...rest,
      inputRef: ref,
      type: "number",
      slotProps: { htmlInput: { step: "any" } },
      error: !!errors[name],
      helperText: errors[name]?.message,
    };
  };

  const onSubmit = async (v: TradeFormValues) => {
    await tradeRepo.create({
      pair: v.pair.trim().toUpperCase(),
      side: v.side,
      entry: v.entry,
      stop: v.stop,
      target: v.target,
      size: v.size,
      riskPct: v.riskPct,
      riskAmount: riskAmount(v.size, v.entry, v.stop),
      fees: v.fees ?? 0,
      strategy: v.strategy?.trim() || undefined,
      timeframe: v.timeframe?.trim() || undefined,
      notes: v.notes?.trim() || undefined,
      openedAt: new Date(v.openedAt).toISOString(),
    });
    router.push("/");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: { xs: "1fr", md: "1fr 320px" },
        alignItems: "start",
      }}
    >
      {/* ---------- Inputs ---------- */}
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Pair"
            placeholder="BTCUSDT"
            autoFocus
            fullWidth
            error={!!errors.pair}
            helperText={errors.pair?.message}
            {...(() => {
              const { ref, ...rest } = register("pair");
              return { ...rest, inputRef: ref };
            })()}
          />
          <Controller
            name="side"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                exclusive
                value={field.value}
                onChange={(_, v) => v && field.onChange(v)}
                aria-label="Trade side"
                sx={{ height: 56, flexShrink: 0 }}
              >
                <ToggleButton value="long" color="success" sx={{ px: 3 }}>
                  Long
                </ToggleButton>
                <ToggleButton value="short" color="error" sx={{ px: 3 }}>
                  Short
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          }}
        >
          <TextField label="Entry price" {...num("entry")} />
          <TextField label="Stop loss" {...num("stop")} />
          <TextField label="Take profit (optional)" {...num("target")} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          <TextField label="Risk per trade (%)" {...num("riskPct")} />
          <Box>
            <TextField label="Position size" fullWidth {...num("size")} />
            <Button
              size="small"
              disabled={suggested <= 0}
              onClick={() =>
                setValue("size", Number(suggested.toPrecision(6)), {
                  shouldValidate: true,
                })
              }
              sx={{ mt: 0.5 }}
            >
              {suggested > 0
                ? `Use suggested: ${Number(suggested.toPrecision(6))}`
                : "Enter entry and stop for a suggested size"}
            </Button>
          </Box>
        </Box>

        {overRisk && (
          <Alert severity="warning">
            This size risks {plannedRiskPct.toFixed(2)}% of your account, above
            the {riskPct}% you planned.
          </Alert>
        )}

        <Divider />

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          }}
        >
          <Controller
            name="strategy"
            control={control}
            render={({ field }) => (
              <Autocomplete
                freeSolo
                options={settings.strategies}
                inputValue={field.value ?? ""}
                onInputChange={(_, v) => field.onChange(v)}
                renderInput={(params) => (
                  <TextField {...params} label="Strategy" />
                )}
              />
            )}
          />
          <TextField
            label="Timeframe"
            placeholder="4h"
            {...(() => {
              const { ref, ...rest } = register("timeframe");
              return { ...rest, inputRef: ref };
            })()}
          />
          <TextField
            label="Opened"
            type="datetime-local"
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.openedAt}
            helperText={errors.openedAt?.message}
            {...(() => {
              const { ref, ...rest } = register("openedAt");
              return { ...rest, inputRef: ref };
            })()}
          />
        </Box>

        <TextField
          label={`Entry fees (${settings.currency})`}
          sx={{ maxWidth: 240 }}
          {...num("fees")}
        />

        <TextField
          label="Why are you taking this trade?"
          multiline
          minRows={3}
          {...(() => {
            const { ref, ...rest } = register("notes");
            return { ...rest, inputRef: ref };
          })()}
        />
      </Stack>

      {/* ---------- Live summary ---------- */}
      <Paper
        variant="outlined"
        sx={{ p: 3, position: { md: "sticky" }, top: 24 }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Trade summary
        </Typography>
        <Stack spacing={1.5} sx={{ my: 2 }}>
          <Row label="Account" value={money.format(equity)} />
          <Row
            label="Amount at risk"
            value={plannedRisk > 0 ? money.format(plannedRisk) : "—"}
          />
          <Row
            label="Risk of account"
            value={plannedRisk > 0 ? `${plannedRiskPct.toFixed(2)}%` : "—"}
            warn={overRisk}
          />
          <Row
            label="Position value"
            value={
              isNum(size) && isNum(entry) ? money.format(size * entry) : "—"
            }
          />
          <Row
            label="Reward : risk"
            value={rr !== null ? `${rr.toFixed(2)} R` : "—"}
          />
        </Stack>
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting}
        >
          Open trade
        </Button>
      </Paper>
    </Box>
  );
}

function Row({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", alignItems: "baseline" }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body1"
        color={warn ? "warning.main" : "text.primary"}
        sx={{ fontWeight: 600 }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
