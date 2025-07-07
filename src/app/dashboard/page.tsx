import dynamic from "next/dynamic";

// Load client-only Dashboard dynamically
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  ssr: false,
});

export default function DashboardPage() {
  return <DashboardClient />;
}