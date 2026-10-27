"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { Currency } from "@/features/settings/schema";
import { getCurrencyFormatter } from "@/lib/format";
import {
  closedPct,
  realizedPnl,
  remainingSize,
  rMultiple,
  statusOf,
} from "../derive";
import type { Close, Trade } from "../types";

type Props = {
  trade: Trade;
  closes: Close[];
  currency: Currency;
};

const when = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const statusLabels: Record<string, string> = {
  open: "باز",
  partial: "بخشی بسته‌شده",
  closed: "بسته‌شده",
};

const num = new Intl.NumberFormat(undefined, { maximumFractionDigits: 8 });

export default function TradeFacts({ trade, closes, currency }: Props) {
  const status = statusOf(closes);
  const pnl = closes.length > 0 ? realizedPnl(trade, closes) : null;
  const r = rMultiple(trade, closes);
  const closedPercentage = closedPct(closes);
  const money = getCurrencyFormatter(currency);

  const facts: [string, string][] = [
    ["قیمت ورود", num.format(trade.entry)],
    ["حد ضرر", num.format(trade.stop)],
    ["حد سود", trade.target !== undefined ? num.format(trade.target) : "—"],
    ["حجم معامله", num.format(trade.size)],
    [
      "حجم باقی‌مانده",
      status === "closed" ? "—" : num.format(remainingSize(trade, closes)),
    ],
    ["ریسک اولیه", money.format(trade.riskAmount)],
    ["درصد حجم بسته‌شده", `${closedPct(closes).toFixed(2)}٪`],
  ];

  return (
    <>
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
          ← معاملات
        </MuiLink>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Box>
            <Stack
              sx={{ alignItems: "center", flexWrap: "wrap", gap: 1.5 }}
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
                label={trade.side === "long" ? "لانگ" : "شورت"}
                color={trade.side === "long" ? "success" : "error"}
              />
              <Chip
                size="small"
                label={statusLabels[status] ?? status}
                variant="outlined"
              />
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              تاریخ ورود: {when.format(new Date(trade.openedAt))}
              {trade.strategy ? ` · ${trade.strategy}` : ""}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              href={`/trades/${trade.id}/edit`}
              LinkComponent={Link}
            >
              ویرایش
            </Button>
          </Box>
        </Stack>
      </Box>

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
            سود و زیان تحقق‌یافته
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
            {closes.length} بار بستن معامله ثبت شده
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary">
            نسبت R
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
            نسبت سود و زیان به ریسک اولیه
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary">
            درصد حجم بسته‌شده
          </Typography>
          <Typography
            variant="h4"
            sx={{ mt: 1, fontWeight: 700, letterSpacing: "-0.03em" }}
          >
            {closedPercentage.toFixed(2)}٪
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
                width: `${Math.min(100, Math.max(0, closedPercentage))}%`,
                height: "100%",
                bgcolor: "text.primary",
                transition: "width 200ms ease",
              }}
            />
          </Box>
        </Paper>
      </Box>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
          اطلاعات معامله
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
    </>
  );
}
