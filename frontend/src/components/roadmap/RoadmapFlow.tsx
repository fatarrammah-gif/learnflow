import {
  ReactFlow, MiniMap, Controls, Background, BackgroundVariant, MarkerType,
  useNodesState, useEdgesState,
  type Node, type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";   // Required: React Flow's built-in styles
import { SkillNode } from "./SkillNode";
import type { SkillNode as SkillNodeType, NodeEdge } from "@/types/roadmap";

// Register our custom node type — key must match the "type" field we set on each node
const nodeTypes = { skillNode: SkillNode };

interface Props {
  nodes: SkillNodeType[];
  edges: NodeEdge[];
  onNodeClick: (nodeId: number) => void;
  onToggleComplete: (nodeId: number) => void;
}

export function RoadmapFlow({ nodes, edges, onNodeClick, onToggleComplete }: Props) {
  // Convert our backend data format into the shape React Flow expects
  const flowNodes: Node[] = nodes.map((n, index) => ({
    id: String(n.id),          // React Flow needs string IDs
    type: "skillNode",         // Must match the key in nodeTypes above
    // Use saved position if available, otherwise auto-arrange in a 3-column grid
    position: (n.position_x || n.position_y)
      ? { x: n.position_x, y: n.position_y }
      : { x: (index % 3) * 260, y: Math.floor(index / 3) * 160 },
    // Everything in `data` is available inside the SkillNode component as `data.xxx`
    data: {
      title: n.title,
      category: n.category,
      estimated_hours: n.estimated_hours,
      is_completed: n.is_completed,
      nodeId: n.id,
      onNodeClick,
      onToggleComplete,
    },
  }));

  // Map node id -> completion status, so an edge can be styled brighter/thicker
  // once the skill it flows from is done ("unlocked path" read)
  const completedById = new Map(nodes.map((n) => [n.id, n.is_completed]));

  const flowEdges: Edge[] = edges.map((e) => {
    const sourceDone = completedById.get(e.source_node_id) ?? false;
    const stroke = sourceDone ? "hsl(340 82% 52% / 0.85)" : "hsl(340 82% 52% / 0.35)";
    return {
      id: String(e.id),
      source: String(e.source_node_id),
      target: String(e.target_node_id),
      type: "smoothstep",   // Curved edge style
      style: { stroke, strokeWidth: sourceDone ? 3 : 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: 18, height: 18 },
    };
  });

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
    </div>
  );
}
