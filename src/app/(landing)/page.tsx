import type { Metadata } from "next";

import LandingView from "@/features/landing/components/landing-view";

export const metadata: Metadata = {
  title: "Journalate: a trading journal built around risk",
  description:
    "Log trades, partial closes and mistakes. Track R-multiples and equity.",
};

export default function LandingPage() {
  return <LandingView />;
}
