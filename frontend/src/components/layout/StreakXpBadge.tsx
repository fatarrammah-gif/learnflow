import { Flame, Zap } from "lucide-react";

interface Props {
  streak: number;
  xp: number;
  className?: string;
}

// StreakXpBadge — compact streak/XP pill pair, shown in the Header and
// reused on the Progress dashboard so the numbers only live in one place.
export function StreakXpBadge({ streak, xp, className }: Props) {
  return (
    <div className={`flex gap-2 shrink-0 ${className ?? ""}`}>
      <div className="flex items-center gap-1.5 bg-primary-soft border border-primary/20 rounded-xl px-3 py-1.5">
        <Flame size={15} className="text-primary" />
        <div>
          <div className="text-[10px] text-primary-soft-foreground font-semibold leading-none">Streak</div>
          <div className="text-sm font-bold text-primary-soft-foreground leading-tight font-mono">{streak}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-primary-soft border border-primary/20 rounded-xl px-3 py-1.5">
        <Zap size={15} className="text-primary" />
        <div>
          <div className="text-[10px] text-primary-soft-foreground font-semibold leading-none">XP</div>
          <div className="text-sm font-bold text-primary-soft-foreground leading-tight font-mono">{xp}</div>
        </div>
      </div>
    </div>
  );
}
