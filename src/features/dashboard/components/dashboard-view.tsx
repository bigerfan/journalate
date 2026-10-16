"use client";

import { useMemo } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { Close, Trade } from "@/features/trade/types";
import { computeStats } from "@/features/trade/stats";
import StatCard from "@/components/dashboard/stat-card";
import EquityCurveChart from "./equity-curve-chart";
import PerformanceSummary from "./performance-summary";
import RecentClosesTable from "./recent-closes-table";
import { getCurrencyFormatter } from "@/lib/format";
import { Currency } from "@/features/settings/schema";

type Props = {
  startingBalance: number;
  trades: Trade[];
  closes: Close[];
  currency: string;
};

export default function DashboardView({
  startingBalance,
  trades,
  closes,
  currency,
}: Props) {
  const stats = useMemo(() => computeStats(trades, closes), [trades, closes]);

  const money = useMemo(
    () => getCurrencyFormatter(currency as Currency),
    [currency],
  );

  const winRate =
    stats.winRate === null ? "—" : `${(stats.winRate * 100).toFixed(1)}%`;

  const avgR =
    stats.avgR === null
      ? "—"
      : `${stats.avgR >= 0 ? "+" : ""}${stats.avgR.toFixed(2)}R`;

  const statCards = [
    {
      label: "Realized P&L",
      value: `${stats.totalPnl > 0 ? "+" : ""}${money.format(stats.totalPnl)}`,
      description: "Net of fees",
      valueColor:
        stats.totalPnl > 0
          ? "success.main"
          : stats.totalPnl < 0
            ? "error.main"
            : undefined,
    },
    {
      label: "Win rate",
      value: winRate,
      description: `${stats.wins} wins · ${stats.closedTrades} closed trades`,
    },
    {
      label: "Average R",
      value: avgR,
      description: "Closed trades with a valid R multiple",
      valueColor:
        stats.avgR !== null && stats.avgR !== 0
          ? stats.avgR > 0
            ? "success.main"
            : "error.main"
          : undefined,
    },
    {
      label: "Total fees",
      value: money.format(stats.totalFees),
      description: "Fees incurred on closes",
    },
  ];

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          spacing: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Dashboard
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            Your trading performance at a glance.
          </Typography>
        </Box>

        <Button variant="contained" href="/trades/new">
          New Trade
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {statCards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, xl: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <EquityCurveChart
        startingBalance={startingBalance}
        trades={trades}
        closes={closes}
        currency={currency}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <PerformanceSummary stats={stats} />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <RecentClosesTable
            trades={trades}
            closes={closes}
            currency={currency}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
