from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from db.database import get_db
from db.models import ProgressLog, SkillNode, LearningGoal, Roadmap
from api.schemas.progress import ProgressLogCreate, ProgressLogResponse, GoalProgressResponse, NodeProgressResponse

router = APIRouter(tags=["progress"])


@router.post("/progress", response_model=ProgressLogResponse, status_code=201)
async def log_progress(data: ProgressLogCreate, db: AsyncSession = Depends(get_db)):
    node_result = await db.execute(select(SkillNode).where(SkillNode.id == data.node_id))
    node = node_result.scalar_one_or_none()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")

    roadmap_result = await db.execute(select(Roadmap).where(Roadmap.id == node.roadmap_id))
    roadmap = roadmap_result.scalar_one_or_none()

    log = ProgressLog(
        goal_id=roadmap.goal_id if roadmap else 0,
        source="manual",
        **data.model_dump(),
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log


@router.get("/goals/{goal_id}/progress", response_model=GoalProgressResponse)
async def get_goal_progress(goal_id: int, db: AsyncSession = Depends(get_db)):
    # Get all nodes for this goal's roadmaps
    roadmap_result = await db.execute(select(Roadmap).where(Roadmap.goal_id == goal_id))
    roadmaps = roadmap_result.scalars().all()
    roadmap_ids = [r.id for r in roadmaps]

    if not roadmap_ids:
        return GoalProgressResponse(total_minutes=0, overall_completion_pct=0.0, by_node=[])

    nodes_result = await db.execute(
        select(SkillNode).where(SkillNode.roadmap_id.in_(roadmap_ids))
    )
    nodes = nodes_result.scalars().all()

    by_node: List[NodeProgressResponse] = []
    total_minutes = 0

    for node in nodes:
        logs_result = await db.execute(
            select(func.sum(ProgressLog.minutes_spent))
            .where(ProgressLog.node_id == node.id)
        )
        node_minutes = logs_result.scalar() or 0
        total_minutes += node_minutes
        target_minutes = node.estimated_hours * 60
        pct = min(100.0, (node_minutes / target_minutes * 100) if target_minutes > 0 else 0.0)
        by_node.append(NodeProgressResponse(
            node_id=node.id,
            node_title=node.title,
            total_minutes=node_minutes,
            completion_pct=pct,
        ))

    overall_pct = (
        sum(n.completion_pct for n in by_node) / len(by_node) if by_node else 0.0
    )

    return GoalProgressResponse(
        total_minutes=total_minutes,
        overall_completion_pct=overall_pct,
        by_node=by_node,
    )


@router.get("/goals/{goal_id}/progress/by-node", response_model=List[NodeProgressResponse])
async def get_progress_by_node(goal_id: int, db: AsyncSession = Depends(get_db)):
    result = await get_goal_progress(goal_id, db)
    return result.by_node
