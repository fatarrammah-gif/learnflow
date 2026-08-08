interface Props {
  total: number;
  current: number;
  labels: string[];
}

// Chapter-dot step indicator — references YouTube's chapter marker scrubber.
// A single track with amber fill, small square dots at each chapter boundary.
export function StepIndicator({ total, current, labels }: Props) {
  // How far the amber fill should extend (0–100%)
  const fillPct = ((current - 1) / (total - 1)) * 100;

  return (
    <div className="mb-8">
      {/* The scrubber track */}
      <div className="relative h-1 bg-muted rounded-full mx-3 mb-3">
        {/* Amber fill */}
        <div
          className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${fillPct}%` }}
        />
        {/* Chapter dots at each step position */}
        {Array.from({ length: total }, (_, i) => {
          const pct = (i / (total - 1)) * 100;
          const done = i + 1 < current;
          const active = i + 1 === current;
          return (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
              style={{ left: `${pct}%` }}
            >
              <div
                className={[
                  "rounded-sm transition-all duration-300",
                  done
                    ? "w-2 h-2 bg-primary"
                    : active
                    ? "w-3 h-3 bg-primary shadow-[0_0_8px_2px_hsl(340_82%_52%/0.5)]"
                    : "w-2 h-2 bg-muted-foreground/40",
                ].join(" ")}
              />
            </div>
          );
        })}
      </div>

      {/* Labels below the track */}
      <div className="flex justify-between px-1">
        {labels.map((label, i) => {
          const done = i + 1 < current;
          const active = i + 1 === current;
          return (
            <span
              key={label}
              className={[
                "text-xs transition-colors font-display",
                active
                  ? "text-primary font-semibold"
                  : done
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50",
              ].join(" ")}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
