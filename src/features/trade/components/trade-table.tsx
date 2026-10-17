"use client";

import { useMemo } from "react";
import NextLink from "next/link";
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
  Link,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { LinkOffOutlined, LinkOutlined } from "@mui/icons-material";

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
import type { Currency } from "@/features/settings/schema";

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
  {
    label: string;
    color: "info" | "warning" | "default";
  }
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
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 8,
      }),
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
      <Paper
        variant="outlined"
        sx={{
          py: 9,
          px: 3,
          textAlign: "center",
          borderRadius: 3,
          borderStyle: "dashed",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            bgcolor: "action.hover",
            display: "grid",
            placeItems: "center",
            mx: "auto",
            mb: 2.5,
          }}
        >
          <Typography variant="h5">↗</Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
          No trades yet
        </Typography>

        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ maxWidth: 340, mx: "auto", mb: 3 }}
        >
          Your trading journal starts here. Record your first position to track
          entries, risk, and performance.
        </Typography>

        <Button
          component={NextLink}
          href="/trades/new"
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 650,
            borderRadius: 2,
            px: 3,
            boxShadow: "none",
          }}
        >
          + New trade
        </Button>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflowX: "auto",
        bgcolor: "background.paper",
      }}
    >
      <Table
        size="small"
        sx={{
          minWidth: 1250,
          "& .MuiTableCell-root": {
            borderRight: "none",
          },
          "& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root":
            {
              borderBottom: 0,
            },
        }}
      >
        <TableHead sx={{ bgcolor: "action.hover", color: "text.secondary" }}>
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
            <TableCell align="center">Screenshot</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
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
                sx={{
                  opacity: status === "closed" ? 0.7 : 1,
                  transition: "background-color 150ms ease",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {date.format(new Date(t.openedAt))}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Link
                    component={NextLink}
                    href={`/trades/${t.id}`}
                    underline="none"
                    color="inherit"
                  >
                    <StackPair pair={t.pair} side={t.side} />
                  </Link>
                </TableCell>

                <TableCell align="right">{price.format(t.entry)}</TableCell>

                <TableCell align="right">
                  <Typography variant="body2" color="error.main">
                    {price.format(t.stop)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="body2" color="success.main">
                    {t.target !== undefined ? price.format(t.target) : "—"}
                  </Typography>
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
                      / {price.format(t.size)}
                    </Typography>
                  )}
                </TableCell>

                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {money.format(t.riskAmount)}
                  </Typography>

                  {riskOfAccount !== null && (
                    <Typography
                      component="div"
                      variant="caption"
                      color="text.secondary"
                    >
                      {riskOfAccount.toFixed(2)}% of equity
                    </Typography>
                  )}
                </TableCell>

                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {rr !== null ? `${rr.toFixed(2)}R` : "—"}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  {pnl === null ? (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  ) : (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700 }}
                        color={pnl >= 0 ? "success.main" : "error.main"}
                      >
                        {pnl > 0 ? "+" : ""}
                        {money.format(pnl)}
                      </Typography>

                      {r !== null && (
                        <Typography variant="caption" color="text.secondary">
                          {r > 0 ? "+" : ""}
                          {r.toFixed(2)}R
                        </Typography>
                      )}
                    </Box>
                  )}
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    color={t.strategy ? "text.primary" : "text.disabled"}
                    sx={{ maxWidth: 150 }}
                    noWrap
                  >
                    {t.strategy ?? "—"}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  {t.imageUrl ? (
                    <Tooltip title="Open screenshot">
                      <IconButton
                        component="a"
                        href={t.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        aria-label={`Open screenshot for ${t.pair}`}
                      >
                        <LinkOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="No screenshot attached">
                      <span>
                        <IconButton
                          size="small"
                          disabled
                          aria-label="No screenshot attached"
                        >
                          <LinkOffOutlined fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
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
                    sx={{
                      fontWeight: 600,
                      borderRadius: 1.5,
                    }}
                  />
                </TableCell>

                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 0.5,
                    }}
                  >
                    <Button
                      size="small"
                      disabled={status === "closed"}
                      onClick={() => onClose(t)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 650,
                        borderRadius: 1.5,
                      }}
                    >
                      Close
                    </Button>

                    <Tooltip title="Delete trade">
                      <IconButton
                        size="small"
                        aria-label={`Delete ${t.pair} trade`}
                        onClick={() => onDelete(t)}
                        sx={{
                          color: "text.secondary",
                          "&:hover": {
                            color: "error.main",
                            // bgcolor: "action.hover",
                          },
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function StackPair({ pair, side }: { pair: string; side: Trade["side"] }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        minWidth: 140,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {pair}
      </Typography>

      <Chip
        size="small"
        label={side === "long" ? "Long" : "Short"}
        color={side === "long" ? "success" : "error"}
        variant="outlined"
        sx={{
          height: 22,
          fontSize: 11,
          fontWeight: 650,
          borderRadius: 1.5,
        }}
      />
    </Box>
  );
}
