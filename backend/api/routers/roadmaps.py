from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from db.database import get_db, AsyncSessionLocal
from db.models import Roadmap, LearningGoal, SkillNode
from api.schemas.roadmap import (
    RoadmapGenerateRequest, RoadmapResponse, RoadmapDetailResponse, TimeResolutionRequest
)
from db.crud import get_roadmap_with_nodes

router = APIRouter(tags=["roadmaps"])


async def _run_generation(roadmap_id: int, goal_id: int, time_strategy: str = "none"):
    """Background task: calls the Gemini pipeline and writes nodes/edges to the DB."""
    from ai.pipeline.roadmap_pipeline import generate_roadmap_for_goal
    async with AsyncSessionLocal() as db:
        await generate_roadmap_for_goal(
            goal_id=goal_id,
            roadmap_id=roadmap_id,
            db=db,
            time_strategy=time_strategy,
        )


@router.post("/goals/{goal_id}/roadmaps/generate", status_code=202)
async def generate_roadmap(
    goal_id: int,
    data: RoadmapGenerateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    goal_result = await db.execute(select(LearningGoal).where(LearningGoal.id == goal_id))
    if not goal_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Goal not found")

    roadmap = Roadmap(goal_id=goal_id, output_format=data.output_format, status="generating")
    db.add(roadmap)
    await db.commit()
    await db.refresh(roadmap)

    background_tasks.add_task(_run_generation, roadmap.id, goal_id)
    return {"roadmap_id": roadmap.id, "status": "generating"}


@router.get("/roadmaps/", response_model=List[RoadmapResponse])
async def list_roadmaps(goal_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    query = (
        select(Roadmap, LearningGoal.title, func.count(SkillNode.id))
        .join(LearningGoal, Roadmap.goal_id == LearningGoal.id)
        .outerjoin(SkillNode, SkillNode.roadmap_id == Roadmap.id)
        .group_by(Roadmap.id, LearningGoal.title)
        .order_by(Roadmap.created_at.desc())
    )
    if goal_id is not None:
        query = query.where(Roadmap.goal_id == goal_id)

    result = await db.execute(query)
    responses = []
    for roadmap, goal_title, node_count in result.all():
        response = RoadmapResponse.model_validate(roadmap)
        response.goal_title = goal_title
        response.node_count = node_count
        responses.append(response)
    return responses


@router.get("/roadmaps/{roadmap_id}", response_model=RoadmapDetailResponse)
async def get_roadmap(roadmap_id: int, db: AsyncSession = Depends(get_db)):
    roadmap = await get_roadmap_with_nodes(db, roadmap_id)
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap


@router.patch("/roadmaps/{roadmap_id}/format")
async def update_format(roadmap_id: int, data: dict, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Roadmap).where(Roadmap.id == roadmap_id))
    roadmap = result.scalar_one_or_none()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    if "output_format" in data:
        roadmap.output_format = data["output_format"]
    await db.commit()
    return {"status": "updated"}


@router.post("/roadmaps/{roadmap_id}/resolve-time", status_code=202)
async def resolve_time(
    roadmap_id: int,
    data: TimeResolutionRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Roadmap).where(Roadmap.id == roadmap_id))
    roadmap = result.scalar_one_or_none()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    roadmap.time_conflict_strategy = data.strategy
    roadmap.status = "generating"
    await db.commit()
    background_tasks.add_task(_run_generation, roadmap_id, roadmap.goal_id, data.strategy)
    return {"roadmap_id": roadmap_id, "status": "generating"}
