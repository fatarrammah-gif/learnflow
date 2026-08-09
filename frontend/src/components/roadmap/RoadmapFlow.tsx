import { useState } from "react";
import {
  ReactFlow, MiniMap, Controls, Background, BackgroundVariant,
  useNodesState, useEdgesState,
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

// Winding-road layout constants — a horizontal zigzag, node index alternating
// above/below a center line, so consecutive nodes read as one snaking path.
// How far a step sits from the center line scales with its estimated_hours,
// so a longer step visibly swings higher/lower than a quick one.
const HORIZONTAL_SPACING = 300;
const MIN_AMPLITUDE = 60;
const MAX_AMPLITUDE = 190;
const CENTER_Y = 260;

export function RoadmapFlow({ nodes, edges, onToggleComplete }: Props) {
  // Clicking a step opens a small mock preview popup (see StepPreviewModal)
  // instead of the real ResourcePanel drawer — the backend resource pipeline
  // doesn't exist yet, so ResourcePanel is just an empty state right now.
  // This is a local, Map-view-only override; Steps/Schedule views still use
  // the `onNodeClick` prop to open the real (currently empty) drawer.
  const [previewNode, setPreviewNode] = useState<SkillNodeType | null>(null);

  const handleStepClick = (nodeId: number) => {
    setPreviewNode(nodes.find((n) => n.id === nodeId) ?? null);
  };

  // How far this step's pin sits from the road's center line, scaled by its
  // estimated_hours relative to the shortest/longest step in this roadmap.
  const hoursList = nodes.map((n) => n.estimated_hours);
  const minHours = Math.min(...hoursList);
  const maxHours = Math.max(...hoursList);
  const amplitudeFor = (hours: number) => {
    if (maxHours === minHours) return (MIN_AMPLITUDE + MAX_AMPLITUDE) / 2;
    const t = (hours - minHours) / (maxHours - minHours);
    return MIN_AMPLITUDE + t * (MAX_AMPLITUDE - MIN_AMPLITUDE);
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
      y:
        index % 2 === 0
          ? CENTER_Y - amplitudeFor(n.estimated_hours)
          : CENTER_Y + amplitudeFor(n.estimated_hours),
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

  // Map node id -> completion status, so a road segment can show a progress
  // accent once the skill it flows from is done ("unlocked path" read)
  const completedById = new Map(nodes.map((n) => [n.id, n.is_completed]));

  const flowEdges: Edge[] = edges.map((e) => ({
    id: String(e.id),
    source: String(e.source_node_id),
    target: String(e.target_node_id),
    type: "windingEdge",   // Custom paved-road edge — see WindingEdge.tsx
    data: { sourceDone: completedById.get(e.source_node_id) ?? false },
  }));

  // useNodesState / useEdgesState let React Flow manage node dragging internally
  const [rfNodes, , onNodesChange] = useNodesState(flowNodes);
  const [rfEdges, , onEdgesChange] = useEdgesState(flowEdges);

  return (
    <div className="w-full h-[calc(100vh-180px)] rounded-xl border border-border overflow-hidden">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
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
