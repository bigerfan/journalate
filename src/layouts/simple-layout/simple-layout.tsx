import type { ReactNode } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import { auth, getUserSession } from "@/lib/auth";
import { headers } from "next/headers";
// Plain elements on purpose: this layout is a server component and needs no styling system.
export default async function SimpleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = (await auth.api.getSession({ headers: await headers() }))?.user;
  return (
    <div
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}
    >
      <Header user={user} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
