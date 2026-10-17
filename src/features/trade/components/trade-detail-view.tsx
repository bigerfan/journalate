"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { Currency } from "@/features/settings/schema";
import { getCurrencyFormatter } from "@/lib/format";
import {
  closedPct,
  closePnl,
  realizedPnl,
  remainingSize,
  rMultiple,
  statusOf,
} from "../derive";
import type { Close, Trade } from "../types";
import CloseDetailModal from "./close-detail.modal";

type Props = {
  trade: Trade;
  closes: Close[];
  currency: Currency;
};

const num = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 8,
});

const when = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function TradeDetailView({ trade, closes, currency }: Props) {
  const money = getCurrencyFormatter(currency);
  const status = statusOf(closes);
  const pnl = closes.length > 0 ? realizedPnl(trade, closes) : null;
  const r = rMultiple(trade, closes);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openCloseModal, setOpenCloseModal] = useState(false);

  const selected = closes.find((c) => c.id === selectedId) ?? null;

  const show = (id: string) => {
    setSelectedId(id);
    setOpenCloseModal(true);
  };

  const facts: [string, string][] = [
    ["Entry price", num.format(trade.entry)],
    ["Stop loss", num.format(trade.stop)],
    [
      "Take profit",
      trade.target !== undefined ? num.format(trade.target) : "—",
    ],
    ["Position size", num.format(trade.size)],
    [
      "Size remaining",
      status === "closed" ? "—" : num.format(remainingSize(trade, closes)),
    ],
    ["Planned risk", money.format(trade.riskAmount)],
    ["Position closed", `${closedPct(closes).toFixed(2)}%`],
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        {/* Navigation */}
        <Box>
          <MuiLink
            component={Link}
            href="/trades"
            underline="hover"
            variant="body2"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              color: "text.secondary",
              mb: 2,
            }}
          >
            ← Trades
          </MuiLink>

          {/* Trade heading */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              spacing: 2,
            }}
          >
            <Box>
              <Stack
                sx={{
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
                direction="row"
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 750,
                    letterSpacing: "-0.035em",
                    overflowWrap: "anywhere",
                  }}
                >
                  {trade.pair}
                </Typography>

                <Chip
                  size="small"
                  variant="outlined"
                  label={trade.side === "long" ? "Long" : "Short"}
                  color={trade.side === "long" ? "success" : "error"}
                />

                <Chip size="small" label={status} variant="outlined" />
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Opened {when.format(new Date(trade.openedAt))}
                {trade.strategy ? ` · ${trade.strategy}` : ""}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Main performance cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Realized P&L
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 1,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                overflowWrap: "anywhere",
                color:
                  pnl === null
                    ? "text.primary"
                    : pnl >= 0
                      ? "success.main"
                      : "error.main",
              }}
            >
              {pnl === null ? "—" : `${pnl > 0 ? "+" : ""}${money.format(pnl)}`}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              {closes.length} {closes.length === 1 ? "close" : "closes"}{" "}
              recorded
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              R multiple
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 1,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color:
                  r === null
                    ? "text.primary"
                    : r >= 0
                      ? "success.main"
                      : "error.main",
              }}
            >
              {r === null ? "—" : `${r >= 0 ? "+" : ""}${r.toFixed(2)}R`}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              Realized risk multiple
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Position closed
            </Typography>

            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: 700, letterSpacing: "-0.03em" }}
            >
              {closedPct(closes).toFixed(2)}%
            </Typography>

            <Box
              sx={{
                height: 4,
                bgcolor: "action.hover",
                borderRadius: 1,
                overflow: "hidden",
                mt: 2,
              }}
            >
              <Box
                sx={{
                  width: `${Math.min(100, Math.max(0, closedPct(closes)))}%`,
                  height: "100%",
                  bgcolor: "text.primary",
                  transition: "width 200ms ease",
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* Trade information */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
            Trade information
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {facts.map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.75 }}
                >
                  {label}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Closes table */}
        <Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              mb: 2,
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              spacing: 1,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Closes
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Every partial or final close recorded for this trade.
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {closes.length} {closes.length === 1 ? "record" : "records"}
            </Typography>
          </Stack>

          {closes.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                No closes yet
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Close part or all of this position to see your results here.
              </Typography>
            </Paper>
          ) : (
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ borderRadius: 2, overflowX: "auto" }}
            >
              <Table size="small" sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Closed</TableCell>
                    <TableCell align="right">% of position</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell align="right">Fees</TableCell>
                    <TableCell align="right">P&L</TableCell>
                    <TableCell>Mistake / note</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {closes.map((c) => {
                    const p = closePnl(trade, c);

                    return (
                      <TableRow key={c.id} hover>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {when.format(new Date(c.closedAt))}
                        </TableCell>

                        <TableCell align="right">
                          {num.format(c.percent)}%
                        </TableCell>

                        <TableCell align="right">
                          {num.format(c.price)}
                        </TableCell>

                        <TableCell>{c.reason || "—"}</TableCell>

                        <TableCell align="right">
                          {money.format(c.fees)}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            color: p >= 0 ? "success.main" : "error.main",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p > 0 ? "+" : ""}
                          {money.format(p)}
                        </TableCell>

                        <TableCell sx={{ minWidth: 180, maxWidth: 280 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflowWrap: "anywhere",
                              whiteSpace: "normal",
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 1,
                              overflow: "hidden",
                            }}
                          >
                            {[c.mistake, c.note].filter(Boolean).join(" · ") ||
                              "—"}
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              show(c.id);
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Stack>

      <CloseDetailModal
        open={openCloseModal}
        trade={trade}
        close={selected}
        currency={currency}
        onClose={() => setOpenCloseModal(false)}
      />
    </Container>
  );
}
