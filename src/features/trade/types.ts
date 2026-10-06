export type Side = "long" | "short";

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
  imageUrl?: string;
  strategy?: string;
  timeframe?: string;
  notes?: string;
  openedAt: string; // ISO
  createdAt: string;
  updatedAt: string;
};

export type NewTrade = Omit<Trade, "id" | "createdAt" | "updatedAt">;

export type CloseReason = "stop" | "target" | "manual";

// One exit (full or partial). A trade's status, remaining size and P&L are derived from its closes.
export type Close = {
  id: string;
  tradeId: string;
  percent: number; // % of the ORIGINAL position closed by this exit
  price: number;
  reason: CloseReason;
  fees: number;
  mistake?: string;
  note?: string;
  closedAt: string; // ISO
  createdAt: string;
};

export type NewClose = Omit<Close, "id" | "createdAt">;
