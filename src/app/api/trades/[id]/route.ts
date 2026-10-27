import { NextResponse } from "next/server";
import { route } from "@/lib/http";
import { CreateTradeSchema, IdSchema } from "@/features/trade/server/schema";
import { deleteTrade, updateTrade } from "@/features/trade/server/service";
import { authedRoute } from "@/lib/auth";
import { Trade } from "@/features/trade/types";

export type Ctx = { params: Promise<{ id: string }> };

export const DELETE = authedRoute(
  async (user, _req: Request, { params }: Ctx) => {
    const { id } = IdSchema.parse(await params);
    await deleteTrade(user, id);
    return new NextResponse(null, { status: 204 });
  },
);

export const PUT = authedRoute(async (user, req: Request, { params }: Ctx) => {
  const { id } = IdSchema.parse(await params);
  const input = CreateTradeSchema.parse(await req.json());

  await updateTrade(user, id, input);
  return new NextResponse(null, { status: 204 });
});
