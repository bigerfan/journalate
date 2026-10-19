"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { authClient } from "@/lib/auth-client";
import DeleteAccountModal from "./delete-account-modal";

type Props = {
  email: string;
  accountCreatedAt?: Date;
};

export default function AccountSection({ email, accountCreatedAt }: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <BoxHeader />

          <Stack spacing={2}>
            <InfoRow label="Email address" value={email} />

            {accountCreatedAt && (
              <InfoRow
                label="Member since"
                value={new Date(accountCreatedAt).toLocaleDateString(
                  undefined,
                  { dateStyle: "medium" },
                )}
              />
            )}
          </Stack>

          <BoxDivider />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              spacing: 2,
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Delete account
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Permanently remove your account and associated data.
              </Typography>
            </Stack>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete account
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <DeleteAccountModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  );
}

function BoxHeader() {
  return (
    <Stack spacing={0.5}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Account
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Your account information and account management.
      </Typography>
    </Stack>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      sx={{
        justifyContent: "space-between",
        spacing: 0.5,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{ overflowWrap: "anywhere", fontWeight: 600 }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function BoxDivider() {
  return (
    <Stack
      sx={{
        borderTop: 1,
        borderColor: "divider",
      }}
    />
  );
}
