import { motion } from "framer-motion";

// Generating overlay — five magenta chapter-marker dots animate in staggered pulses.
export function GeneratingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/85 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-6 max-w-xs">
        {/* Staggered chapter-dot loader */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-px bg-border" />
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-sm bg-primary"
              animate={{ opacity: [0.2, 1, 0.2], scaleY: [1, 1.7, 1] }}
              transition={{
                duration: 1.4,
                ease: "easeInOut",
                repeat: Infinity,
                delay: i * 0.18,
              }}
            />
          ))}
          <div className="w-12 h-px bg-border" />
        </div>

        <div>
          <h3 className="font-bold text-lg text-foreground font-display">
            Building your roadmap
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Gemini is mapping your goal into a learning path. About 15 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
