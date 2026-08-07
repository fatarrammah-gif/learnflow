"""
Roadmap generation pipeline using Gemini Flash 1.5.

Flow:
1. Load goal + criteria + inspiration uploads from DB
2. Call Gemini to generate structured JSON roadmap
3. Parse nodes + edges → write to DB as SkillNode / NodeEdge rows
4. If Gemini says exceeds_budget=true → set status='time_conflict'
5. On any error → set status='error'
"""
import asyncio
import logging
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from db.models import Roadmap, LearningGoal, Criterion, InspirationUpload, SkillNode, NodeEdge

logger = logging.getLogger(__name__)


async def generate_roadmap_for_goal(
    goal_id: int,
    roadmap_id: int,
    db,
    time_strategy: str = "none",
) -> None:
    """Generate a roadmap using Gemini and persist the nodes/edges to the database."""
    import asyncio

    # ── 1. Load goal ────────────────────────────────────────────────────────
    goal_result = await db.execute(
        select(LearningGoal)
        .where(LearningGoal.id == goal_id)
        .options(
            selectinload(LearningGoal.criteria),
            selectinload(LearningGoal.uploads),
        )
    )
    goal = goal_result.scalar_one_or_none()

    if not goal:
        logger.error("Goal %s not found during roadmap generation", goal_id)
        return

    # ── 2. Build context for Gemini ─────────────────────────────────────────
    criteria_labels = [
        c.label
        for c in sorted(goal.criteria, key=lambda x: x.sort_order)
    ]

    inspiration_text = "\n\n".join(
        u.parsed_content
        for u in goal.uploads
        if u.parsed_content
    )

    # ── 3. Call Gemini (runs in thread pool to avoid blocking the event loop) ──
    loop = asyncio.get_event_loop()
    try:
        from ai.gemini_client import generate_roadmap_sync
        roadmap_data = await loop.run_in_executor(
            None,
            lambda: generate_roadmap_sync(
                goal_title=goal.title,
                level=goal.level,
                topic_focus=goal.topic_focus or "",
                skills_tools=goal.skills_tools or [],
                time_weeks=goal.time_weeks,
                hours_per_week=goal.hours_per_week,
                criteria_labels=criteria_labels,
                inspiration_text=inspiration_text,
                time_strategy=time_strategy,
            ),
        )
    except Exception as exc:
        logger.exception("Gemini call failed for roadmap %s: %s", roadmap_id, exc)
        roadmap_result = await db.execute(select(Roadmap).where(Roadmap.id == roadmap_id))
        roadmap = roadmap_result.scalar_one_or_none()
        if roadmap:
            roadmap.status = "error"
            await db.commit()
        return

    # ── 4. Persist nodes ────────────────────────────────────────────────────
    roadmap_result = await db.execute(select(Roadmap).where(Roadmap.id == roadmap_id))
    roadmap = roadmap_result.scalar_one_or_none()
    if not roadmap:
        return

    # Delete any existing nodes/edges (e.g. on re-generation after time conflict)
    existing_nodes = await db.execute(select(SkillNode).where(SkillNode.roadmap_id == roadmap_id))
    for node in existing_nodes.scalars().all():
        await db.delete(node)
    existing_edges = await db.execute(select(NodeEdge).where(NodeEdge.roadmap_id == roadmap_id))
    for edge in existing_edges.scalars().all():
        await db.delete(edge)
    await db.flush()

    # Map Gemini node IDs (e.g. "n1") → DB row IDs
    node_id_map: dict[str, int] = {}

    # Auto-layout: arrange nodes in a gentle diagonal flow
    col_width, row_height = 280, 180
    nodes_data = roadmap_data.get("nodes", [])

    for i, node_dict in enumerate(nodes_data):
        col = i % 3
        row = i // 3
        db_node = SkillNode(
            roadmap_id=roadmap_id,
            title=node_dict.get("title", f"Step {i+1}"),
            description=node_dict.get("description", ""),
            category=node_dict.get("category", "Core Concepts"),
            estimated_hours=float(node_dict.get("estimated_hours", 2.0)),
            sort_order=i,
            position_x=float(col * col_width + 80),
            position_y=float(row * row_height + 80),
            search_queries=node_dict.get("search_queries", []),
            key_concepts=node_dict.get("key_concepts", []),
        )
        db.add(db_node)
        await db.flush()  # get the DB-assigned id
        node_id_map[node_dict["id"]] = db_node.id

    # ── 5. Persist edges ────────────────────────────────────────────────────
    for edge_dict in roadmap_data.get("edges", []):
        src = node_id_map.get(edge_dict.get("source", ""))
        tgt = node_id_map.get(edge_dict.get("target", ""))
        if src and tgt and src != tgt:
            db.add(NodeEdge(roadmap_id=roadmap_id, source_node_id=src, target_node_id=tgt))

    # ── 6. Update roadmap status ────────────────────────────────────────────
    roadmap.total_hours_est = float(roadmap_data.get("total_estimated_hours", 0.0))
    roadmap.raw_ai_response = roadmap_data

    if roadmap_data.get("exceeds_budget") and time_strategy == "none":
        roadmap.status = "time_conflict"
    else:
        roadmap.status = "ready"

    await db.commit()
    logger.info(
        "Roadmap %s generated: %d nodes, status=%s",
        roadmap_id, len(nodes_data), roadmap.status,
    )
