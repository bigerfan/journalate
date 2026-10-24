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
import SignOutModal from "./sign-out-modal";

type Props = {
  email: string;
  accountCreatedAt?: Date;
};

export default function AccountSection({ email, accountCreatedAt }: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [signoutModal, setSignoutModal] = useState(false);

  return (
    <>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <BoxHeader />

          <Stack spacing={2}>
            <InfoRow label="آدرس ایمیل" value={email} />

            {accountCreatedAt && (
              <InfoRow
                label="تاریخ عضویت"
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
            {/* <Stack spacing={0.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                حذف حساب کاربری
              </Typography>

              <Typography variant="body2" color="text.secondary">
                حساب کاربری و تمام اطلاعات مرتبط با آن برای همیشه حذف می‌شوند.
              </Typography>
            </Stack> */}

            {/* <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteModalOpen(true)}
            >
              حذف حساب کاربری
            </Button> */}
            <Button
              variant="outlined"
              color="error"
              onClick={() => setSignoutModal(true)}
            >
              خروج از اکانت
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* <DeleteAccountModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      /> */}
      <SignOutModal
        open={signoutModal}
        onClose={() => setSignoutModal(false)}
      />
    </>
  );
}

function BoxHeader() {
  return (
    <Stack spacing={0.5}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        حساب کاربری
      </Typography>

      <Typography variant="body2" color="text.secondary">
        اطلاعات حساب و مدیریت حساب کاربری.
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
