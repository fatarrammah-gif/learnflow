import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const cardVariants = cva("border bg-card text-card-foreground", {
  variants: {
    variant: {
      // Plain flat container — settings boxes, onboarding summary, etc.
      default: "rounded-lg shadow-sm",
      // "Window chrome" treatment for prominent visual cards (resource
      // videos, roadmap/dashboard highlights) — bigger radius, stronger
      // shadow, thin magenta top accent bar.
      elevated: "relative rounded-xl shadow-md overflow-hidden before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-primary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

// Card — a rounded box with a subtle border and shadow
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  )
);
Card.displayName = "Card";

// MotionCard — Card with framer-motion's props (whileHover/whileTap/variants)
// available, for the handful of cards that get a hover-lift micro-interaction.
export const MotionCard = motion(Card);

// CardHeader — top section of the card (usually contains title + description)
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

// CardTitle — the main heading inside a card
export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

// CardDescription — small muted text below the title
export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

// CardContent — the main body area of the card
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";
