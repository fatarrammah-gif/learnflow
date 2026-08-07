import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn() merges Tailwind CSS class names and handles conflicts
// Example: cn("text-red-500", true && "font-bold") → "text-red-500 font-bold"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format seconds into MM:SS or HH:MM:SS (for video timestamps)
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Format minutes into "2h 30m" style
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
