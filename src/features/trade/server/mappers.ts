import type {
  Close as DbClose,
  Trade as DbTrade,
} from "@/generated/prisma/client";
import type { Close, Trade } from "../types";

// Prisma returns Decimal objects and Date objects; the UI and derive.ts use numbers and ISO strings.
export const toTrade = (t: DbTrade): Trade => ({
  id: t.id,
  pair: t.pair,
  side: t.side,
  entry: t.entry.toNumber(),
  stop: t.stop.toNumber(),
  target: t.target?.toNumber(),
  size: t.size.toNumber(),
  riskPct: t.riskPct.toNumber(),
  riskAmount: t.riskAmount.toNumber(),
  fees: t.fees.toNumber(),
  strategy: t.strategy ?? undefined,
  timeframe: t.timeframe ?? undefined,
  notes: t.notes ?? undefined,
  imageUrl: t.imageUrl ?? undefined,
  openedAt: t.openedAt.toISOString(),
  createdAt: t.createdAt.toISOString(),
  updatedAt: t.updatedAt.toISOString(),
});

export const toClose = (c: DbClose): Close => ({
  id: c.id,
  tradeId: c.tradeId,
  percent: c.percent.toNumber(),
  price: c.price.toNumber(),
  reason: c.reason,
  fees: c.fees.toNumber(),
  mistake: c.mistake ?? undefined,
  note: c.note ?? undefined,
  imageUrl: c.imageUrl ?? undefined,
  closedAt: c.closedAt.toISOString(),
  createdAt: c.createdAt.toISOString(),
});
