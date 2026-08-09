from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from db.models import LearningGoal, Criterion, Roadmap, SkillNode, NodeEdge, YoutubeResource

# Resources are serialized with their scores/timestamps (ResourceDetailResponse),
# so both need eager loading anywhere a SkillNode.resources relation is loaded —
# otherwise Pydantic's response serialization hits an async lazy-load error.
_RESOURCES_WITH_DETAIL = selectinload(SkillNode.resources).options(
    selectinload(YoutubeResource.scores),
    selectinload(YoutubeResource.timestamps),
)


async def get_goal(db: AsyncSession, goal_id: int):
    result = await db.execute(select(LearningGoal).where(LearningGoal.id == goal_id))
    return result.scalar_one_or_none()


async def get_goal_with_criteria(db: AsyncSession, goal_id: int):
    result = await db.execute(
        select(LearningGoal)
        .where(LearningGoal.id == goal_id)
        .options(selectinload(LearningGoal.criteria))
    )
    return result.scalar_one_or_none()


async def get_roadmap(db: AsyncSession, roadmap_id: int):
    result = await db.execute(select(Roadmap).where(Roadmap.id == roadmap_id))
    return result.scalar_one_or_none()


async def get_roadmap_with_nodes(db: AsyncSession, roadmap_id: int):
    result = await db.execute(
        select(Roadmap)
        .where(Roadmap.id == roadmap_id)
        .options(
            selectinload(Roadmap.nodes).options(_RESOURCES_WITH_DETAIL),
            selectinload(Roadmap.edges),
        )
    )
    return result.scalar_one_or_none()


async def get_node_with_resources(db: AsyncSession, node_id: int):
    result = await db.execute(
        select(SkillNode)
        .where(SkillNode.id == node_id)
        .options(_RESOURCES_WITH_DETAIL)
    )
    return result.scalar_one_or_none()


async def get_criteria_for_goal(db: AsyncSession, goal_id: int):
    result = await db.execute(
        select(Criterion)
        .where(Criterion.goal_id == goal_id)
        .order_by(Criterion.sort_order)
    )
    return result.scalars().all()
