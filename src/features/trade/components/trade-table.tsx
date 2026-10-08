"use client";

import { useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Link from "next/link";
import { rewardRisk } from "../calc";
import {
  closedPct,
  realizedPnl,
  remainingSize,
  rMultiple,
  statusOf,
  type TradeStatus,
} from "../derive";
import type { Close, Trade } from "../types";
import { getCurrencyFormatter } from "@/lib/format";
import { Currency } from "@/features/settings/schema";
import { LinkOffOutlined, LinkOutlined } from "@mui/icons-material";

type Props = {
  trades: Trade[];
  closesByTrade: Map<string, Close[]>;
  currency: string;
  equity: number;
  onDelete: (trade: Trade) => void;
  onClose: (trade: Trade) => void;
};

const STATUS: Record<
  TradeStatus,
  { label: string; color: "info" | "warning" | "default" }
> = {
  open: { label: "Open", color: "info" },
  partial: { label: "Partial", color: "warning" },
  closed: { label: "Closed", color: "default" },
};

export default function TradeTable({
  trades,
  closesByTrade,
  currency,
  equity,
  onDelete,
  onClose,
}: Props) {
  const money = useMemo(
    () => getCurrencyFormatter(currency as Currency),
    [currency],
  );
  const price = useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 8 }),
    [],
  );
  const date = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  if (trades.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          No trades yet
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Log your first trade and it will show up here.
        </Typography>
        <Button component={Link} href="/trades/new" variant="contained">
          New trade
        </Button>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" sx={{ minWidth: 1100 }}>
        <TableHead>
          <TableRow>
            <TableCell>Opened</TableCell>
            <TableCell>Pair</TableCell>
            <TableCell align="right">Entry</TableCell>
            <TableCell align="right">Stop</TableCell>
            <TableCell align="right">Target</TableCell>
            <TableCell align="right">Size left</TableCell>
            <TableCell align="right">Risk</TableCell>
            <TableCell align="right">R:R</TableCell>
            <TableCell align="right">Realized P&amp;L</TableCell>
            <TableCell>Strategy</TableCell>
            <TableCell>Screenshot</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {trades.map((t) => {
            const closes = closesByTrade.get(t.id) ?? [];
            const status = statusOf(closes);
            const rr = rewardRisk(t.side, t.entry, t.stop, t.target);
            const riskOfAccount =
              equity > 0 ? (t.riskAmount / equity) * 100 : null;
            const pnl = closes.length > 0 ? realizedPnl(t, closes) : null;
            const r = rMultiple(t, closes);
            return (
              <TableRow
                key={t.id}
                hover
                sx={{ opacity: status === "closed" ? 0.75 : 1 }}
              >
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {date.format(new Date(t.openedAt))}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{t.pair}</Typography>
                    <Chip
                      size="small"
                      label={t.side === "long" ? "Long" : "Short"}
                      color={t.side === "long" ? "success" : "error"}
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">{price.format(t.entry)}</TableCell>
                <TableCell align="right">{price.format(t.stop)}</TableCell>
                <TableCell align="right">
                  {t.target !== undefined ? price.format(t.target) : "—"}
                </TableCell>
                <TableCell align="right">
                  {status === "closed"
                    ? "—"
                    : price.format(remainingSize(t, closes))}
                  {status === "partial" && (
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {" "}
                      of {price.format(t.size)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {money.format(t.riskAmount)}
                  {riskOfAccount !== null && (
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {" "}
                      ({riskOfAccount.toFixed(2)}%)
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {rr !== null ? `${rr.toFixed(2)}R` : "—"}
                </TableCell>
                <TableCell align="right">
                  {pnl === null ? (
                    "—"
                  ) : (
                    <Typography
                      component="span"
                      variant="body2"
                      color={pnl >= 0 ? "success.main" : "error.main"}
                      sx={{ fontWeight: 600 }}
                    >
                      {money.format(pnl)}
                      {r !== null && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {" "}
                          ({r.toFixed(2)}R)
                        </Typography>
                      )}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{t.strategy ?? "—"}</TableCell>
                <TableCell>
                  {t.imageUrl ? (
                    <Button component={Link} href={t.imageUrl} target="blank">
                      <LinkOutlined />
                    </Button>
                  ) : (
                    <Button disabled>
                      <LinkOffOutlined />
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={STATUS[status].color}
                    label={
                      status === "partial"
                        ? `Partial · ${closedPct(closes).toFixed(0)}% closed`
                        : STATUS[status].label
                    }
                  />
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  <Button
                    size="small"
                    disabled={status === "closed"}
                    onClick={() => onClose(t)}
                  >
                    Close
                  </Button>
                  <Tooltip title="Delete trade">
                    <IconButton
                      size="small"
                      aria-label={`Delete ${t.pair} trade`}
                      onClick={() => onDelete(t)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
