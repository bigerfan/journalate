"use client";

import { Container, Stack } from "@mui/material";
import type { Currency } from "@/features/settings/schema";
import type { Close, Trade } from "../../types";
import CloseTable from "../close-table";
import TradeFacts from "../trade-detail-facts";

type Props = {
  trade: Trade;
  closes: Close[];
  currency: Currency;
};

export default function TradeView({ trade, closes, currency }: Props) {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <TradeFacts trade={trade} closes={closes} currency={currency} />
        <CloseTable trade={trade} closes={closes} currency={currency} />
      </Stack>
    </Container>
  );
}
