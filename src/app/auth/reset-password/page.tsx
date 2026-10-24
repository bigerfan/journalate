import type { Metadata } from "next";
import ResetPasswordView from "@/features/auth/components/reset-password-view";

export const metadata: Metadata = {
  title: "تغییر رمز عبور | Journalate",
  description: "رمز عبور جدیدی برای حساب کاربری Journalate انتخاب کن.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string | string[];
    error?: string | string[];
  }>;
}) {
  const { token, error } = await searchParams;
  // Better Auth redirects here with ?error=INVALID_TOKEN for bad or expired links.
  const valid = !error && typeof token === "string" && token.length > 0;

  return <ResetPasswordView token={valid ? token : undefined} />;
}
