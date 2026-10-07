import { NextResponse } from "next/server";
import { route } from "@/features/shared/server/http";
import { listCloses } from "@/features/trade/server/service";

export const GET = route(async () => NextResponse.json(await listCloses()));
