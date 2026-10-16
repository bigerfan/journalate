import {
  closePnl,
  groupByTrade,
  realizedPnl,
  rMultiple,
  statusOf,
} from "./derive";
import type { Close, Trade } from "./types";

export type EquityPoint = { time: string; equity: number };

/**
 * One point per close, in chronological order. Open trades add nothing (no unrealized P&L).
 * Does not include a "starting point": the page decides what time to give it.
 */
export function equityCurve(
  startingBalance: number,
  trades: Trade[],
  closes: Close[],
): EquityPoint[] {
  const tradeById = new Map(trades.map((t) => [t.id, t]));
  const sorted = [...closes].sort(
    (a, b) =>
      Date.parse(a.closedAt) - Date.parse(b.closedAt) ||
      Date.parse(a.createdAt) - Date.parse(b.createdAt),
  );

  let equity = startingBalance;
  const points: EquityPoint[] = [];
  for (const c of sorted) {
    const trade = tradeById.get(c.tradeId);
    if (!trade) continue; // orphan close: the FK should prevent it, so skip rather than crash
    equity += closePnl(trade, c);
    points.push({ time: c.closedAt, equity });
  }
  return points;
}

export type Stats = {
  totalPnl: number; // net of fees, includes partial closes
  totalFees: number; // fees attached to closes made so far
  closedTrades: number;
  wins: number;
  winRate: number | null; // 0..1, null when no closed trades
  avgR: number | null; // null when no closed trade has an R
};

export function computeStats(trades: Trade[], closes: Close[]): Stats {
  const byTrade = groupByTrade(closes);

  let totalPnl = 0;
  let totalFees = 0;
  let closedTrades = 0;
  let wins = 0;
  let rSum = 0;
  let rCount = 0;

  for (const t of trades) {
    const tc = byTrade.get(t.id) ?? [];
    if (tc.length === 0) continue;

    const pnl = realizedPnl(t, tc);
    totalPnl += pnl;
    for (const c of tc) totalFees += c.fees + (t.fees * c.percent) / 100;

    if (statusOf(tc) !== "closed") continue;
    closedTrades++;
    if (pnl > 0) wins++;
    const r = rMultiple(t, tc);
    if (r !== null) {
      rSum += r;
      rCount++;
    }
  }

  return {
    totalPnl,
    totalFees,
    closedTrades,
    wins,
    winRate: closedTrades > 0 ? wins / closedTrades : null,
    avgR: rCount > 0 ? rSum / rCount : null,
  };
}
