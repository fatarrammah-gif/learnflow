import {
  ReactFlow, MiniMap, Controls, Background, BackgroundVariant,
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
}

export function RoadmapFlow({ nodes, edges, onNodeClick }: Props) {
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
    },
  }));

  const flowEdges: Edge[] = edges.map((e) => ({
    id: String(e.id),
    source: String(e.source_node_id),
    target: String(e.target_node_id),
    type: "smoothstep",   // Curved edge style
  }));

  // useNodesState / useEdgesState let React Flow manage node dragging internally
  const [rfNodes, , onNodesChange] = useNodesState(flowNodes);
  const [rfEdges, , onEdgesChange] = useEdgesState(flowEdges);

  return (
    <div className="w-full h-[calc(100vh-180px)] rounded-lg border bg-muted/20">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView                              // Auto-zoom to show all nodes
        fitViewOptions={{ padding: 0.3 }}
      >
        <MiniMap />      {/* Small overview map in the corner */}
        <Controls />     {/* Zoom in/out buttons */}
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
