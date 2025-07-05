"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load your DashboardContent
const DashboardContent = dynamic(() => import("./DashboardContent"));

export default function ClientWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
