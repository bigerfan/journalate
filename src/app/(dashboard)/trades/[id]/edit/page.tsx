import { notFound, redirect } from "next/navigation";

import { getSettings } from "@/features/settings/server/service";
import TradeEditView from "@/features/trade/components/trade-edit-view";
import { IdSchema } from "@/features/trade/server/schema";
import { getTradeWithCloses } from "@/features/trade/server/service";
import { getUserSession } from "@/lib/auth";
import { HttpError } from "@/lib/http";

export default async function EditTradePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // A malformed id would make Prisma throw (500) on a uuid column; answer 404 instead.
  if (!IdSchema.safeParse({ id }).success) notFound();

  const session = await getUserSession();
  const settings = await getSettings(session.user);
  if (!settings) redirect("/onboarding");

  let data: Awaited<ReturnType<typeof getTradeWithCloses>>;
  try {
    data = await getTradeWithCloses(session.user, id);
  } catch (e) {
    if (e instanceof HttpError && e.status === 404) notFound();
    throw e;
  }

  return (
    <TradeEditView
      trade={data.trade}
      hasCloses={data.closes.length > 0}
      settings={settings}
    />
  );
}
