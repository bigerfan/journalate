"use client";

import { useRouter } from "next/navigation";
import { Container, Typography } from "@mui/material";
import OnboardingForm from "@/features/settings/components/onboarding-form";
import type { Settings } from "@/features/settings/schema";
import { useQueryClient } from "@tanstack/react-query";

export default function OnboardingView({
  initial,
}: {
  initial: Settings | null;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Set up your journal
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Your balance and risk limit are used to calculate position sizes. You
        can change them later.
      </Typography>

      <OnboardingForm
        initial={initial}
        onSaved={async () => {
          await queryClient.invalidateQueries({ queryKey: ["settings"] });
          router.push("/trades");
        }}
        submitLabel={initial ? "update settings" : "startjournal"}
      />
    </Container>
  );
}
