"use client";

import { Box, CircularProgress, Container, Typography } from "@mui/material";
import TradeForm from "@/features/trade/components/trade-form";
import { settingsRepo } from "@/features/settings/repo";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "@/features/settings/schema";

type NewTradePage = {
  initialData: {
    settings: Settings;
    equity: number;
  };
};

export default function NewTradeView({ initialData }: NewTradePage) {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsRepo.get,
    initialData: initialData.settings,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ثبت معامله جدید
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        قیمت ورود و حد ضرر رو وارد کن تا حجم معامله بر اساس سقف ریسکت محاسبه
        بشه.
      </Typography>

      {settings ? (
        <TradeForm settings={settings} equity={initialData.equity} />
      ) : (
        <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}
