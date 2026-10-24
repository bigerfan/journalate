"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema, type ForgotPasswordValues } from "../schema";

export default function ForgotPasswordView() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/auth/reset-password",
    });
    if (error) {
      // Generic on purpose: never echo anything that could reveal whether the account exists.
      setError("root.server", {
        message:
          "ارسال ایمیل انجام نشد. آدرس ایمیلت رو بررسی کن و چند دقیقه دیگه دوباره امتحان کن.",
      });
      return;
    }
    setSentTo(email);
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
        }}
      >
        {sentTo ? (
          <Stack sx={{ gap: 2 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: 750, letterSpacing: "-0.02em" }}
            >
              صندوق ورودی ایمیلت رو بررسی کن
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ overflowWrap: "anywhere" }}
            >
              اگه حسابی با آدرس{" "}
              <Typography
                component="span"
                sx={{ color: "text.primary", fontWeight: 600 }}
              >
                {sentTo}
              </Typography>{" "}
              وجود داشته باشه، لینک تغییر رمز عبور رو برات فرستادیم. اگه ایمیل
              رو دریافت نکردی، پوشه هرزنامه رو هم بررسی کن.
            </Typography>
            <MuiLink
              component={Link}
              href="/auth/login"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              بازگشت به صفحه ورود
            </MuiLink>
          </Stack>
        ) : (
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ gap: 2.5 }}
          >
            <div>
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: 750, letterSpacing: "-0.02em" }}
              >
                رمز عبورت رو فراموش کردی؟
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                ایمیلت رو وارد کن تا لینک انتخاب رمز عبور جدید رو برات بفرستیم.
              </Typography>
            </div>

            {errors.root?.server && (
              <Alert severity="error">{errors.root.server.message}</Alert>
            )}

            {/* Swap in makeFieldProps(register, errors) here to match your other forms. */}
            <TextField
              {...register("email")}
              label="ایمیل"
              type="email"
              autoComplete="email"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
            >
              ارسال لینک تغییر رمز عبور
            </Button>
            <MuiLink
              component={Link}
              href="/auth/login"
              variant="body2"
              color="text.secondary"
              underline="hover"
              sx={{ alignSelf: "center" }}
            >
              بازگشت به صفحه ورود
            </MuiLink>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
