import { NextResponse } from "next/server";
import { route } from "@/features/shared/server/http";
import { UpsertSettingsSchema } from "@/features/settings/server/schema";
import { getSettings, saveSettings } from "@/features/settings/server/service";

// Returns the settings, or the JSON value null before onboarding is finished.
export const GET = route(async () => NextResponse.json(await getSettings()));

// Creates the row on the first save (onboarding) and updates it afterwards.
export const PUT = route(async (req: Request) => {
  const input = UpsertSettingsSchema.parse(await req.json());
  return NextResponse.json(await saveSettings(input));
});
