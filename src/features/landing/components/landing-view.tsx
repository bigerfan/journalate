"use client";

import Link from "next/link";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

import FeatureStrip from "./feature-strip";
import HeroCurve from "./hero-curve";
import { User } from "better-auth";

export default function LandingView({ user }: { user?: User }) {
  return (
    <Box
      component="main"
      sx={{ bgcolor: "background.default", minHeight: "100vh" }}
    >
      <Box
        component="section"
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: "max(560px, min(820px, 100svh))",
        }}
      >
        <HeroCurve />

        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, pt: { xs: 2, md: 3 } }}
        >
          {/* <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography
              sx={{
                fontWeight: 750,
                letterSpacing: "-0.03em",
                fontSize: "1.15rem",
              }}
            >
              Journalate
            </Typography>
            <Button component={Link} href="/auth/login" color="inherit">
              ورود
            </Button>
          </Stack> */}

          <Box sx={{ pt: { xs: 7, md: 12 }, maxWidth: 680 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.7rem", sm: "3.5rem", md: "4.5rem" },
                fontWeight: 750,
                letterSpacing: "-0.045em",
                lineHeight: 1.3,
              }}
            >
              تمام معاملاتت، دقیق و شفاف.
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 2.5, maxWidth: 440, fontSize: "1.1rem" }}
            >
              معاملات، بستن‌های جزئی و اشتباهاتت رو ثبت کن. عملکردت بر اساس نسبت
              R و منحنی سرمایه، همون‌طور که واقعاً هست، ببین.
            </Typography>

            {!user && (
              <Stack direction="row" sx={{ gap: 1.5, mt: 4, flexWrap: "wrap" }}>
                <Button
                  component={Link}
                  href="/auth/signup"
                  variant="contained"
                  size="large"
                >
                  شروع ثبت معاملات
                </Button>

                <Button
                  component={Link}
                  href="/auth/login"
                  size="large"
                  color="inherit"
                >
                  ورود
                </Button>
              </Stack>
            )}
          </Box>
        </Container>

        {/* <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            position: "absolute",
            left: { xs: 16, md: 32 },
            bottom: 12,
            zIndex: 1,
          }}
        >
          داده‌های نمونه
        </Typography> */}
      </Box>

      <FeatureStrip />
    </Box>
  );
}
