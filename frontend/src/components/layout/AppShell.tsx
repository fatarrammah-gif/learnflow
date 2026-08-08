import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileSidebarDrawer } from "./MobileSidebarDrawer";
import { pageTransition } from "@/lib/motion";

// AppShell wraps every page: header on top, sidebar on the left (a slide-in
// drawer on mobile, persistent on desktop), page content on the right.
// <Outlet /> is where React Router renders the current page component.
export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header onMenuClick={() => setDrawerOpen((open) => !open)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Persistent sidebar — desktop/tablet only */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Slide-in drawer — mobile only */}
        <MobileSidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Sidebar />
        </MobileSidebarDrawer>

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
