"use client";

import { useForm } from "react-hook-form";
import { SignupFormValues, signupSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

import { makeFieldProps } from "@/lib/form";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import { showError } from "@/components/toast/show-error";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  //   const [] = useState();

  const field = makeFieldProps(register, errors);

  const onSubmit = async (data: SignupFormValues) => {
    const { data: authData, error } = await authClient.signUp.email({
      email: data.email,
      name: data.name,
      password: data.password,
    });
    if (error?.message) showError(error, error.message);

    console.log(authData);
    console.log(error);
    // else router.replace("/");
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        <Typography variant="h5">Create account</Typography>

        <TextField
          {...field("name")}
          label="Name"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          autoComplete="name"
        />

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
          autoComplete="new-password"
        />
        <Link href="/auth/login">
          <Typography
            color="primary"
            sx={{
              "&: hover": {
                color: "primary.light",
              },
            }}
          >
            Already Have an Account ? Login
          </Typography>
        </Link>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          loading={isSubmitting}
        >
          Sign up
        </Button>
      </Stack>
    </Box>
  );
}
