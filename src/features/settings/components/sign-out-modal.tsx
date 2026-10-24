"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { authClient } from "@/lib/auth-client";
import { showError } from "@/components/toast/show-error";

type SignOutModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function SignOutModal({ open, onClose }: SignOutModalProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleClose = () => {
    if (signingOut) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        showError(error, "خروج از حساب کاربری انجام نشد. دوباره امتحان کن.");
        return;
      }

      onClose();
      router.replace("/auth/login");
      router.refresh();
    } catch (error) {
      showError(error, "خروج از حساب کاربری انجام نشد. دوباره امتحان کن.");
    } finally {
      setSigningOut(false);
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
          خروج از حساب کاربری
        </Typography>

        <IconButton
          aria-label="بستن پنجره"
          onClick={handleClose}
          disabled={signingOut}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <DialogContentText>
            می‌خوای از حساب کاربریت خارج بشی؟
          </DialogContentText>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 2,
          pb: 2,
          gap: 1,
        }}
      >
        <Button onClick={handleClose} disabled={signingOut} variant="outlined">
          انصراف
        </Button>

        <Button
          onClick={() => void handleConfirm()}
          disabled={signingOut}
          color="error"
          variant="contained"
        >
          {signingOut ? "در حال خروج..." : "خروج از حساب"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
