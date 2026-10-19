"use client";

import Link from "next/link";
import { Box, Button, Container, Link as MuiLink, Stack } from "@mui/material";
import { User } from "better-auth";
import { Add, Dashboard } from "@mui/icons-material";

export default function Header({ user }: { user?: User }) {
  return (
    <Box component="header">
      <Container maxWidth="lg">
        <Stack
          direction="row"
          sx={{
            height: 64,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MuiLink
            component={Link}
            href="/"
            underline="none"
            color="inherit"
            sx={{
              fontWeight: 750,
              letterSpacing: "-0.03em",
              fontSize: "1.15rem",
            }}
          >
            Journalate
          </MuiLink>
          {user ? (
            <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
              <Button
                component={Link}
                href="/trades/new"
                variant="contained"
                startIcon={<Add />}
              >
                new trade
              </Button>
              <Button
                component={Link}
                href="/dashboard"
                color="inherit"
                startIcon={<Dashboard />}
              >
                dashboard
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
              <Button component={Link} href="/auth/login" color="inherit">
                Log in
              </Button>
              <Button component={Link} href="/auth/signup" variant="contained">
                Sign up
              </Button>
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
