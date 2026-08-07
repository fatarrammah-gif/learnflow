import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

// AppShell wraps every page: sidebar on left, page content on right
// <Outlet /> is where React Router renders the current page component
export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
