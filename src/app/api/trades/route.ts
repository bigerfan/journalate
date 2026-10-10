import { NextResponse } from "next/server";
import { route } from "@/lib/http";
import { CreateTradeSchema } from "@/features/trade/server/schema";
import { createTrade, listTrades } from "@/features/trade/server/service";
import { authedRoute } from "@/lib/auth";

export const GET = authedRoute(async (user) =>
  NextResponse.json(await listTrades(user)),
);

export const POST = authedRoute(async (user, req: Request) => {
  const input = CreateTradeSchema.parse(await req.json());
  return NextResponse.json(await createTrade(user, input), { status: 201 });
});
