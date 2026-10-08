import { api } from "@/lib/api";
import type { Settings } from "./schema";

// Same method names as the localStorage version, so OnboardingForm and the pages don't change.
export const settingsRepo = {
  get: () => api<Settings | null>("/api/settings"), // null until onboarding is done
  save: (settings: Settings) =>
    api<Settings>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
};
