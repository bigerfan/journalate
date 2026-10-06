"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { settingsRepo } from "@/features/settings/repo";
import type { Currency, Settings } from "@/features/settings/schema";
import { groupByTrade, remainingRisk, statusOf } from "@/features/trade/derive";
import { closeRepo, currentEquity, tradeRepo } from "@/features/trade/repo";
import type { Close, Trade } from "@/features/trade/types";
import TradeTable from "@/features/trade/components/trade-table";
import CloseTradeDialog from "@/features/trade/components/trade-close-modal";
import { TradeDeleteModal } from "@/features/trade/components/trade-delete-modal";
import { getCurrencyFormatter } from "@/features/shared/utils";

type State = {
  settings: Settings;
  equity: number;
  trades: Trade[];
  closesByTrade: Map<string, Close[]>;
};

export default function DashboardView() {
  const router = useRouter();
  const [state, setState] = useState<State | null>(null);
  const [closing, setClosing] = useState<Trade | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    trade: null | Trade;
  }>({ open: false, trade: null });

  const load = useCallback(async () => {
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
    setState({ settings, equity, trades, closesByTrade: groupByTrade(closes) });
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const handleDeleteConfirmation = (trade: Trade) => {
    setDeleteModal({ open: true, trade });
  };

  // Deleting a trade also deletes its closes, so equity can change: reload everything.
  const handleDelete = async (id: string) => {
    await tradeRepo.remove(id);
    setDeleteModal({ open: false, trade: null });
    await load();
  };

  const summary = useMemo(() => {
    if (!state) return "";
    const { trades, closesByTrade, equity, settings } = state;
    if (trades.length === 0) return "";
    const fmt = getCurrencyFormatter(settings.currency as Currency);
    const open = trades.filter(
      (t) => statusOf(closesByTrade.get(t.id) ?? []) !== "closed",
    );
    const risk = open.reduce(
      (sum, t) => sum + remainingRisk(t, closesByTrade.get(t.id) ?? []),
      0,
    );
    const pct =
      equity > 0 ? ` (${((risk / equity) * 100).toFixed(2)}% of account)` : "";
    return `Equity ${fmt.format(equity)} · ${open.length} open · ${fmt.format(risk)} at risk${pct}`;
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
            closesByTrade={state.closesByTrade}
            currency={state.settings.currency}
            equity={state.equity}
            onDelete={handleDeleteConfirmation}
            onClose={setClosing}
          />
        ) : (
          <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        )}
      </Container>

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

      <TradeDeleteModal
        open={deleteModal.open}
        trade={deleteModal.trade}
        handleClose={() => setDeleteModal({ open: false, trade: null })}
        handleDelete={handleDelete}
      />
    </>
  );
}
