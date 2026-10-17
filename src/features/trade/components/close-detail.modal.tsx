"use client";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";

import type { Currency } from "@/features/settings/schema";
import { getCurrencyFormatter } from "@/lib/format";
import { closeBreakdown } from "../derive";
import type { Close, Trade } from "../types";
import { LinkOutlined } from "@mui/icons-material";

type Props = {
  open: boolean;
  trade: Trade;
  close: Close | null;
  currency: Currency;
  onClose: () => void;
};

const num = new Intl.NumberFormat(undefined, { maximumFractionDigits: 8 });
const when = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
});

export default function CloseDetailModal({
  open,
  trade,
  close,
  currency,
  onClose,
}: Props) {
  const money = getCurrencyFormatter(currency);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="close-detail-title"
    >
      {close && <Body trade={trade} close={close} money={money} />}
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}

function Body({
  trade,
  close,
  money,
}: {
  trade: Trade;
  close: Close;
  money: Intl.NumberFormat;
}) {
  const b = closeBreakdown(trade, close);
  const signed = (n: number) => `${n > 0 ? "+" : ""}${money.format(n)}`;

  const rows: [string, string][] = [
    ["Closed at", when.format(new Date(close.closedAt))],
    ["Recorded at", when.format(new Date(close.createdAt))],
    ["Percent of original position", `${num.format(close.percent)}%`],
    ["Size closed", num.format(b.size)],
    ["Entry price", num.format(trade.entry)],
    ["Exit price", num.format(close.price)],
    ["Gross P&L", signed(b.gross)],
    ["Exit fees", money.format(b.exitFees)],
    ["Share of entry fees", money.format(b.entryFeeShare)],
  ];

  return (
    <>
      <DialogTitle id="close-detail-title" component="div">
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            {trade.pair} close
          </Typography>
          <Chip size="small" variant="outlined" label={close.reason} />
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Net P&amp;L
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 750 }}
            color={b.net >= 0 ? "success.main" : "error.main"}
          >
            {signed(b.net)}
          </Typography>
          {b.r !== null && (
            <Typography variant="body2" color="text.secondary">
              {b.r > 0 ? "+" : ""}
              {b.r.toFixed(2)}R
            </Typography>
          )}
        </Box>

        <Stack sx={{ gap: 1 }}>
          {rows.map(([label, value]) => (
            <Stack
              key={label}
              direction="row"
              sx={{ justifyContent: "space-between", gap: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, textAlign: "right" }}
              >
                {value}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Section title="Mistake" text={close.mistake} />
        <Section title="Note" text={close.note} />

        {close.imageUrl && (
          <Box sx={{ mt: 2 }}>
            <Button
              startIcon={<LinkOutlined />}
              href={close.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
            >
              Open screenshot
            </Button>
          </Box>
        )}
      </DialogContent>
    </>
  );
}

function Section({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
      >
        {text}
      </Typography>
    </Box>
  );
}
