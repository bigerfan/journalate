import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/http";
import { toClose, toTrade } from "./mappers";
import type { CreateCloseInput, CreateTradeInput } from "./schema";

export async function listTrades() {
  const rows = await prisma.trade.findMany({ orderBy: { openedAt: "desc" } });
  return rows.map(toTrade);
}

export async function createTrade(input: CreateTradeInput) {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!settings)
    throw new HttpError(409, "Finish onboarding before logging trades.");
  if (input.riskPct > settings.maxRiskPct.toNumber()) {
    throw new HttpError(
      400,
      `Risk exceeds your max of ${settings.maxRiskPct.toString()}%.`,
    );
  }
  const riskAmount = input.size * Math.abs(input.entry - input.stop);
  const row = await prisma.trade.create({ data: { ...input, riskAmount } });
  return toTrade(row);
}

export async function deleteTrade(id: string) {
  const { count } = await prisma.trade.deleteMany({ where: { id } });
  if (count === 0) throw new HttpError(404, "Trade not found.");
}

export async function listCloses() {
  const rows = await prisma.close.findMany({ orderBy: { closedAt: "asc" } });
  return rows.map(toClose);
}

export async function createClose(tradeId: string, input: CreateCloseInput) {
  const row = await prisma.$transaction(async (tx) => {
    // Lock the trade row so two simultaneous closes can't both pass the 100% check.
    const locked = await tx.$queryRaw<{ opened_at: Date }[]>`
      SELECT opened_at FROM trades WHERE id = ${tradeId}::uuid FOR UPDATE`;
    if (!locked[0]) throw new HttpError(404, "Trade not found.");
    if (input.closedAt < locked[0].opened_at)
      throw new HttpError(400, "Cannot close before the trade was opened.");

    const { _sum } = await tx.close.aggregate({
      where: { tradeId },
      _sum: { percent: true },
    });
    const used = _sum.percent?.toNumber() ?? 0;
    if (used + input.percent > 100 + 1e-6) {
      throw new HttpError(
        400,
        `Only ${(100 - used).toFixed(2)}% of this position is still open.`,
      );
    }
    return tx.close.create({ data: { ...input, tradeId } });
  });
  return toClose(row);
}
