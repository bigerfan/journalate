import { getSettings } from "@/features/settings/server/service";
import NewTradeView from "@/features/trade/components/new-trade-view";
import { currentEquity } from "@/features/trade/derive";
import { listCloses, listTrades } from "@/features/trade/server/service";
import { auth, getUserSession } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
