"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Container, Typography } from "@mui/material";
import OnboardingForm from "@/features/settings/components/onboarding-form";
import type { Settings } from "@/features/settings/schema";
import { useQueryClient } from "@tanstack/react-query";
import NextLink from "next/link";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

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
        تنظیم دفتر ثبت معاملات
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        موجودی اولیه و سقف ریسک برای محاسبه حجم هر معامله استفاده می‌شن. هر زمان
        بخوای می‌تونی تغییرشون بدی.
      </Typography>
      {initial && (
        <Button
          LinkComponent={NextLink}
          href="/dashboard"
          startIcon={<ArrowForward />}
          sx={{ mb: 2 }}
        >
          داشبورد
        </Button>
      )}

      <OnboardingForm
        initial={initial}
        onSaved={async () => {
          await queryClient.invalidateQueries({ queryKey: ["settings"] });
          router.push("/trades");
        }}
        submitLabel={initial ? "ذخیره تغییرات" : "شروع ثبت معاملات"}
      />
    </Container>
  );
}
