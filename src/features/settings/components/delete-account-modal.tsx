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
      setError("Please enter your password.");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await authClient.deleteUser({ password });
      setPassword("");
      onClose();
    } catch (error) {
      showError(error, "unable to delete account.check your password");
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
          Delete account
        </Typography>

        <IconButton
          aria-label="Close dialog"
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
            This action is permanent and may delete your account and associated
            trading data. Enter your password to confirm.
          </DialogContentText>

          <TextField
            fullWidth
            type="password"
            label="Password"
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
          Cancel
        </Button>

        <Button
          onClick={() => void handleConfirm()}
          disabled={deleting}
          color="error"
          variant="contained"
        >
          {deleting ? "Deleting..." : "Confirm delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
