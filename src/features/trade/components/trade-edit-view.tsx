"use client";

import Link from "next/link";
import { Alert, Container, Link as MuiLink, Typography } from "@mui/material";

import type { Settings } from "@/features/settings/schema";
import type { Trade } from "../types";
import TradeForm from "./trade-form";

type Props = {
  trade: Trade;
  settings: Settings;
  hasCloses: boolean;
};

export default function TradeEditView({ trade, settings, hasCloses }: Props) {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <MuiLink
        component={Link}
        href={`/trades/${trade.id}`}
        underline="hover"
        variant="body2"
      >
        بازگشت به معامله
      </MuiLink>

      <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 1 }}>
        ویرایش معامله <bdi>{trade.pair}</bdi>
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        اطلاعات معامله رو اصلاح کن و ذخیره کن.
      </Typography>

      {hasCloses && (
        <Alert severity="info" sx={{ mb: 3 }}>
          این معامله کلوز ثبت‌شده داره. تغییر قیمت ورود، حجم یا کارمزد، سود و
          زیان و R کلوزهای قبلی رو دوباره محاسبه می‌کنه. جهت معامله و زمان باز
          شدنش (بعد از اولین کلوز) هم قابل تغییر نیست.
        </Alert>
      )}

      <TradeForm settings={settings} trade={trade} hasCloses={hasCloses} />
    </Container>
  );
}
