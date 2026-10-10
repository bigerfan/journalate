import { Box, Card, Container, Typography } from "@mui/material";
import { LoginForm } from "@/features/auth/components/auth-login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/");
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
              Welcome back
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Login to your account to continue
            </Typography>
          </Box>

          <LoginForm />
        </Card>
      </Container>
    </Box>
  );
};

export default Page;
