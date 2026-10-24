import type { Metadata } from "next";
import ForgotPasswordView from "@/features/auth/components/forgot-password-view";

export const metadata: Metadata = {
  title: "بازیابی رمز عبور | Journalate",
  description:
    "برای بازیابی رمز عبور حساب کاربری Journalate، لینک تغییر رمز رو به ایمیلت ارسال کن.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
