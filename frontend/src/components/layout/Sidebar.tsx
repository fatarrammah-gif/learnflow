import { NavLink } from "react-router-dom";
import { BookOpen, Map, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

// DataCamp-style: two labelled sections grouping related nav items
const sections = [
  {
    label: "LEARN",
    items: [
      { to: "/", icon: BookOpen, label: "New Goal" },
      { to: "/roadmap", icon: Map, label: "Roadmap" },
    ],
  },
  {
    label: "TRACK",
    items: [
      { to: "/progress", icon: TrendingUp, label: "Progress" },
      { to: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export function Sidebar() {
  return (
    <div
      className="w-52 h-full flex flex-col shrink-0"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Wordmark — coral lettermark + Plus Jakarta Sans name */}
      <div
        className="px-4 py-5 flex items-center gap-2.5"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        {/* Coral "LF" — three horizontal bars (film-strip mark, now in coral on navy) */}
        <div className="w-6 flex flex-col gap-[3px] shrink-0">
          <div className="h-[3px] w-full rounded-full bg-primary" />
          <div className="h-[3px] w-3/4 rounded-full bg-primary" />
          <div className="h-[3px] w-full rounded-full bg-primary" />
        </div>
        <span
          className="text-[15px] font-bold tracking-tight"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: "var(--sidebar-fg)",
          }}
        >
          LearnFlow
        </span>
      </div>

      {/* Sectioned navigation */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label}>
            {/* Section label — uppercase muted eyebrow */}
            <p
              className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1"
              style={{ color: "var(--sidebar-muted)" }}
            >
              {section.label}
            </p>

            <div className="space-y-0.5">
              {section.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className="block"
                >
                  {({ isActive }) => (
                    <div
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors cursor-pointer"
                      )}
                      style={{
                        color: isActive ? "#fff" : "var(--sidebar-fg)",
                        background: isActive ? "var(--sidebar-active)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background =
                            "var(--sidebar-hover)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      {/* Coral left-edge active indicator */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                        />
                      )}
                      <Icon
                        size={14}
                        style={{ color: isActive ? "hsl(var(--primary))" : "var(--sidebar-muted)" }}
                      />
                      {label}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer version label */}
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid var(--sidebar-border)" }}
      >
        <span
          className="text-[11px] font-mono"
          style={{ color: "var(--sidebar-muted)" }}
        >
          v0.1.0
        </span>
      </div>
    </div>
  );
}
