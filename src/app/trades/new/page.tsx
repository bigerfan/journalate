"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import TradeForm from "@/features/trade/components/trade-form";
import { currentEquity, settingsRepo } from "@/features/settings/repo";
import type { Settings } from "@/features/settings/types";

export default function NewTradePage() {
  const router = useRouter();
  const [state, setState] = useState<{
    settings: Settings;
    equity: number;
  } | null>(null);

  // localStorage only exists in the browser, so load inside an effect to avoid hydration mismatches.
  useEffect(() => {
    (async () => {
      const settings = await settingsRepo.get();
      if (!settings) {
        router.replace("/onboarding"); // not built yet
        return;
      }
      setState({ settings, equity: await currentEquity(settings) });
    })();
  }, [router]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        New trade
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Enter your entry and stop, and the size is calculated from your risk
        limit.
      </Typography>

      {state ? (
        <TradeForm settings={state.settings} equity={state.equity} />
      ) : (
        <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}
