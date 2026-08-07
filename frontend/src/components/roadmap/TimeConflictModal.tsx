import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TimeStrategy } from "@/types/roadmap";

// The three strategies the user can pick when there's a time conflict
const OPTIONS = [
  {
    strategy: "focus" as TimeStrategy,
    title: "Focus on Essentials",
    description: "Stay within your time budget — cover only the most critical skills.",
  },
  {
    strategy: "extend" as TimeStrategy,
    title: "Take More Time",
    description: "Cover everything, but extend your timeline to fit the full content.",
  },
  {
    strategy: "compromise" as TimeStrategy,
    title: "Balanced Approach",
    description: "Slight time extension with priority given to the most important topics.",
  },
];

interface Props {
  overflowHours?: number;       // How many extra hours the roadmap needs
  onResolve: (strategy: TimeStrategy) => void;  // Called when user confirms their choice
}

export function TimeConflictModal({ overflowHours, onResolve }: Props) {
  const [selected, setSelected] = useState<TimeStrategy | null>(null);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border">
        <div>
          <h2 className="text-xl font-semibold">Time Constraint Detected</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {overflowHours
              ? `The full roadmap needs ~${Math.round(overflowHours)} more hours than your budget.`
              : "The roadmap requires more time than your budget."}
            {" "}How would you like to proceed?
          </p>
        </div>

        {/* Strategy selection cards — clicking one sets it as selected */}
        <div className="space-y-2">
          {OPTIONS.map((opt) => (
            <Card
              key={opt.strategy}
              className={cn(
                "cursor-pointer transition-all hover:border-primary",
                selected === opt.strategy && "border-primary bg-primary/5"
              )}
              onClick={() => setSelected(opt.strategy)}
            >
              <CardContent className="p-4">
                <div className="font-medium">{opt.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{opt.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Button is disabled until user picks a strategy */}
        <Button className="w-full" disabled={!selected} onClick={() => selected && onResolve(selected)}>
          Generate Roadmap
        </Button>
      </div>
    </div>
  );
}
