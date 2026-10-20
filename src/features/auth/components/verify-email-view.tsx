"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { toast } from "sonner";

import { showError } from "@/components/toast/show-error";
import { authClient } from "@/lib/auth-client";

const COOLDOWN_SECONDS = 60;

export default function VerifyEmailView({ email }: { email?: string }) {
  const [secondsLeft, setSecondsLeft] = useState(COOLDOWN_SECONDS);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const resend = async () => {
    if (!email) return;
    setSending(true);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/trades",
    });
    setSending(false);

    if (error) {
      showError(error, "ارسال ایمیل انجام نشد. کمی بعد دوباره امتحان کن.");
      return;
    }
    toast.success("ایمیل تأیید ارسال شد.");
    setSecondsLeft(COOLDOWN_SECONDS);
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            mx: "auto",
            mb: 2.5,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
            color: "success.main",
          }}
        >
          <MarkEmailReadOutlinedIcon />
        </Box>

        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 750, letterSpacing: "-0.02em" }}
        >
          صندوق ورودی ایمیلت رو بررسی کن
        </Typography>

        {email ? (
          <Typography
            color="text.secondary"
            sx={{ mt: 1.5, overflowWrap: "anywhere" }}
          >
            لینک تأیید رو به این ایمیل فرستادیم:{" "}
            <Box
              component="span"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {email}
            </Box>
            . لینک رو باز کن تا ساخت حسابت کامل بشه.
          </Typography>
        ) : (
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>
            لینک تأیید رو که به ایمیلت فرستادیم باز کن تا ساخت حسابت کامل بشه.
          </Typography>
        )}

        <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
          ایمیل رو پیدا نمی‌کنی؟ پوشه اسپم رو هم بررسی کن.
        </Typography>

        <Stack sx={{ mt: 4, gap: 1.5, alignItems: "center" }}>
          {email && (
            <Button
              variant="contained"
              onClick={resend}
              disabled={sending || secondsLeft > 0}
            >
              {secondsLeft > 0
                ? `ارسال دوباره ایمیل (${secondsLeft} ثانیه)`
                : "ارسال دوباره ایمیل"}
            </Button>
          )}
          <Stack direction="row" sx={{ gap: 2 }}>
            <MuiLink
              component={Link}
              href="/auth/signup"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              استفاده از ایمیل دیگه
            </MuiLink>
            <MuiLink
              component={Link}
              href="/auth/login"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              بازگشت به ورود
            </MuiLink>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
