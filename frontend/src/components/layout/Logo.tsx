interface Props {
  // "dark" = on the navy sidebar (light text), "light" = on the cream header (dark text)
  variant?: "dark" | "light";
}

// LearnFlow wordmark — magenta film-strip mark + name, reused in both the Header and Sidebar
export function Logo({ variant = "dark" }: Props) {
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div className="w-6 flex flex-col gap-[3px] shrink-0">
        <div className="h-[3px] w-full rounded-full bg-primary" />
        <div className="h-[3px] w-3/4 rounded-full bg-primary" />
        <div className="h-[3px] w-full rounded-full bg-primary" />
      </div>
      <span
        className="text-[15px] font-bold tracking-tight font-display"
        style={{ color: variant === "dark" ? "var(--sidebar-fg)" : "hsl(var(--foreground))" }}
      >
        LearnFlow
      </span>
    </div>
  );
}
