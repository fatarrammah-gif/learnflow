// Generating overlay — five chapter-marker dots animate in sequence,
// referencing YouTube's chapter scrubber. Quieter than a spinner.
export function GeneratingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-6 max-w-xs">
        {/* Chapter-dot loader — staggered pulse */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-16 h-px bg-border" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-sm bg-primary"
              style={{
                animation: `chapter-pulse 1.4s ease-in-out ${i * 0.18}s infinite`,
              }}
            />
          ))}
          <div className="w-16 h-px bg-border" />
        </div>

        <div>
          <h3
            className="font-bold text-lg text-foreground"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Building your roadmap
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Gemini is mapping your goal into a learning path. This takes about 15 seconds.
          </p>
        </div>
      </div>

      {/* Keyframe injected inline — Tailwind doesn't have arbitrary keyframes */}
      <style>{`
        @keyframes chapter-pulse {
          0%, 60%, 100% { opacity: 0.2; transform: scaleY(1); }
          30% { opacity: 1; transform: scaleY(1.6); }
        }
      `}</style>
    </div>
  );
}
