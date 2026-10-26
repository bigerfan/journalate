"use client";

import { useMemo, useState } from "react";
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
  MenuItem,
  Menu,
  Stack,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  CloseOutlined,
  Delete,
  Edit,
  LinkOffOutlined,
  LinkOutlined,
  MoreVert,
} from "@mui/icons-material";

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
  onEdit: (trade: Trade) => void;
  onClose: (trade: Trade) => void;
};

const STATUS: Record<
  TradeStatus,
  {
    label: string;
    color: "primary" | "warning" | "default";
  }
> = {
  open: { label: "باز", color: "primary" },
  partial: { label: "بخشی بسته‌شده", color: "warning" },
  closed: { label: "بسته‌شده", color: "default" },
};

export default function TradeTable({
  trades,
  closesByTrade,
  currency,
  equity,
  onDelete,
  onEdit,
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

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    trade: Trade,
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTrade(trade);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTrade(null);
  };

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
          هنوز معامله‌ای ثبت نکردی
        </Typography>

        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ maxWidth: 340, mx: "auto", mb: 3 }}
        >
          دفتر ثبت معاملاتت از اینجا شروع می‌شه. اولین معامله‌ات رو ثبت کن تا
          بتونی قیمت‌های ورود، ریسک و عملکردت رو بررسی کنی.
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
          + ثبت معامله جدید
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
            <TableCell>تاریخ ورود</TableCell>
            <TableCell>جفت‌ارز</TableCell>
            <TableCell align="right">ورود</TableCell>
            <TableCell align="right">حد ضرر</TableCell>
            <TableCell align="right">حد سود</TableCell>
            <TableCell align="right">حجم باقی‌مانده</TableCell>
            <TableCell align="right">ریسک</TableCell>
            <TableCell align="right">سود به ریسک</TableCell>
            <TableCell align="right">سود و زیان تحقق‌یافته</TableCell>
            <TableCell>استراتژی</TableCell>
            <TableCell align="center">تصویر معامله</TableCell>
            <TableCell>وضعیت</TableCell>
            <TableCell align="right">عملیات</TableCell>
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
                    sx={{ fontWeight: 800, color: "primary.main" }}
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
                      {riskOfAccount.toFixed(2)}٪ از موجودی
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
                    <Tooltip title="باز کردن تصویر معامله">
                      <IconButton
                        component="a"
                        href={t.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        aria-label={`باز کردن تصویر معامله ${t.pair}`}
                      >
                        <LinkOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="تصویری ثبت نشده">
                      <span>
                        <IconButton
                          size="small"
                          disabled
                          aria-label="تصویری ثبت نشده"
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
                        ? `بخشی بسته‌شده · ${closedPct(closes).toFixed(0)}٪`
                        : STATUS[status].label
                    }
                    sx={{
                      fontWeight: 600,
                      borderRadius: 1.5,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Trade actions">
                    <IconButton
                      aria-label={`Actions for ${t.pair}`}
                      aria-haspopup="menu"
                      aria-expanded={
                        menuAnchor !== null && selectedTrade?.id === t.id
                      }
                      onClick={(event) => handleMenuOpen(event, t)}
                      sx={{
                        width: 36,
                        height: 36,
                        color: "text.secondary",
                        "&:hover": {
                          bgcolor: "action.hover",
                          color: "text.primary",
                        },
                      }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor && selectedTrade)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 150,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: 3,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedTrade) onEdit(selectedTrade);
            handleMenuClose();
          }}
          sx={{ gap: 1.5, py: 1 }}
        >
          <Stack
            sx={{
              width: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography>ویرایش</Typography>
            <Edit />
          </Stack>
        </MenuItem>

        <MenuItem
          disabled={
            !selectedTrade ||
            statusOf(closesByTrade.get(selectedTrade.id) ?? []) === "closed"
          }
          onClick={() => {
            if (selectedTrade) onClose(selectedTrade);
            handleMenuClose();
          }}
          sx={{ gap: 1.5, py: 1 }}
        >
          <Stack
            sx={{
              width: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography>بستن</Typography>
            <CloseOutlined />
          </Stack>
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (selectedTrade) onDelete(selectedTrade);
            handleMenuClose();
          }}
          sx={{
            gap: 1.5,
            py: 1,
            color: "error.main",
          }}
        >
          <Stack
            sx={{
              width: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography>حذف</Typography>
            <Delete />
          </Stack>
        </MenuItem>
      </Menu>
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
        label={side === "long" ? "لانگ" : "شورت"}
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
