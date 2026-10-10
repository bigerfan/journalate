"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import OnboardingForm from "@/features/settings/components/onboarding-form";
import { settingsRepo } from "@/features/settings/repo";
import type { Settings } from "@/features/settings/schema";
import { showError } from "@/components/toast/show-error";

export default function OnboardingPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [initial, setInitial] = useState<Settings | null>(null);

  useEffect(() => {
    try {
      settingsRepo.get().then((s) => {
        setInitial(s);
        setLoaded(true);
      });
    } catch (error) {
      showError(error);
    }
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Set up your journal
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Your balance and risk limit are used to calculate position sizes. You
        can change them later.
      </Typography>

      {loaded ? (
        <OnboardingForm
          initial={initial}
          onSaved={() => router.push("/trades/new")}
        />
      ) : (
        <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}
