import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/http";
import { toClose, toTrade } from "./mappers";
import type { CreateCloseInput, CreateTradeInput } from "./schema";
import { SessionUser } from "@/lib/auth";

export async function listTrades(user: SessionUser) {
  const rows = await prisma.trade.findMany({
    orderBy: { openedAt: "desc" },
    where: { userId: user.id },
  });
  return rows.map(toTrade);
}

export async function createTrade(user: SessionUser, input: CreateTradeInput) {
  const settings = await prisma.settings.findUnique({
    where: { userId: user.id },
  });
  if (!settings)
    throw new HttpError(409, "قبل از ثبت معامله، تنظیمات اولیه رو تکمیل کن.");
  if (input.riskPct > settings.maxRiskPct.toNumber()) {
    throw new HttpError(
      400,
      `ریسک معامله از حداکثر مجاز یعنی ${settings.maxRiskPct.toString()}٪ بیشتره.`,
    );
  }
  const riskAmount = input.size * Math.abs(input.entry - input.stop);
  const row = await prisma.trade.create({
    data: { ...input, riskAmount, userId: user.id },
  });
  return toTrade(row);
}

export async function deleteTrade(user: SessionUser, id: string) {
  const { count } = await prisma.trade.deleteMany({
    where: { id, userId: user.id },
  });
  if (count === 0) throw new HttpError(404, "معامله پیدا نشد.");
}

export async function listCloses(user: SessionUser) {
  const rows = await prisma.close.findMany({
    orderBy: { closedAt: "asc" },
    where: { userId: user.id },
  });
  return rows.map(toClose);
}

export async function createClose(
  user: SessionUser,
  tradeId: string,
  input: CreateCloseInput,
) {
  const row = await prisma.$transaction(async (tx) => {
    // Lock the trade row so two simultaneous closes can't both pass the 100% check.
    const locked = await tx.$queryRaw<{ opened_at: Date }[]>`
      SELECT opened_at FROM trades WHERE id = ${tradeId}::uuid FOR UPDATE`;
    if (!locked[0]) throw new HttpError(404, "معامله پیدا نشد.");
    if (input.closedAt < locked[0].opened_at)
      throw new HttpError(
        400,
        "تاریخ بستن معامله نمی‌تونه قبل از تاریخ باز شدنش باشه.",
      );

    const { _sum } = await tx.close.aggregate({
      where: { tradeId },
      _sum: { percent: true },
    });
    const used = _sum.percent?.toNumber() ?? 0;
    if (used + input.percent > 100 + 1e-6) {
      throw new HttpError(
        400,
        `فقط ${(100 - used).toFixed(2)}٪ از حجم این معامله هنوز بازه.`,
      );
    }
    return tx.close.create({ data: { ...input, tradeId, userId: user.id } });
  });
  return toClose(row);
}

export async function getTradeWithCloses(user: SessionUser, id: string) {
  const row = await prisma.trade.findFirst({
    where: { id, userId: user.id }, // the ownership filter, as in every other service
    include: {
      closes: { orderBy: [{ closedAt: "asc" }, { createdAt: "asc" }] },
    },
  });
  if (!row) throw new HttpError(404, "معامله پیدا نشد.");

  return {
    trade: toTrade(row),
    closes: row.closes.map(toClose),
  };
}
