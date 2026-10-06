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
import type { Trade } from "../types";
import { getCurrencyFormatter } from "@/features/shared/utils";
import { Currency } from "@/features/settings/schema";

type Props = {
  trades: Trade[];
  currency: string;
  equity: number;
  onDelete: (trade: Trade) => void;
  onClose?: (trade: Trade) => void; // wired up when the close flow exists
};

export default function TradeTable({
  trades,
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
      <Table size="small" sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell>Opened</TableCell>
            <TableCell>Pair</TableCell>
            <TableCell align="right">Entry</TableCell>
            <TableCell align="right">Stop</TableCell>
            <TableCell align="right">Target</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Risk</TableCell>
            <TableCell align="right">R:R</TableCell>
            <TableCell>Strategy</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {trades.map((t) => {
            const rr = rewardRisk(t.side, t.entry, t.stop, t.target);
            const riskOfAccount =
              equity > 0 ? (t.riskAmount / equity) * 100 : null;
            return (
              <TableRow key={t.id} hover>
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
                <TableCell align="right">{price.format(t.size)}</TableCell>
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
                <TableCell>{t.strategy ?? "—"}</TableCell>
                <TableCell>
                  <Chip size="small" label="Open" color="info" />
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  <Tooltip title={onClose ? "" : "Close flow coming next"}>
                    <span>
                      <Button
                        size="small"
                        disabled={!onClose}
                        onClick={() => onClose?.(t)}
                      >
                        Close
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete">
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
