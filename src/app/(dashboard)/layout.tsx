import { DashboardLayout } from "@/layouts/dashboard-layout/dashboard-layout";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
