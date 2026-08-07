import { cn } from "@/lib/utils";

interface Props {
  total: number;    // How many steps total
  current: number;  // Which step we're on (1-indexed)
  labels: string[]; // Label shown under each circle
}

// Shows a row of numbered circles connected by lines
// Past steps show a checkmark, current step has a ring highlight
export function StepIndicator({ total, current, labels }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              {/* Circle: green checkmark if done, highlighted if active, grey if future */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                done && "bg-primary text-primary-foreground",
                active && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                !done && !active && "bg-muted text-muted-foreground"
              )}>
                {done ? "✓" : step}
              </div>
              <span className="text-xs text-muted-foreground">{labels[i]}</span>
            </div>
            {/* Connector line between steps */}
            {step < total && (
              <div className={cn("w-10 h-0.5 mx-2 mb-5", done ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
