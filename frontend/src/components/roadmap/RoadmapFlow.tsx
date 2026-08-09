import { useState } from "react";
import {
  ReactFlow, MiniMap, Controls, Background, BackgroundVariant,
  useNodesState,
  type Node, type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";   // Required: React Flow's built-in styles
import { SkillNode } from "./SkillNode";
import { WindingEdge } from "./WindingEdge";
import { StepPreviewModal } from "./StepPreviewModal";
import type { SkillNode as SkillNodeType, NodeEdge } from "@/types/roadmap";

// Register our custom node/edge types — the key must match the "type" field
// we set on each node/edge below
const nodeTypes = { skillNode: SkillNode };
const edgeTypes = { windingEdge: WindingEdge };

interface Props {
  nodes: SkillNodeType[];
  edges: NodeEdge[];
  onNodeClick: (nodeId: number) => void;
  onToggleComplete: (nodeId: number) => void;
}

// Winding-road layout constants. Each step's vertical level is a direct
// function of its estimated_hours — the shortest step in the roadmap sits
// at BASELINE_Y (lowest point), the longest sits MAX_RISE above that, and
// everything else is interpolated between — so the road's elevation reads
// as a literal time profile, not an arbitrary alternating zigzag.
// Spacing scales with the card size (SkillNode is ~2.5x its original size) so
// consecutive stops don't overlap.
const HORIZONTAL_SPACING = 800;
const BASELINE_Y = 550;
const MAX_RISE = 1140; // 3x the elevation spread between shortest and longest step

// Note: `edges` (the backend's dependency graph) is intentionally unused for
// rendering — the road is drawn as one continuous path through `nodes` in
// sequence instead, see the `rfEdges` comment below.
export function RoadmapFlow({ nodes, onToggleComplete }: Props) {
  // Clicking a step opens a small mock preview popup (see StepPreviewModal)
  // instead of the real ResourcePanel drawer — the backend resource pipeline
  // doesn't exist yet, so ResourcePanel is just an empty state right now.
  // This is a local, Map-view-only override; Steps/Schedule views still use
  // the `onNodeClick` prop to open the real (currently empty) drawer.
  const [previewNode, setPreviewNode] = useState<SkillNodeType | null>(null);

  const handleStepClick = (nodeId: number) => {
    setPreviewNode(nodes.find((n) => n.id === nodeId) ?? null);
  };

  // This step's vertical level: the shortest step in the roadmap sits at
  // BASELINE_Y, the longest sits MAX_RISE above it, everything else in
  // between — lower on screen = shorter time, higher = longer time.
  const hoursList = nodes.map((n) => n.estimated_hours);
  const minHours = Math.min(...hoursList);
  const maxHours = Math.max(...hoursList);
  const heightFor = (hours: number) => {
    if (maxHours === minHours) return BASELINE_Y - MAX_RISE / 2;
    const t = (hours - minHours) / (maxHours - minHours);
    return BASELINE_Y - t * MAX_RISE;
  };

  // Convert our backend data format into the shape React Flow expects
  const flowNodes: Node[] = nodes.map((n, index) => ({
    id: String(n.id),          // React Flow needs string IDs
    type: "skillNode",         // Must match the key in nodeTypes above
    // Always lay out along the winding road — existing roadmaps have saved
    // positions from the old 3-column grid layout, which we intentionally
    // don't use anymore now that the road is the layout.
    position: {
      x: index * HORIZONTAL_SPACING,
      y: heightFor(n.estimated_hours),
    },
    // Everything in `data` is available inside the SkillNode component as `data.xxx`
    data: {
      title: n.title,
      category: n.category,
      estimated_hours: n.estimated_hours,
      is_completed: n.is_completed,
      nodeId: n.id,
      stepNumber: index + 1,
      onNodeClick: handleStepClick,
      onToggleComplete,
    },
  }));

  // useNodesState lets React Flow manage node dragging internally
  const [rfNodes, , onNodesChange] = useNodesState(flowNodes);

  // Render the road as ONE continuous path through every step in sequence —
  // not the backend's dependency edges, which can branch/converge (multiple
  // edges into one node) and read as several crossing lines instead of a
  // single journey. Derived from rfNodes' live positions so dragging a step
  // still redraws the road correctly.
  const roadPoints = rfNodes.map((n) => ({
    x: n.position.x,
    y: n.position.y,
    completed: Boolean((n.data as any).is_completed),
  }));
  // Not wrapped in useEdgesState — this single edge is fully derived from
  // rfNodes every render (not independently draggable/editable), so it must
  // recompute live rather than freeze at whatever it was on first mount.
  const rfEdges: Edge[] =
    roadPoints.length > 1
      ? [
          {
            id: "road",
            source: rfNodes[0].id,
            target: rfNodes[rfNodes.length - 1].id,
            type: "windingEdge",
            data: { points: roadPoints },
          },
        ]
      : [];

  return (
    <div className="w-full h-[calc(100vh-180px)] rounded-xl border border-border overflow-hidden">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        style={{ background: "hsl(38 38% 90%)" }}   // Match warm cream --background
      >
        <MiniMap
          style={{ background: "#fff", border: "1px solid hsl(36 26% 82%)" }}
          nodeColor="hsl(340 82% 52% / 0.3)"
          maskColor="hsl(38 38% 90% / 0.7)"
        />
        <Controls
          style={{ background: "#fff", border: "1px solid hsl(36 26% 82%)" }}
        />
        {/* Dot grid — warm gray dots */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#C8BDA8"
        />
      </ReactFlow>

      {previewNode && (
        <StepPreviewModal node={previewNode} onClose={() => setPreviewNode(null)} />
      )}
    </div>
  );
}
