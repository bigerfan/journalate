"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
  Chip,
  Grid,
} from "@mui/material";

import { settingsRepo } from "@/features/settings/repo";
import type { Currency, Settings } from "@/features/settings/schema";
import { groupByTrade, remainingRisk, statusOf } from "@/features/trade/derive";
import { closeRepo, currentEquity, tradeRepo } from "@/features/trade/repo";
import type { Close, Trade } from "@/features/trade/types";
import TradeTable from "@/features/trade/components/trade-table";
import CloseTradeDialog from "@/features/trade/components/trade-close-modal";
import { TradeDeleteModal } from "@/features/trade/components/trade-delete-modal";
import { getCurrencyFormatter } from "@/lib/format";
import { authClient } from "@/lib/auth-client";
import { showError } from "@/components/toast/show-error";

type State = {
  settings: Settings;
  equity: number;
  trades: Trade[];
  closesByTrade: Map<string, Close[]>;
};

export default function TradesView() {
  const router = useRouter();

  const [state, setState] = useState<State | null>(null);
  const [closing, setClosing] = useState<Trade | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    trade: Trade | null;
  }>({ open: false, trade: null });

  const load = useCallback(async () => {
    try {
      const settings = await settingsRepo.get();

      if (!settings) {
        router.replace("/onboarding");
        return;
      }

      const [equity, trades, closes] = await Promise.all([
        currentEquity(settings),
        tradeRepo.list(),
        closeRepo.list(),
      ]);

      setState({
        settings,
        equity,
        trades,
        closesByTrade: groupByTrade(closes),
      });
    } catch (error) {
      showError(error, "Settings not found");
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const handleDeleteConfirmation = (trade: Trade) => {
    setDeleteModal({ open: true, trade });
  };

  const handleDelete = async (id: string) => {
    try {
      await tradeRepo.remove(id);
      setDeleteModal({ open: false, trade: null });
      await load();
    } catch (error) {
      showError(error, "Could not delete trade");
    }
  };

  const summary = useMemo(() => {
    if (!state) return null;

    const { trades, closesByTrade, equity, settings } = state;
    const fmt = getCurrencyFormatter(settings.currency as Currency);

    const openTrades = trades.filter(
      (trade) => statusOf(closesByTrade.get(trade.id) ?? []) !== "closed",
    );

    const risk = openTrades.reduce(
      (sum, trade) =>
        sum + remainingRisk(trade, closesByTrade.get(trade.id) ?? []),
      0,
    );

    const riskPercentage = equity > 0 ? (risk / equity) * 100 : 0;

    return {
      equity: fmt.format(equity),
      openCount: openTrades.length,
      risk: fmt.format(risk),
      riskPercentage: `${riskPercentage.toFixed(2)}%`,
      currency: settings.currency,
    };
  }, [state]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        {/* Page header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            mb: 4,
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            spacing: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 750,
                letterSpacing: "-0.04em",
              }}
            >
              Trades
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              Manage your positions and keep track of your trading risk.
            </Typography>
          </Box>

          <Stack direction="row" sx={{ spacing: 1.5, alignItems: "center" }}>
            <Button
              component={Link}
              href="/trades/new"
              variant="contained"
              size="large"
            >
              + New trade
            </Button>

            {/* Testing only — intentionally retained */}
            <Button
              size="large"
              onClick={async () => {
                await authClient.signOut();
              }}
            >
              signout
            </Button>
          </Stack>
        </Stack>

        {/* Account summary */}
        {state && summary && (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <SummaryCard
                label="Account equity"
                value={summary.equity}
                description="Current account value"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <SummaryCard
                label="Open trades"
                value={String(summary.openCount)}
                description="Active positions"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <SummaryCard
                label="Remaining risk"
                value={summary.risk}
                description="Risk across open trades"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <SummaryCard
                label="Account at risk"
                value={summary.riskPercentage}
                description="Relative to account equity"
              />
            </Grid>
          </Grid>
        )}

        {/* Trades table */}
        <Paper
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              p: { xs: 2, md: 3 },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              spacing: 1,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Journalate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review and manage all your trades.
              </Typography>
            </Box>

            {state && (
              <Chip
                label={`${state.trades.length} total ${
                  state.trades.length === 1 ? "trade" : "trades"
                }`}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 1.5 }}
              />
            )}
          </Stack>

          <Box
            sx={{
              borderTop: 1,
              borderColor: "divider",
              p: { xs: 1, sm: 2, md: 3 },
              overflowX: "auto",
            }}
          >
            {state ? (
              <TradeTable
                trades={state.trades}
                closesByTrade={state.closesByTrade}
                currency={state.settings.currency}
                equity={state.equity}
                onDelete={handleDeleteConfirmation}
                onClose={setClosing}
              />
            ) : (
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  py: 10,
                  gap: 2,
                }}
              >
                <CircularProgress size={28} />
                <Typography variant="body2" color="text.secondary">
                  Loading your trades...
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Close trade dialog */}
        {state && closing && (
          <CloseTradeDialog
            key={closing.id}
            trade={closing}
            closes={state.closesByTrade.get(closing.id) ?? []}
            currency={state.settings.currency}
            onCancel={() => setClosing(null)}
            onSaved={async () => {
              setClosing(null);
              await load();
            }}
          />
        )}

        {/* Delete trade dialog */}
        <TradeDeleteModal
          open={deleteModal.open}
          trade={deleteModal.trade}
          handleClose={() => setDeleteModal({ open: false, trade: null })}
          handleDelete={handleDelete}
        />
      </Container>
    </Box>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  description: string;
};

function SummaryCard({ label, value, description }: SummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        transition: "border-color 160ms ease",
        "&:hover": {
          borderColor: "text.secondary",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontWeight: 500 }}
      >
        {label}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          mt: 1.5,
          overflowWrap: "anywhere",

          fontWeight: 750,
          letterSpacing: "-0.035em",
        }}
      >
        {value}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}
      >
        {description}
      </Typography>
    </Paper>
  );
}
