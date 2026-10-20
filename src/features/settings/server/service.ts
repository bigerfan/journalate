import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/http";
import type { Settings } from "../schema";
import { toSettings } from "./mappers";
import type { UpsertSettingsInput } from "./schema";
import { SessionUser } from "@/lib/auth";
import { NextResponse } from "next/server";

/** The settings row, or null before onboarding is finished. */
export async function getSettings(user: SessionUser): Promise<Settings | null> {
  const row = await prisma.settings.findUnique({ where: { userId: user.id } });
  if (!row) NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/onboarding`);
  return row ? toSettings(row) : null;
}

/** Creates the row on first save (onboarding), updates it afterwards. */
export async function saveSettings(
  user: SessionUser,
  input: UpsertSettingsInput,
): Promise<Settings> {
  const existing = await prisma.settings.findUnique({
    where: { userId: user.id },
  });

  // Amounts are stored without a currency, so changing it later would silently relabel old trades.
  if (
    existing &&
    existing.currency !== input.currency &&
    (await prisma.trade.count()) > 0
  ) {
    throw new HttpError(
      409,
      "بعد از ثبت معامله، امکان تغییر واحد پول وجود ندارد.",
    );
  }

  const row = await prisma.settings.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...input },
    update: input,
  });
  return toSettings(row);
}
