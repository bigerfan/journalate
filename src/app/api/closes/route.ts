import { NextResponse } from "next/server";
import { route } from "@/lib/http";
import { listCloses } from "@/features/trade/server/service";
import { authedRoute } from "@/lib/auth";

export const GET = authedRoute(async (user) =>
  NextResponse.json(await listCloses(user)),
);
