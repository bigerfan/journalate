import DashboardView from "@/features/dashboard/components/dashboard-view";
import { getSettings } from "@/features/settings/server/service";
import { listCloses, listTrades } from "@/features/trade/server/service";
import { Close, Trade } from "@/features/trade/types";
import { auth, getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = (await getUserSession()).user;
  const [settings, trades, closes] = await Promise.all([
    getSettings(user),
    listTrades(user),
    listCloses(user),
  ]);
  if (!settings) redirect("/onboarding");

  return (
    <DashboardView
      startingBalance={settings?.startingBalance}
      trades={trades}
      closes={closes}
      currency={settings.currency}
    />
  );
}
