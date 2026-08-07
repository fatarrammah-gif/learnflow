import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  id: string;          // Unique ID used by dnd-kit to track this item
  label: string;
  description: string;
  onDelete: () => void;
}

// A single draggable criterion row
// useSortable() gives us the drag handle props and position transform styles
export function CriteriaItem({ id, label, description, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      // CSS.Transform.toString() converts the drag offset into a CSS transform string
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card",
        isDragging && "opacity-50 shadow-lg z-50"  // Visual feedback while dragging
      )}
    >
      {/* Drag handle — the gripVertical icon you click and drag */}
      <button
        className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing touch-none"
        {...attributes}   // Accessibility attributes (aria-*)
        {...listeners}    // Mouse/touch event listeners for dragging
      >
        <GripVertical size={16} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{label}</div>
        {description && <div className="text-xs text-muted-foreground truncate">{description}</div>}
      </div>

      <button onClick={onDelete} className="text-muted-foreground hover:text-destructive transition-colors">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
