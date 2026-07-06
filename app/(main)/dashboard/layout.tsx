import React from "react";
import Drawer from "@/components/dashboardComponents/drawer";

export default function dashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Drawer />
      {/* Offset content by sidebar width */}
      <div
        className="min-h-screen bg-[var(--surface-1)]"
        style={{ paddingLeft: "var(--sidebar-width, 240px)" }}
      >
        <div className="p-6 max-w-[1200px] mx-auto w-full">
          {children}
        </div>
      </div>
    </>
  );
}