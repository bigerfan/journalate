import { KEYS, read, write } from "../shared/local-storage";
import { NewTrade, Trade } from "./types";

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
};
