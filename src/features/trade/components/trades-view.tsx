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
import {
  currentEquity,
  groupByTrade,
  remainingRisk,
  statusOf,
} from "@/features/trade/derive";
import { closeRepo, tradeRepo } from "@/features/trade/repo";
import type { Close, Trade } from "@/features/trade/types";
import TradeTable from "@/features/trade/components/trade-table";
import CloseTradeDialog from "@/features/trade/components/trade-close-modal";
import { TradeDeleteModal } from "@/features/trade/components/trade-delete-modal";
import { getCurrencyFormatter } from "@/lib/format";
import { authClient } from "@/lib/auth-client";
import { showError } from "@/components/toast/show-error";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SummaryCard from "@/components/card/summary-card";

type State = {
  settings: Settings;
  equity: number;
  closesByTrade: Map<string, Close[]>;
};

export type TradesPageData = {
  settings: Settings;
  equity: number;
  trades: Trade[];
  closes: Close[];
};

export default function TradesView({
  initialData,
}: {
  initialData: TradesPageData;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: trades } = useQuery({
    queryKey: ["trades"],
    queryFn: tradeRepo.list,
    initialData: initialData.trades,
  });

  const { data: closes } = useQuery({
    queryKey: ["closes"],
    queryFn: closeRepo.list,
    initialData: initialData.closes,
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsRepo.get,
    initialData: initialData.settings,
  });

  const closesByTrade = useMemo(() => groupByTrade(closes), [closes]);

  const equity = useMemo(
    () =>
      settings ? currentEquity(settings.startingBalance, trades, closes) : 0,
    [settings, trades, closes],
  );

  const [closing, setClosing] = useState<Trade | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    trade: Trade | null;
  }>({ open: false, trade: null });

  useEffect(() => {
    if (!settings) router.replace("/onboarding");
  }, [settings]);

  const handleDeleteConfirmation = (trade: Trade) => {
    setDeleteModal({ open: true, trade });
  };

  const handleDelete = async (id: string) => {
    try {
      await tradeRepo.remove(id);

      setDeleteModal({ open: false, trade: null });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trades"] }),
        queryClient.invalidateQueries({ queryKey: ["closes"] }),
      ]);
    } catch (error) {
      showError(error, "حذف معامله انجام نشد.");
    }
  };

  const summary = useMemo(() => {
    if (!settings) return null;

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
  }, [settings, trades, closesByTrade, equity]);

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
            gap: 2,
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
              معاملات
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              معاملاتت رو مدیریت کن و حواست به ریسک هر معامله باشه.
            </Typography>
          </Box>

          <Stack direction="row" sx={{ spacing: 1.5, alignItems: "center" }}>
            <Button
              component={Link}
              href="/trades/new"
              variant="contained"
              size="large"
            >
              + ثبت معامله جدید
            </Button>

            {/* Testing only — intentionally retained */}
            {/* <Button
              size="large"
              onClick={async () => {
                await authClient.signOut();
              }}
            >
              signout
            </Button> */}
          </Stack>
        </Stack>

        {/* Account summary */}
        {summary && (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <SummaryCard
                label="موجودی حساب"
                value={summary.equity}
                description="ارزش فعلی حساب"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <SummaryCard
                label="معاملات باز"
                value={String(summary.openCount)}
                description="معاملات فعال"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <SummaryCard
                label="ریسک باقی‌مانده"
                value={summary.risk}
                description="مجموع ریسک معاملات باز"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <SummaryCard
                label="درصد موجودی در معرض ریسک"
                value={summary.riskPercentage}
                description="نسبت به موجودی فعلی حساب"
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
                همه معاملاتت رو بررسی و مدیریت کن.
              </Typography>
            </Box>

            {
              <Chip
                label={`${trades.length} معامله`}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 1.5 }}
              />
            }
          </Stack>

          <Box
            sx={{
              borderTop: 1,
              borderColor: "divider",
              p: { xs: 1, sm: 2, md: 3 },
              overflowX: "auto",
            }}
          >
            {trades && closes && settings ? (
              <TradeTable
                trades={trades}
                closesByTrade={closesByTrade}
                currency={settings.currency}
                equity={equity}
                onDelete={handleDeleteConfirmation}
                onClose={setClosing}
                onEdit={(trade) => router.push(`/trades/${trade.id}/edit`)}
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
                  در حال بارگذاری معاملات...
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Close trade dialog */}
        {closing && (
          <CloseTradeDialog
            key={closing.id}
            trade={closing}
            closes={closesByTrade.get(closing.id) ?? []}
            currency={settings.currency}
            onCancel={() => setClosing(null)}
            onSaved={() => {
              setClosing(null);
              queryClient.invalidateQueries({ queryKey: ["trades"] });
              queryClient.invalidateQueries({ queryKey: ["closes"] });
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
