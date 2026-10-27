"use client";

import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
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
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { showError } from "@/components/toast/show-error";
import type { Currency } from "@/features/settings/schema";
import { getCurrencyFormatter } from "@/lib/format";
import { closePnl } from "../derive";
import { closeRepo } from "../repo";
import type { Close, Trade } from "../types";
import CloseDetailModal from "./close-detail-modal";
import CloseDeleteModal from "./close-delete-modal";

type Props = {
  trade: Trade;
  closes: Close[];
  currency: Currency;
};

const num = new Intl.NumberFormat(undefined, { maximumFractionDigits: 8 });
const when = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const reasonLabels: Record<string, string> = {
  stop: "حد ضرر",
  target: "حد سود",
  manual: "دستی",
};

const mistakeLabels: Record<string, string> = {
  FOMO: "ورود از روی ترس جا ماندن",
  "Moved stop": "جابه‌جایی حد ضرر",
  "Closed early": "بستن زودهنگام معامله",
  "Held too long": "باز نگه داشتن بیش از حد معامله",
  Oversized: "حجم بیش از حد",
  "Broke my plan": "عمل نکردن به برنامه معاملاتی",
};

export default function CloseTable({ trade, closes, currency }: Props) {
  const money = getCurrencyFormatter(currency);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openCloseModal, setOpenCloseModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const selected = closes.find((close) => close.id === selectedId) ?? null;
  const toDelete = closes.find((close) => close.id === deleteId) ?? null;

  const show = (id: string) => {
    setSelectedId(id);
    setOpenCloseModal(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;

    setDeleting(true);
    try {
      await closeRepo.remove(toDelete.id);
      setDeleteOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trades"] }),
        queryClient.invalidateQueries({ queryKey: ["closes"] }),
      ]);
      toast.success("کلوز حذف شد");
      router.refresh();
    } catch (error) {
      showError(error, "حذف کلوز انجام نشد");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
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
              دفعات بستن معامله
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              تمام دفعاتی که بخشی یا کل این معامله رو بستی.
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {closes.length} مورد ثبت‌شده
          </Typography>
        </Stack>

        {closes.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, textAlign: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              هنوز معامله رو نبستی
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              بخشی یا تمام حجم معامله رو ببند تا نتیجه‌اش اینجا نمایش داده بشه.
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
                  <TableCell>تاریخ بستن</TableCell>
                  <TableCell align="right">درصد حجم</TableCell>
                  <TableCell align="right">قیمت</TableCell>
                  <TableCell>دلیل بستن</TableCell>
                  <TableCell align="right">کارمزد</TableCell>
                  <TableCell align="right">سود و زیان</TableCell>
                  <TableCell>اشتباه / یادداشت</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {closes.map((close) => {
                  const pnl = closePnl(trade, close);
                  const note =
                    [
                      close.mistake
                        ? (mistakeLabels[close.mistake] ?? close.mistake)
                        : "",
                      close.note,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "—";

                  return (
                    <TableRow key={close.id} hover>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {when.format(new Date(close.closedAt))}
                      </TableCell>
                      <TableCell align="right">
                        {num.format(close.percent)}٪
                      </TableCell>
                      <TableCell align="right">
                        {num.format(close.price)}
                      </TableCell>
                      <TableCell>
                        {reasonLabels[close.reason] ?? close.reason ?? "—"}
                      </TableCell>
                      <TableCell align="right">
                        {money.format(close.fees)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: pnl >= 0 ? "success.main" : "error.main",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pnl > 0 ? "+" : ""}
                        {money.format(pnl)}
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
                          {note}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            show(close.id);
                          }}
                        >
                          جزئیات
                        </Button>
                        <IconButton
                          size="small"
                          aria-label="حذف کلوز"
                          onClick={(event) => {
                            event.stopPropagation();
                            setDeleteId(close.id);
                            setDeleteOpen(true);
                          }}
                        >
                          <DeleteOutlineOutlined fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <CloseDetailModal
        open={openCloseModal}
        trade={trade}
        close={selected}
        currency={currency}
        onClose={() => setOpenCloseModal(false)}
      />
      <CloseDeleteModal
        open={deleteOpen}
        trade={trade}
        close={toDelete}
        closes={closes}
        currency={currency}
        pending={deleting}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
