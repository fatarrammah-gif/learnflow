import { NavLink } from "react-router-dom";
import { Map, BookOpen, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: BookOpen, label: "New Goal" },
  { to: "/roadmap", icon: Map, label: "Roadmap" },
  { to: "/progress", icon: TrendingUp, label: "Progress" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <div className="w-52 h-full flex flex-col shrink-0 border-r border-border bg-card">
      {/* Wordmark — amber letterform + product name in Syne */}
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          {/* LF monogram — two stacked amber bars, referencing a film strip */}
          <div className="w-7 h-7 flex flex-col justify-center items-center gap-0.5 shrink-0">
            <div className="w-full h-[3px] rounded-full bg-primary" />
            <div className="w-3/4 h-[3px] rounded-full bg-primary self-start" />
            <div className="w-full h-[3px] rounded-full bg-primary" />
          </div>
          <span
            className="text-[15px] font-bold text-foreground tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            LearnFlow
          </span>
        </div>
      </div>

      {/* Nav — active item gets amber left border, not a filled background */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Amber left-edge indicator on active item */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary" />
                )}
                <Icon size={15} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer — subtle version label */}
      <div className="px-4 py-3 border-t border-border">
        <span className="text-xs text-muted-foreground font-mono">v0.1.0</span>
      </div>
    </div>
  );
}
