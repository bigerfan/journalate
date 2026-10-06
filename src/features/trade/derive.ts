import type { Close, Trade } from "./types";

const EPS = 1e-8;

export type TradeStatus = "open" | "partial" | "closed";

export function groupByTrade(closes: Close[]): Map<string, Close[]> {
  const map = new Map<string, Close[]>();
  for (const c of closes)
    map.set(c.tradeId, [...(map.get(c.tradeId) ?? []), c]);
  return map;
}

export const closedPct = (closes: Close[]) =>
  closes.reduce((s, c) => s + c.percent, 0);

export function remainingPct(closes: Close[]): number {
  const r = 100 - closedPct(closes);
  return r < EPS ? 0 : r;
}

export function statusOf(closes: Close[]): TradeStatus {
  if (closes.length === 0) return "open";
  return remainingPct(closes) === 0 ? "closed" : "partial";
}

export const remainingSize = (trade: Trade, closes: Close[]) =>
  (trade.size * remainingPct(closes)) / 100;

// Risk still on the table: the original planned risk scaled by what's left of the position.
export const remainingRisk = (trade: Trade, closes: Close[]) =>
  (trade.riskAmount * remainingPct(closes)) / 100;

/** P&L of one exit, net of its own fees and the matching share of the entry fees. */
export function closePnl(
  trade: Trade,
  c: Pick<Close, "percent" | "price" | "fees">,
): number {
  const size = (trade.size * c.percent) / 100;
  const dir = trade.side === "long" ? 1 : -1;
  const gross = dir * (c.price - trade.entry) * size;
  return gross - c.fees - (trade.fees * c.percent) / 100;
}

export const realizedPnl = (trade: Trade, closes: Close[]) =>
  closes.reduce((sum, c) => sum + closePnl(trade, c), 0);

/** Realized P&L divided by the planned risk of the portion closed so far. Null until something is closed. */
export function rMultiple(trade: Trade, closes: Close[]): number | null {
  if (closes.length === 0 || trade.riskAmount <= 0) return null;
  return (
    realizedPnl(trade, closes) / ((trade.riskAmount * closedPct(closes)) / 100)
  );
}
