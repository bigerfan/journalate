import type { Metadata } from "next";
import { getSettings } from "@/features/settings/server/service";
import NewTradeView from "@/features/trade/components/new-trade-view";
import { currentEquity } from "@/features/trade/derive";
import { listCloses, listTrades } from "@/features/trade/server/service";
import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "ثبت معامله جدید | Journalate",
  description:
    "معامله جدیدت رو ثبت کن و حجم معامله رو بر اساس موجودی حساب و میزان ریسک محاسبه کن.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewTradePage() {
  const session = await getUserSession();
  const settings = await getSettings(session.user);

  if (!settings) redirect("/onboarding");

  // calculate equity
  const trades = await listTrades(session.user);
  const closes = await listCloses(session.user);
  const equity = currentEquity(settings.startingBalance, trades, closes);

  return <NewTradeView initialData={{ settings, equity }} />;
}
