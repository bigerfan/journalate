import { NextResponse } from "next/server";
import { route } from "@/lib/http";
import { CreateTradeSchema } from "@/features/trade/server/schema";
import { createTrade, listTrades } from "@/features/trade/server/service";

export const GET = route(async () => NextResponse.json(await listTrades()));

export const POST = route(async (req: Request) => {
  const input = CreateTradeSchema.parse(await req.json());
  return NextResponse.json(await createTrade(input), { status: 201 });
});
