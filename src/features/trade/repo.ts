import { Settings } from "../settings/types";
import { KEYS, read, write } from "../shared/local-storage";
import { groupByTrade, realizedPnl } from "./derive";
import { Close, NewClose, NewTrade, Trade } from "./types";

const CLOSES_KEY = "tj:closes";

// Every method is async so swapping in an API-backed repo later changes nothing in the UI.
export const closeRepo = {
  async list(): Promise<Close[]> {
    return read<Close[]>(CLOSES_KEY) ?? [];
  },
  async create(input: NewClose): Promise<Close> {
    const all = await this.list();
    const used = all
      .filter((c) => c.tradeId === input.tradeId)
      .reduce((s, c) => s + c.percent, 0);
    if (used + input.percent > 100 + 1e-6)
      throw new Error("This would close more than 100% of the position.");
    const close: Close = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    write(CLOSES_KEY, [...all, close]);
    return close;
  },
  async remove(id: string): Promise<void> {
    write(
      CLOSES_KEY,
      (await this.list()).filter((c) => c.id !== id),
    );
  },
  async removeByTrade(tradeId: string): Promise<void> {
    write(
      CLOSES_KEY,
      (await this.list()).filter((c) => c.tradeId !== tradeId),
    );
  },
};

export const tradeRepo = {
  async list(): Promise<Trade[]> {
    return read<Trade[]>(KEYS.trades) ?? [];
  },
  async create(input: NewTrade): Promise<Trade> {
    const now = new Date().toISOString();
    const trade: Trade = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    write(KEYS.trades, [trade, ...(await this.list())]);
    return trade;
  },
  async remove(id: string): Promise<void> {
    write(
      KEYS.trades,
      (await this.list()).filter((t) => t.id !== id),
    );
  },
};

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
