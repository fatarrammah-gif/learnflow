import { useState } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CriteriaItem } from "./CriteriaItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import type { LocalCriterion } from "@/store/goalStore";

interface Props {
  criteria: LocalCriterion[];
  onChange: (criteria: LocalCriterion[]) => void;
}

// CriteriaList — a drag-and-drop sortable list of scoring criteria
// DndContext wraps the whole list and fires onDragEnd when the user drops an item
export function CriteriaList({ criteria, onChange }: Props) {
  const [newLabel, setNewLabel] = useState("");

  // Set up both mouse/touch (PointerSensor) and keyboard (KeyboardSensor) drag support
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Called when the user finishes dragging — reorder the array to match the new position
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = criteria.findIndex((c) => c.id === active.id);
      const newIdx = criteria.findIndex((c) => c.id === over.id);
      // arrayMove() returns a new array with the item moved from oldIdx to newIdx
      onChange(arrayMove(criteria, oldIdx, newIdx));
    }
  };

  const addCriterion = () => {
    const label = newLabel.trim();
    if (!label) return;
    // Use Date.now() as a unique ID for newly added criteria
    onChange([...criteria, { id: `custom-${Date.now()}`, label, description: "" }]);
    setNewLabel("");
  };

  return (
    <div className="space-y-3">
      {/* DndContext provides drag-and-drop functionality to all children */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        {/* SortableContext tracks item positions and tells each item where it is */}
        <SortableContext items={criteria.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {criteria.map((c) => (
              <CriteriaItem
                key={c.id}
                id={c.id}
                label={c.label}
                description={c.description}
                onDelete={() => onChange(criteria.filter((x) => x.id !== c.id))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Input to add a new criterion — press Enter or click the + button */}
      <div className="flex gap-2 pt-2">
        <Input
          placeholder="Add your own criterion..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCriterion()}
        />
        <Button variant="outline" size="icon" onClick={addCriterion}>
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
}
