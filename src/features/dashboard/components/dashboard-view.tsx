"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { currentEquity, settingsRepo } from "@/features/settings/repo";
import type { Settings } from "@/features/settings/schema";
import { tradeRepo } from "@/features/trade/repo";
import type { Trade } from "@/features/trade/types";
import TradeTable from "@/features/trade/components/trade-table";
import { TradeDeleteModal } from "@/features/trade/components/trade-delete-modal";

type State = { settings: Settings; equity: number; trades: Trade[] };

export default function DashboardView() {
  const router = useRouter();
  const [state, setState] = useState<State | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    trade: null | Trade;
  }>({ open: false, trade: null });

  useEffect(() => {
    (async () => {
      const settings = await settingsRepo.get();
      if (!settings) {
        router.replace("/onboarding");
        return;
      }
      const [equity, trades] = await Promise.all([
        currentEquity(settings),
        tradeRepo.list(),
      ]);
      setState({ settings, equity, trades });
    })();
  }, [router]);

  const handleDeleteConfirmation = (trade: Trade) => {
    setDeleteModal({ open: true, trade });
  };
  const handleDelete = async (id: string) => {
    await tradeRepo.remove(id);
    setState((s) =>
      s ? { ...s, trades: s.trades.filter((t) => t.id !== id) } : s,
    );
  };

  const summary = useMemo(() => {
    if (!state) return "";
    const { trades, equity, settings } = state;
    if (trades.length === 0) return "";
    const risk = trades.reduce((sum, t) => sum + t.riskAmount, 0);
    const fmt = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: settings.currency !== "USDT" ? settings.currency : "USD",
    });
    const pct =
      equity > 0 ? ` (${((risk / equity) * 100).toFixed(2)}% of account)` : "";
    return `${trades.length} open ${trades.length === 1 ? "trade" : "trades"} · ${fmt.format(risk)} at risk${pct}`;
  }, [state]);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack
          direction="row"
          sx={{
            mb: 4,
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>
            <Typography color="text.secondary" sx={{ minHeight: 24 }}>
              {summary}
            </Typography>
          </Box>
          <Button component={Link} href="/trades/new" variant="contained">
            New trade
          </Button>
        </Stack>

        {state ? (
          <TradeTable
            trades={state.trades}
            currency={state.settings.currency}
            equity={state.equity}
            onDelete={handleDeleteConfirmation}
            // onClose={handleClose}
          />
        ) : (
          <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
      <TradeDeleteModal
        open={deleteModal.open}
        trade={deleteModal.trade}
        handleClose={() => setDeleteModal({ open: false, trade: null })}
        handleDelete={handleDelete}
      />
    </>
  );
}
