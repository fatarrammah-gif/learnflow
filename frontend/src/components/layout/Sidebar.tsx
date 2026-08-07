import { NavLink } from "react-router-dom";
import { Map, BookOpen, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

// Each nav item has a route path, an icon, and a label
const navItems = [
  { to: "/", icon: BookOpen, label: "New Goal" },
  { to: "/roadmap", icon: Map, label: "Roadmap" },
  { to: "/progress", icon: TrendingUp, label: "Progress" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <div className="w-52 border-r bg-card h-full flex flex-col shrink-0">
      {/* App name / logo area */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <BookOpen size={14} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">LearnFlow</span>
        </div>
      </div>

      {/* Navigation links — NavLink automatically adds "active" class when route matches */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
