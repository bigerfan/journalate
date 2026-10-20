import type { Metadata } from "next";

import LandingView from "@/features/landing/components/landing-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Journalate | دفتر ثبت معاملات و مدیریت ریسک",
  description:
    "معاملاتت رو ثبت کن، بستن‌های جزئی و اشتباهاتت رو بررسی کن و عملکردت رو با نسبت R و نمودار رشد سرمایه بسنج.",
  openGraph: {
    title: "Journalate | دفتر ثبت معاملات و مدیریت ریسک",
    description:
      "معاملاتت رو ثبت کن، ریسک رو مدیریت کن و عملکرد معاملاتی‌ات رو دقیق‌تر بررسی کن.",
    type: "website",
    siteName: "Journalate",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Journalate | دفتر ثبت معاملات و مدیریت ریسک",
    description:
      "معاملاتت رو ثبت کن، ریسک رو مدیریت کن و عملکرد معاملاتی‌ات رو دقیق‌تر بررسی کن.",
  },
};

function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Journalate",
    url: "https://journalateapp.com",
    description:
      "دفتر ثبت معاملات برای بررسی عملکرد، مدیریت ریسک و تحلیل نتایج معاملات.",
    inLanguage: "fa-IR",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Journalate",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "دفتر ثبت معاملات برای مدیریت ریسک، ثبت بستن‌های جزئی و بررسی عملکرد معاملاتی با نسبت R و نمودار رشد سرمایه.",
      url: "https://journalateapp.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function LandingPage() {
  const user = (await auth.api.getSession({ headers: await headers() }))?.user;

  return (
    <>
      <JsonLd />
      <LandingView user={user} />
    </>
  );
}
