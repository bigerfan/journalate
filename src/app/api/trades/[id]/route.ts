import { NextResponse } from "next/server";
import { route } from "@/lib/http";
import { IdSchema } from "@/features/trade/server/schema";
import { deleteTrade } from "@/features/trade/server/service";

type Ctx = { params: Promise<{ id: string }> }; // params is a Promise in Next 15+

export const DELETE = route(async (_req: Request, { params }: Ctx) => {
  const { id } = IdSchema.parse(await params);
  await deleteTrade(id);
  return new NextResponse(null, { status: 204 });
});
