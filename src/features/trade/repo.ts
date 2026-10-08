import { api } from "@/lib/api";
import type { Settings } from "@/features/settings/schema";
import { groupByTrade, realizedPnl } from "./derive";
import type { Close, NewClose, NewTrade, Trade } from "./types";

// Same method names and shapes as the localStorage version, so no component changes.
export const tradeRepo = {
  list: () => api<Trade[]>("/api/trades"),
  create: (input: NewTrade) =>
    api<Trade>("/api/trades", { method: "POST", body: JSON.stringify(input) }),
  remove: (id: string) => api<void>(`/api/trades/${id}`, { method: "DELETE" }),
};

export const closeRepo = {
  list: () => api<Close[]>("/api/closes"),
  create: (input: NewClose) =>
    api<Close>(`/api/trades/${input.tradeId}/closes`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

// Still computed in the browser from the full lists. Move to SQL when the stats get heavy.
export async function currentEquity(settings: Settings): Promise<number> {
  const [trades, closes] = await Promise.all([
    tradeRepo.list(),
    closeRepo.list(),
  ]);
  const byTrade = groupByTrade(closes);
  const pnl = trades.reduce(
    (sum, t) => sum + realizedPnl(t, byTrade.get(t.id) ?? []),
    0,
  );
  return settings.startingBalance + pnl;
}
