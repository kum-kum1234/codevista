import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBanner from "./TopBanner";
import SpecialOfferBar from "./SpecialOfferBar";

/**
 * Wraps a page's content with the shared TopBanner, fixed Sidebar, and
 * SpecialOfferBar. Only the `children` (the page-specific content) scrolls;
 * the sidebar and banners stay in place.
 *
 * Usage:
 *   <AppLayout active="achievements">
 *     ...page content...
 *   </AppLayout>
 */
export default function AppLayout({ active, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-full bg-slate-50 text-sm flex flex-col overflow-hidden">
      <TopBanner />

      <div className="flex flex-1 min-h-0">
        <Sidebar active={active} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 min-w-0 h-full overflow-y-auto flex flex-col">
          <SpecialOfferBar />
          <div className="flex-1 min-h-0 flex flex-col">{children}</div>
        </main>
      </div>
    </div>
  );
}