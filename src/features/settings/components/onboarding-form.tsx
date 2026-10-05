"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Autocomplete,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CURRENCIES, SettingsSchema, type Settings } from "../schema";
import { settingsRepo } from "../repo";

const toNum = (v: unknown) => (v === "" || v == null ? undefined : Number(v));

type Props = {
  initial?: Settings | null;
  submitLabel?: string;
  onSaved: () => void;
};

export default function OnboardingForm({
  initial,
  submitLabel = "Start journaling",
  onSaved,
}: Props) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Settings>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: initial ?? {
      currency: "USD",
      maxRiskPct: 1,
      strategies: [],
    },
  });

  const [balance, riskPct, currency] = watch([
    "startingBalance",
    "maxRiskPct",
    "currency",
  ]);

  const money = useMemo(() => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: 2,
      });
    } catch {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
      });
    }
  }, [currency]);

  const valid = (n: unknown): n is number =>
    typeof n === "number" && Number.isFinite(n) && n > 0;
  const perTrade =
    valid(balance) && valid(riskPct) ? (balance * riskPct) / 100 : null;

  const num = (name: "startingBalance" | "maxRiskPct") => {
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

  const onSubmit = async (values: Settings) => {
    await settingsRepo.save({
      ...values,
      strategies: [
        ...new Set(values.strategies.map((s) => s.trim()).filter(Boolean)),
      ],
    });
    onSaved();
  };

  return (
    <Stack
      component="form"
      spacing={3}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Starting balance"
          fullWidth
          autoFocus
          {...num("startingBalance")}
        />
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Currency"
              sx={{ minWidth: 140 }}
              {...field}
            >
              {CURRENCIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Stack>

      <div>
        <TextField
          label="Max risk per trade (%)"
          fullWidth
          {...num("maxRiskPct")}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, minHeight: 20 }}
        >
          {perTrade !== null
            ? `Risking ${money.format(perTrade)} per trade on a ${money.format(balance)} account.`
            : ""}
        </Typography>
      </div>

      {valid(riskPct) && riskPct > 5 && (
        <Alert severity="warning">
          Risking more than 5% per trade can wipe out an account in a short
          losing streak.
        </Alert>
      )}

      <Controller
        name="strategies"
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple
            freeSolo
            options={[] as string[]}
            value={field.value}
            onChange={(_, v) => field.onChange(v.map(String))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Strategies (optional)"
                helperText="Type a name and press Enter. You can add more later."
              />
            )}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
      >
        {submitLabel}
      </Button>
    </Stack>
  );
}
