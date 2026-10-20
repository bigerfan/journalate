import type { Metadata } from "next";
import OnboardingView from "@/features/settings/components/onboarding-view";
import { getSettings } from "@/features/settings/server/service";

import { getUserSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "تنظیمات اولیه | Journalate",
  description:
    "موجودی اولیه حساب و حداکثر ریسک هر معامله رو مشخص کن تا ثبت معاملاتت رو شروع کنی.",
  robots: {
    index: false,
    follow: false,
  },
};

const OnboardingPage = async () => {
  const { user } = await getUserSession();

  const settings = await getSettings(user);

  return <OnboardingView initial={settings} />;
};

export default OnboardingPage;
