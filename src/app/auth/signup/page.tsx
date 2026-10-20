import type { Metadata } from "next";
import { Box, Card, Container, Typography } from "@mui/material";
import { SignupForm } from "@/features/auth/components/auth-signup-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "ثبت‌نام | Journalate",
  description:
    "در Journalate حساب کاربری بساز و ثبت معاملات، مدیریت ریسک و بررسی عملکردت رو شروع کن.",
  robots: {
    index: false,
    follow: false,
  },
};

const Page = async () => {
  // const session = await getUserSession();
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
              به Journalate خوش اومدی!
            </Typography>

            <Typography variant="body2" color="text.secondary">
              ثبت‌نام کن و ثبت معاملاتت رو شروع کن.
            </Typography>
          </Box>

          <SignupForm />
        </Card>
      </Container>
    </Box>
  );
};

export default Page;
