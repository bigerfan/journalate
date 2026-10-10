"use client";

import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { makeFieldProps } from "@/lib/form";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { showError } from "@/components/toast/show-error";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const field = makeFieldProps(register, errors);

  const onSubmit = async (data: LoginFormValues) => {
    const { data: AuthData, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
    if (error?.message) showError(error, error.message);

    console.log(AuthData);
    console.log(error);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        <Typography variant="h5">Login</Typography>

        <TextField
          {...field("email")}
          label="Email"
          type="email"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
          autoComplete="email"
        />

        <TextField
          {...field("password")}
          label="Password"
          type="password"
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="current-password"
        />
        <Link href="/auth/signup">
          <Typography
            color="primary"
            sx={{
              "&: hover": {
                color: "primary.light",
              },
            }}
          >
            Dont Have an Account ? Signup
          </Typography>
        </Link>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          loading={isSubmitting}
        >
          Login
        </Button>
      </Stack>
    </Box>
  );
}
