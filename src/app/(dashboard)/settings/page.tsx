import type { Metadata } from "next";
import { redirect } from "next/navigation";

import SettingsView from "@/features/settings/components/settings-view";
import { getSettings } from "@/features/settings/server/service";
import { getUserSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "تنظیمات | Journalate",
  description: "تنظیمات حساب و معاملات | Journalate .",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SettingsPage() {
  const user = (await getUserSession()).user;
  const settings = await getSettings(user);

  if (!settings) redirect("/onboarding");

  return <SettingsView settings={settings} user={user} />;
}
