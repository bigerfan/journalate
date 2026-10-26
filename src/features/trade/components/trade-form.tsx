"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, RegisterOptions, useForm } from "react-hook-form";
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
import type { Currency, Settings } from "@/features/settings/schema";
import { riskAmount, rewardRisk, suggestedSize } from "../calc";
import { tradeRepo } from "../repo";
import type { Trade } from "../types";
import { getCurrencyFormatter, localNow, toLocalInput } from "@/lib/format";
import { makeFieldProps } from "@/lib/form";

const isNum = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n);

type Props = {
  settings: Settings;
  equity?: number; // create mode only
  trade?: Trade; // present = edit mode
  hasCloses?: boolean; // edit mode: locks `side`
};

export default function TradeForm({
  settings,
  equity = 0,
  trade,
  hasCloses = false,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = Boolean(trade);

  // Edit mode has no max-risk cap (agreed rule: it would compare an old trade to today's rules).
  const schema = useMemo(
    () =>
      makeTradeFormSchema(
        isEdit ? Number.POSITIVE_INFINITY : settings.maxRiskPct,
      ),
    [isEdit, settings.maxRiskPct],
  );
  const money = useMemo(
    () =>
      getCurrencyFormatter(settings.currency as Currency, {
        maximumFractionDigits: 2,
      }),
    [settings.currency],
  );

  const {
    register,
    control,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TradeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: trade
      ? {
          pair: trade.pair,
          side: trade.side,
          entry: trade.entry,
          stop: trade.stop,
          target: trade.target,
          size: trade.size,
          riskPct: trade.riskPct,
          fees: trade.fees,
          strategy: trade.strategy ?? "",
          timeframe: trade.timeframe ?? "",
          notes: trade.notes ?? "",
          imageUrl: trade.imageUrl ?? "",
          openedAt: toLocalInput(trade.openedAt),
        }
      : {
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
  const field = makeFieldProps(register, errors);

  const onSubmit = async (v: TradeFormValues) => {
    // Edit is a full replacement (PUT): a field left empty here is cleared on the server.
    const payload = {
      pair: v.pair.trim().toUpperCase(),
      side: v.side,
      entry: v.entry,
      stop: v.stop,
      target: v.target,
      size: v.size,
      riskPct: v.riskPct,
      imageUrl: v.imageUrl?.trim() || undefined,
      riskAmount: riskAmount(v.size, v.entry, v.stop),
      fees: v.fees ?? 0,
      strategy: v.strategy?.trim() || undefined,
      timeframe: v.timeframe?.trim() || undefined,
      notes: v.notes?.trim() || undefined,
      openedAt: new Date(v.openedAt).toISOString(),
    };

    try {
      if (trade) {
        await tradeRepo.update(trade.id, payload);
        await queryClient.invalidateQueries({ queryKey: ["trades"] });
        router.push(`/trades/${trade.id}`);
        router.refresh(); // the detail page is server-rendered
      } else {
        await tradeRepo.create(payload);
        router.push("/trades");
      }
    } catch (e) {
      // Form-related server errors are shown inline (project convention), not as a toast.
      setError("root.server", {
        message:
          e instanceof Error ? e.message : "خطایی رخ داد. دوباره تلاش کن.",
      });
    }
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
        {errors.root?.server && (
          <Alert severity="error">{errors.root.server.message}</Alert>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="جفت‌ارز"
            placeholder="BTCUSDT"
            autoFocus={!isEdit}
            fullWidth
            {...field("pair")}
          />
          <Controller
            name="side"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                exclusive
                disabled={hasCloses}
                value={field.value}
                onChange={(_, v) => v && field.onChange(v)}
                aria-label="جهت معامله"
                sx={{ height: 56, flexShrink: 0 }}
              >
                <ToggleButton value="long" color="success" sx={{ px: 3 }}>
                  لانگ
                </ToggleButton>
                <ToggleButton value="short" color="error" sx={{ px: 3 }}>
                  شورت
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Stack>
        {hasCloses && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: "-16px !important" }}
          >
            چون برای این معامله کلوز ثبت شده، جهت معامله قابل تغییر نیست.
          </Typography>
        )}

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          }}
        >
          <TextField label="قیمت ورود" {...field("entry", "number")} />
          <TextField label="حد ضرر" {...field("stop", "number")} />
          <TextField label="حد سود (اختیاری)" {...field("target", "number")} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          <TextField
            label="ریسک هر معامله (٪)"
            {...field("riskPct", "number")}
          />
          <Box>
            <TextField
              label="حجم معامله"
              fullWidth
              {...field("size", "number")}
            />
            {/* Needs today's equity, which says nothing about an old trade: create mode only. */}
            {!isEdit && (
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
                  ? `استفاده از حجم پیشنهادی: ${Number(suggested.toPrecision(6))}`
                  : "برای محاسبه حجم پیشنهادی، قیمت ورود و حد ضرر رو وارد کن"}
              </Button>
            )}
          </Box>
        </Box>

        {!isEdit && overRisk && (
          <Alert severity="warning">
            با این حجم، {plannedRiskPct.toFixed(2)}٪ از موجودیت در معرض ریسکه؛
            این مقدار از ریسک برنامه‌ریزی‌شده یعنی {riskPct}٪ بیشتره.
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
                  <TextField {...params} label="استراتژی" />
                )}
              />
            )}
          />
          <TextField
            label="لینک تصویر (اختیاری)"
            placeholder="https://..."
            {...field("imageUrl")}
          />
          <TextField
            label="تایم‌فریم"
            placeholder="4h"
            {...field("timeframe")}
          />
          <TextField
            label="تاریخ ورود"
            {...field("openedAt", "datetime-local")}
          />
        </Box>

        <TextField
          label={`کارمزد ورود (${settings.currency})`}
          sx={{ maxWidth: 240 }}
          {...field("fees", "number")}
        />

        <TextField
          label="چرا این معامله رو باز می‌کنی؟"
          multiline
          minRows={3}
          {...field("notes")}
        />
      </Stack>

      {/* ---------- Live summary ---------- */}
      <Paper
        variant="outlined"
        sx={{ p: 3, position: { md: "sticky" }, top: 24 }}
      >
        <Typography variant="subtitle1" gutterBottom>
          خلاصه معامله
        </Typography>
        <Stack spacing={1.5} sx={{ my: 2 }}>
          {!isEdit && <Row label="موجودی حساب" value={money.format(equity)} />}
          <Row
            label="مقدار در معرض ریسک"
            value={plannedRisk > 0 ? money.format(plannedRisk) : "—"}
          />
          {!isEdit && (
            <Row
              label="درصد ریسک از موجودی"
              value={plannedRisk > 0 ? `${plannedRiskPct.toFixed(2)}٪` : "—"}
              warn={overRisk}
            />
          )}
          <Row
            label="ارزش معامله"
            value={
              isNum(size) && isNum(entry) ? money.format(size * entry) : "—"
            }
          />
          <Row
            label="نسبت سود به ریسک"
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
          {isSubmitting
            ? isEdit
              ? "در حال ذخیره..."
              : "در حال ثبت..."
            : isEdit
              ? "ذخیره تغییرات"
              : "ثبت معامله"}
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
      sx={{ alignItems: "baseline", justifyContent: "space-between" }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: 600 }}
        color={warn ? "warning.main" : "text.primary"}
      >
        {value}
      </Typography>
    </Stack>
  );
}
