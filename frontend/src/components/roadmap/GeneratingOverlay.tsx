// Full-screen overlay shown while the AI is generating the roadmap
// The spinning circle is created with Tailwind's animate-spin utility
export function GeneratingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        {/* Spinner: a circle with a gap at the top that rotates */}
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <div>
          <h3 className="font-semibold text-lg">Building your roadmap...</h3>
          <p className="text-sm text-muted-foreground mt-1">
            AI is analyzing your goal and designing your personalized learning path
          </p>
        </div>
      </div>
    </div>
  );
}
