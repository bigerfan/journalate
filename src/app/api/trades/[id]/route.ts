import { NextResponse } from "next/server";
import { route } from "@/lib/http";
import { IdSchema } from "@/features/trade/server/schema";
import { deleteTrade } from "@/features/trade/server/service";
import { authedRoute } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> }; // params is a Promise in Next 15+

export const DELETE = authedRoute(
  async (user, _req: Request, { params }: Ctx) => {
    const { id } = IdSchema.parse(await params);
    await deleteTrade(user, id);
    return new NextResponse(null, { status: 204 });
  },
);
