import OnboardingView from "@/features/settings/components/onboarding-view";
import { getSettings } from "@/features/settings/server/service";
import { getUserSession } from "@/lib/auth";
import React from "react";

const OnboardingPage = async () => {
  const { user } = await getUserSession();

  const settings = await getSettings(user);
  return <OnboardingView initial={settings} />;
};

export default OnboardingPage;
