import { NextResponse } from "next/server";
import { route } from "@/lib/http";
import { CreateCloseSchema, IdSchema } from "@/features/trade/server/schema";
import { createClose } from "@/features/trade/server/service";
import { authedRoute } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export const POST = authedRoute(async (user, req: Request, { params }: Ctx) => {
  const { id } = IdSchema.parse(await params);
  const input = CreateCloseSchema.parse(await req.json()); // any tradeId in the body is ignored; the URL decides
  return NextResponse.json(await createClose(user, id, input), { status: 201 });
});
