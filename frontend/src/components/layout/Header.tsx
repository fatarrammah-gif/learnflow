import { Menu, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { StreakXpBadge } from "./StreakXpBadge";

interface Props {
  onMenuClick: () => void;
}

// Header — full-width top bar shared by every page.
// Owns the wordmark (Sidebar no longer renders its own), the mobile menu
// trigger (hidden on desktop, where the Sidebar is always visible), and
// the settings shortcut.
export function Header({ onMenuClick }: Props) {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-4 md:px-6 bg-card border-b border-border">
      <button
        type="button"
        className="md:hidden -ml-1 p-2 rounded-md text-foreground hover:bg-muted transition-colors"
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
      >
        <Menu size={20} />
      </button>

      <Logo variant="light" />

      <div className="flex-1" />

      <StreakXpBadge streak={3} xp={50} className="hidden sm:flex" />

      <Link
        to="/settings"
        className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Settings"
      >
        <Settings size={18} />
      </Link>
    </header>
  );
}
