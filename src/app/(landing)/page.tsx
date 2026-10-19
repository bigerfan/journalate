import type { Metadata } from "next";

import LandingView from "@/features/landing/components/landing-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Journalate: a trading journal built around risk",
  description:
    "Log trades, partial closes and mistakes. Track R-multiples and equity.",
};

export default async function LandingPage() {
  const user = (await auth.api.getSession({ headers: await headers() }))?.user;
  return <LandingView user={user} />;
}
