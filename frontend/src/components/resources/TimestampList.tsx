import { formatTime } from "@/lib/utils";
import { ExternalLink, Clock } from "lucide-react";
import type { VideoTimestamp } from "@/types/resource";

interface Props {
  timestamps: VideoTimestamp[];
  videoId: string;  // YouTube video ID (the part after ?v= in the URL)
}

// Shows clickable timestamp links that jump to a specific point in the YouTube video
// The &t= parameter in YouTube URLs sets the start time in seconds
export function TimestampList({ timestamps, videoId }: Props) {
  if (!timestamps.length) return null;

  return (
    <div className="mt-2">
      <div className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
        <Clock size={11} /> Key sections
      </div>
      <div className="space-y-1">
        {timestamps.map((ts, i) => (
          <a
            key={i}
            href={`https://www.youtube.com/watch?v=${videoId}&t=${ts.start_seconds}s`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs hover:text-primary group"
          >
            {/* formatTime() converts raw seconds to "MM:SS" */}
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-primary">
              {formatTime(ts.start_seconds)}
            </span>
            <span className="flex-1 truncate">{ts.label}</span>
            {/* External link icon appears on hover */}
            <ExternalLink size={10} className="opacity-0 group-hover:opacity-100" />
          </a>
        ))}
      </div>
    </div>
  );
}
