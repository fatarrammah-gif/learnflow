import { MotionCard, CardContent } from "@/components/ui/card";
import { CriteriaTag } from "./CriteriaTag";
import { TimestampList } from "./TimestampList";
import { formatTime } from "@/lib/utils";
import { cardHover } from "@/lib/motion";
import { Youtube } from "lucide-react";
import type { YoutubeResource } from "@/types/resource";
import type { Criterion } from "@/types/criteria";

interface Props {
  resource: YoutubeResource;
  criteria: Criterion[];  // Needed to look up criterion labels by ID
}

// ResourceCard — shows one YouTube video with its thumbnail, title, scores, and timestamps
export function ResourceCard({ resource, criteria }: Props) {
  // Look up the display label for a criterion by its numeric ID
  const getLabel = (id: number) => criteria.find((c) => c.id === id)?.label ?? "Criterion";

  return (
    <MotionCard variant="elevated" className="hover:shadow-lg transition-shadow" {...cardHover}>
      <CardContent className="p-0">
        <div className="flex gap-3 p-3">
          {/* Video thumbnail — falls back to YouTube's default thumbnail URL */}
          <div className="shrink-0 relative">
            <img
              src={resource.thumbnail_url ?? `https://img.youtube.com/vi/${resource.video_id}/mqdefault.jpg`}
              alt={resource.title}
              className="w-28 h-16 object-cover rounded bg-muted"
            />
            {/* Duration overlay in the bottom-right corner of the thumbnail */}
            {resource.duration_seconds && (
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                {formatTime(resource.duration_seconds)}
              </div>
            )}
          </div>

          {/* Video title and channel name */}
          <div className="flex-1 min-w-0">
            <a
              href={resource.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sm hover:text-primary line-clamp-2 leading-tight"
            >
              {resource.title}
            </a>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Youtube size={10} />
              <span className="truncate">{resource.channel_name}</span>
            </div>
          </div>
        </div>

        {/* Row of colored criterion score tags */}
        {resource.scores.length > 0 && (
          <div className="px-3 pb-2 flex flex-wrap gap-1">
            {resource.scores.map((s) => (
              <CriteriaTag
                key={s.criterion_id}
                label={getLabel(s.criterion_id)}
                matchLevel={s.match_level}
                score={s.score}
                reasoning={s.reasoning}
              />
            ))}
          </div>
        )}

        {/* Clickable timestamp links */}
        {resource.timestamps.length > 0 && (
          <div className="px-3 pb-3 border-t pt-2">
            <TimestampList timestamps={resource.timestamps} videoId={resource.video_id} />
          </div>
        )}
      </CardContent>
    </MotionCard>
  );
}
