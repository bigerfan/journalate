import type { Metadata } from "next";
import DashboardView from "@/features/dashboard/components/dashboard-view";
import { getSettings } from "@/features/settings/server/service";
import { listCloses, listTrades } from "@/features/trade/server/service";
import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "داشبورد | Journalate",
  description: "نمای کلی عملکرد معاملاتی، سود و زیان، و رشد سرمایه.",
  robots: {
    index: false,
    follow: false,
  },
};

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
      startingBalance={settings.startingBalance}
      trades={trades}
      closes={closes}
      currency={settings.currency}
    />
  );
}
