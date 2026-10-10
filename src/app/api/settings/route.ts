import { NextResponse } from "next/server";
import { route } from "@/lib/http";
import { UpsertSettingsSchema } from "@/features/settings/server/schema";
import { getSettings, saveSettings } from "@/features/settings/server/service";
import { authedRoute } from "@/lib/auth";

// Returns the settings, or the JSON value null before onboarding is finished.
export const GET = authedRoute(async (user) =>
  NextResponse.json(await getSettings(user)),
);

// Creates the row on the first save (onboarding) and updates it afterwards.
export const PUT = authedRoute(async (user, req: Request) => {
  const input = UpsertSettingsSchema.parse(await req.json());
  return NextResponse.json(await saveSettings(user, input));
});
