import type { Variants } from "framer-motion";

// Shared animation variants — keep motion consistent across the app instead
// of hand-rolling a new keyframe/transition per component.

// Single element fading/sliding in — cards, section headers, one-off reveals.
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// Parent wrapper for a list — pair with fadeInUp on each child to get a
// staggered reveal (dashboard tiles, resource cards, roadmap step lists).
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

// Hover/tap micro-interaction for cards and buttons — a small lift + scale.
export const cardHover = {
  whileHover: { y: -2, scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15, ease: "easeOut" as const },
};

// Route-level fade/slide, used with AnimatePresence around <Outlet />.
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } },
};
