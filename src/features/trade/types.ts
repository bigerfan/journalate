import { z } from "zod";

export type Side = "long" | "short";

// ---------- Trade (what we store) ----------
export type Trade = {
  id: string;
  pair: string;
  side: Side;
  entry: number;
  stop: number;
  target?: number;
  size: number; // units of the asset
  riskPct: number; // planned risk % of equity at open
  riskAmount: number; // size * |entry - stop|, stored so R-multiples never drift
  fees: number;
  strategy?: string;
  timeframe?: string;
  notes?: string;
  openedAt: string; // ISO
  createdAt: string;
  updatedAt: string;
};
export type NewTrade = Omit<Trade, "id" | "createdAt" | "updatedAt">;
