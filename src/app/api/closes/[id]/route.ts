import { authedRoute } from "@/lib/auth";
import { Ctx } from "../../trades/[id]/route";
import { IdSchema } from "@/features/trade/server/schema";
import { deleteClose } from "@/features/trade/server/service";
import { NextResponse } from "next/server";

export const DELETE = authedRoute(
  async (user, _req: Request, { params }: Ctx) => {
    const { id } = IdSchema.parse(await params);
    await deleteClose(user, id);
    return new NextResponse(null, { status: 204 });
  },
);
