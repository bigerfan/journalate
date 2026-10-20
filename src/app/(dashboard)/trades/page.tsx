import type { Metadata } from "next";
import TradesView from "@/features/trade/components/trades-view";
import { getSettings } from "@/features/settings/server/service";
import { currentEquity } from "@/features/trade/derive";
import { listCloses, listTrades } from "@/features/trade/server/service";
import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "معاملات | Journalate",
  description:
    "معاملاتت رو مدیریت کن، ریسک معاملات باز رو بررسی کن و سود و زیان تحقق‌یافته رو ببین.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TradesPage() {
  const session = await getUserSession();
  const settings = await getSettings(session.user);

  if (!settings) redirect("/onboarding");

  const [trades, closes] = await Promise.all([
    listTrades(session.user),
    listCloses(session.user),
  ]);

  const equity = currentEquity(settings.startingBalance, trades, closes);

  return <TradesView initialData={{ trades, closes, settings, equity }} />;
}
