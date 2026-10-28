import React from "react";
import { redirect } from "next/navigation";

import Drawer from "@/components/dashboardComponents/drawer";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[var(--surface-1)] flex flex-col lg:flex-row">
      <Drawer />
      <div className="flex-1 min-w-0 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
