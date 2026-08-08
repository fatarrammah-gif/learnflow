import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

// MobileSidebarDrawer — wraps the Sidebar for small screens, sliding it in
// as an overlay. Reuses the same backdrop + fixed-panel idiom already used
// by ResourcePanel, so this doesn't introduce a second drawer pattern.
export function MobileSidebarDrawer({ open, onClose, children }: Props) {
  const location = useLocation();

  // Auto-close whenever the route changes (e.g. after tapping a nav link)
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 md:hidden transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {children}
      </div>
    </>
  );
}
