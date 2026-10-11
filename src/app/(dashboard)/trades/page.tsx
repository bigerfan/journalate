import DashboardView from "@/features/dashboard/components/dashboard-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  console.log(session);
  return <DashboardView />;
}
