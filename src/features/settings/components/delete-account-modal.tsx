"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { authClient } from "@/lib/auth-client";
import { showError } from "@/components/toast/show-error";

type DeleteAccountModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteAccountModal({
  open,
  onClose,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleClose = () => {
    if (deleting) return;

    setPassword("");
    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError("لطفاً رمز عبورت رو وارد کن.");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await authClient.deleteUser({ password });
      setPassword("");
      onClose();
    } catch (error) {
      showError(error, "حذف حساب کاربری انجام نشد. رمز عبورت رو بررسی کن.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          pb: 1,
        }}
      >
        <Typography
          component="span"
          sx={{ fontSize: "1.125rem", fontWeight: 700 }}
        >
          حذف حساب کاربری
        </Typography>

        <IconButton
          aria-label="بستن پنجره"
          onClick={handleClose}
          disabled={deleting}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <DialogContentText>
            این کار برگشت‌پذیر نیست و ممکنه حساب کاربری و اطلاعات معاملاتت رو
            برای همیشه حذف کنه. برای تأیید، رمز عبورت رو وارد کن.
          </DialogContentText>

          <TextField
            fullWidth
            type="password"
            label="رمز عبور"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !deleting) {
                void handleConfirm();
              }
            }}
            error={Boolean(error)}
            helperText={error || " "}
            disabled={deleting}
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 2,
          pb: 2,
          gap: 1,
        }}
      >
        <Button onClick={handleClose} disabled={deleting} variant="outlined">
          انصراف
        </Button>

        <Button
          onClick={() => void handleConfirm()}
          disabled={deleting}
          color="error"
          variant="contained"
        >
          {deleting ? "در حال حذف..." : "تأیید حذف"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
