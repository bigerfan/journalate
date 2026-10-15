import TradesView from "@/features/trade/components/trades-view";
import { getSettings } from "@/features/settings/server/service";
import { currentEquity } from "@/features/trade/derive";
import { listCloses, listTrades } from "@/features/trade/server/service";
import { auth, getUserSession } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getUserSession();
  const settings = await getSettings(session.user);
  if (!settings) redirect("/onboarding");
  const [trades, closes] = await Promise.all([
    listTrades(session.user),
    listCloses(session.user),
  ]);
  const equity = currentEquity(settings, trades, closes);

  return <TradesView initialData={{ trades, closes, settings, equity }} />;
}
