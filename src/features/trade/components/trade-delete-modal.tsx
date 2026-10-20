import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import React from "react";
import { Trade } from "../types";

export const TradeDeleteModal = ({
  trade,
  open,
  handleClose,
  handleDelete,
}: {
  trade: Trade | null;
  open: boolean;
  handleClose: () => unknown;
  handleDelete: (id: string) => void | Promise<void>;
}) => {
  if (!trade) return null;
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-trade-title"
      aria-describedby="delete-trade-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "calc(100% - 32px)", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography
              id="delete-trade-title"
              variant="h6"
              sx={{ fontWeight: 600 }}
            >
              حذف معامله؟
            </Typography>

            <Typography
              id="delete-trade-description"
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              این کار قابل برگشت نیست. مطمئنی می‌خوای این معامله رو حذف کنی؟
            </Typography>
          </Box>

          {/* Trade information */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1.5,
              bgcolor: "action.hover",
            }}
          >
            <Stack
              direction="row"
              sx={{
                flexWrap: "wrap",
                rowGap: 2,
                columnGap: 4,
                justifyContent: "space-between",
                width: 1,
              }}
            >
              <TradeInfo label="جفت‌ارز" value={trade?.pair} />
              <TradeInfo
                label="جهت معامله"
                value={trade?.side === "long" ? "لانگ" : "شورت"}
              />
              <TradeInfo label="قیمت ورود" value={trade?.entry} />
              <TradeInfo label="حجم معامله" value={trade?.size} />
            </Stack>
          </Box>

          {/* Actions */}
          <Stack direction="row" sx={{ justifyContent: "flex-end", gap: 1.5 }}>
            <Button variant="outlined" onClick={handleClose}>
              انصراف
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(trade?.id)}
            >
              حذف معامله
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

const TradeInfo = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <Box sx={{ minWidth: 80 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 0.25 }}
      >
        {label}
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value ?? "—"}
      </Typography>
    </Box>
  );
};
