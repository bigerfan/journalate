import { redirect } from "next/navigation";

import SettingsView from "@/features/settings/components/settings-view";
import { getSettings } from "@/features/settings/server/service";
import { getUserSession } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await getUserSession();
  const settings = await getSettings(session.user);
  if (!settings) redirect("/onboarding");

  return <SettingsView settings={settings} />;
}
