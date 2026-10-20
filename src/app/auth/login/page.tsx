import type { Metadata } from "next";
import { Box, Card, Container, Typography } from "@mui/material";
import { LoginForm } from "@/features/auth/components/auth-login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "ورود به حساب کاربری | Journalate",
  description:
    "وارد حساب کاربری Journalate شو و ثبت و بررسی معاملاتت رو ادامه بده.",
  robots: {
    index: false,
    follow: false,
  },
};

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/dashboard");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={3}
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },
            borderRadius: 3,
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 600 }}
              gutterBottom
            >
              خوش برگشتی
            </Typography>

            <Typography variant="body2" color="text.secondary">
              برای ادامه، وارد حساب کاربری‌ات شو.
            </Typography>
          </Box>

          <LoginForm />
        </Card>
      </Container>
    </Box>
  );
};

export default Page;
