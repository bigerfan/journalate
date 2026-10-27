import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getSettings } from "@/features/settings/server/service";
import TradeDetailView from "@/features/trade/components/view/trade-detail-view";
import { getTradeWithCloses } from "@/features/trade/server/service";
import { getUserSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "جزئیات معامله | Journalate",
  description:
    "جزئیات معامله، دفعات بستن، سود و زیان و میزان ریسک رو بررسی کن.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getUserSession();
  const settings = await getSettings(session.user);

  if (!settings) redirect("/onboarding");

  const data = await getTradeWithCloses(session.user, id);
  if (!data) notFound();

  return (
    <TradeDetailView
      trade={data.trade}
      closes={data.closes}
      currency={settings.currency}
    />
  );
}
