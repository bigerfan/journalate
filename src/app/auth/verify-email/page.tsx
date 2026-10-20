import type { Metadata } from "next";
import { z } from "zod";

import VerifyEmailView from "@/features/auth/components/verify-email-view";

export const metadata: Metadata = {
  title: "تأیید ایمیل | Journalate",
  description:
    "ایمیلت رو تأیید کن تا بتونی از حساب کاربری Journalate استفاده کنی.",
  robots: {
    index: false,
    follow: false,
  },
};

const emailSchema = z.string().email();

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const { email } = await searchParams;
  // Anything that isn't a single valid email (missing, array, junk) is treated as "no email".
  const parsed = emailSchema.safeParse(email);

  return <VerifyEmailView email={parsed.success ? parsed.data : undefined} />;
}
