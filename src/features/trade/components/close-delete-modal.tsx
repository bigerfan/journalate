"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import type { Currency } from "@/features/settings/schema";
import { getCurrencyFormatter } from "@/lib/format";
import { closePnl, remainingPct, statusOf } from "../derive";
import type { Close, Trade } from "../types";

type Props = {
  open: boolean;
  trade: Trade;
  close: Close | null; // kept by the parent while the dialog animates out
  closes: Close[]; // all closes of this trade
  currency: Currency;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const when = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function CloseDeleteModal({
  open,
  trade,
  close,
  closes,
  currency,
  pending,
  onCancel,
  onConfirm,
}: Props) {
  const money = getCurrencyFormatter(currency);

  let body = null;
  if (close) {
    const pnl = closePnl(trade, close);
    const rest = closes.filter((c) => c.id !== close.id);
    const reopened = statusOf(rest) === "open";
    const left = remainingPct(rest);

    body = (
      <Stack sx={{ gap: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          کلوز <bdi>{when.format(new Date(close.closedAt))}</bdi> (
          {close.percent}٪ از حجم اصلی) حذف می‌شه.
        </Typography>
        <Typography variant="body2">
          سود و زیان این کلوز (
          <bdi>
            {pnl > 0 ? "+" : ""}
            {money.format(pnl)}
          </bdi>
          ) از آمار و موجودی حساب کم می‌شه.
        </Typography>
        <Typography variant="body2">
          {reopened
            ? "معامله دوباره کاملاً باز می‌شه."
            : `بعد از حذف، ${left.toFixed(2)}٪ از حجم اصلی معامله باز می‌مونه.`}
        </Typography>
        <Typography variant="body2" color="error.main">
          این کار قابل بازگشت نیست.
        </Typography>
      </Stack>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={pending ? undefined : onCancel}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>حذف کلوز</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={pending}>
          انصراف
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={pending}
        >
          {pending ? "در حال حذف..." : "حذف کلوز"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
