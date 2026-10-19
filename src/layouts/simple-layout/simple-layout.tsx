import type { ReactNode } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
// Plain elements on purpose: this layout is a server component and needs no styling system.
export default function SimpleLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
