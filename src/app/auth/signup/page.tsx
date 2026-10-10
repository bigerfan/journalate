import { Box, Card, Container, Typography } from "@mui/material";
import { SignupForm } from "@/features/auth/components/auth-signup-form";
import { auth, getUserSession, requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const Page = async () => {
  const session = await getUserSession();
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
              Welcome to journalate!
            </Typography>

            <Typography variant="body2" color="text.secondary">
              signup and start your journal
            </Typography>
          </Box>

          <SignupForm />
        </Card>
      </Container>
    </Box>
  );
};

export default Page;
