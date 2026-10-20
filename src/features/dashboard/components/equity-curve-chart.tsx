"use client";

import { useMemo } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { equityCurve } from "@/features/trade/stats";
import { Close, Trade } from "@/features/trade/types";
import { getCurrencyFormatter } from "@/lib/format";
import { Currency } from "@/features/settings/schema";

type Props = {
  startingBalance: number;
  trades: Trade[];
  closes: Close[];
  currency: string;
};

export default function EquityCurveChart({
  startingBalance,
  trades,
  closes,
  currency,
}: Props) {
  const formatter = useMemo(
    () => getCurrencyFormatter(currency as Currency),
    [currency],
  );

  const points = useMemo(() => {
    const curve = equityCurve(startingBalance, trades, closes);

    return [{ time: "", equity: startingBalance }, ...curve];
  }, [startingBalance, trades, closes]);

  const width = 720;
  const height = 240;
  const paddingX = 12;
  const paddingY = 20;

  const values = points.map((point) => point.equity);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  const coordinates = points.map((point, index) => ({
    x:
      points.length === 1
        ? width / 2
        : paddingX + (index / (points.length - 1)) * (width - paddingX * 2),
    y:
      height -
      paddingY -
      ((point.equity - minValue) / range) * (height - paddingY * 2),
  }));

  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${coordinates.at(-1)?.x ?? width} ${
    height
  } L ${coordinates[0]?.x ?? 0} ${height} Z`;

  const currentEquity = points.at(-1)?.equity ?? startingBalance;
  const profit = currentEquity - startingBalance;

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          spacing: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            نمودار رشد سرمایه
          </Typography>
          <Typography variant="body2" color="text.secondary">
            موجودی اولیه به‌علاوه سود و زیان معاملات بسته‌شده
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {formatter.format(currentEquity)}
          </Typography>
          <Typography
            variant="body2"
            color={profit >= 0 ? "success.main" : "error.main"}
          >
            {profit > 0 ? "+" : ""}
            {formatter.format(profit)} سود و زیان تحقق‌یافته
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          role="img"
          aria-label="نمودار تغییرات سرمایه بر اساس سود و زیان تحقق‌یافته"
          preserveAspectRatio="none"
        >
          {[0, 1, 2, 3].map((step) => {
            const y = paddingY + (step / 3) * (height - paddingY * 2);

            return (
              <line
                key={step}
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.12}
                strokeDasharray="4 4"
              />
            );
          })}

          {points.length > 1 && (
            <>
              <path d={areaPath} fill="currentColor" opacity={0.06} />
              <path
                d={linePath}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {points.length === 1 && (
            <circle
              cx={coordinates[0].x}
              cy={coordinates[0].y}
              r={4}
              fill="currentColor"
            />
          )}
        </svg>
      </Box>

      <Stack direction="row" sx={{ mt: 1, justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary">
          موجودی اولیه
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {closes.length
            ? new Date(
                closes.reduce((latest, close) =>
                  Date.parse(close.closedAt) > Date.parse(latest.closedAt)
                    ? close
                    : latest,
                ).closedAt,
              ).toLocaleDateString()
            : "هنوز معامله‌ای بسته نشده"}
        </Typography>
      </Stack>
    </Paper>
  );
}
