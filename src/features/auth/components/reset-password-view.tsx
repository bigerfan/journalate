"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema, type ResetPasswordValues } from "../schema";
import PasswordField from "@/components/fields/password-field";

// `token` is undefined when the link was invalid, expired or opened without a token.
export default function ResetPasswordView({ token }: { token?: string }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async ({ password }: ResetPasswordValues) => {
    if (!token) return;
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    if (error) {
      setError("root.server", {
        message:
          error.message ??
          "تغییر رمز عبور انجام نشد. ممکنه لینک منقضی شده باشه.",
      });
      return;
    }
    toast.success("رمز عبورت با موفقیت تغییر کرد. حالا با رمز جدید وارد شو.");
    router.push("/auth/login");
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
        {!token ? (
          <Stack sx={{ gap: 2, alignItems: "flex-start" }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: 750, letterSpacing: "-0.02em" }}
            >
              لینک معتبر نیست
            </Typography>
            <Typography color="text.secondary">
              لینک تغییر رمز عبور نامعتبره یا اعتبارش تموم شده. برای ادامه، یک
              لینک جدید درخواست کن.
            </Typography>
            <Button
              component={Link}
              href="/auth/forgot-password"
              variant="contained"
            >
              درخواست لینک جدید
            </Button>
          </Stack>
        ) : (
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ gap: 2.5 }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: 750, letterSpacing: "-0.02em" }}
            >
              انتخاب رمز عبور جدید
            </Typography>

            {errors.root?.server && (
              <Alert severity="error">
                {errors.root.server.message}{" "}
                <MuiLink
                  component={Link}
                  href="/auth/forgot-password"
                  color="inherit"
                >
                  درخواست لینک جدید
                </MuiLink>
              </Alert>
            )}

            {/* Swap in makeFieldProps(register, errors) here to match your other forms. */}
            <PasswordField
              {...register("password")}
              label="رمز عبور جدید"
              type="password"
              autoComplete="new-password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              fullWidth
            />
            <PasswordField
              {...register("confirmPassword")}
              label="تکرار رمز عبور جدید"
              type="password"
              autoComplete="new-password"
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
            >
              تغییر رمز عبور
            </Button>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
