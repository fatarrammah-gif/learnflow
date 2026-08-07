from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.database import get_db
from db.models import SkillNode
from api.schemas.roadmap import NodePositionUpdate, SkillNodeResponse
from db.crud import get_node_with_resources

router = APIRouter(tags=["nodes"])


@router.get("/nodes/{node_id}", response_model=SkillNodeResponse)
async def get_node(node_id: int, db: AsyncSession = Depends(get_db)):
    node = await get_node_with_resources(db, node_id)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    return node


@router.patch("/nodes/{node_id}/position")
async def update_node_position(node_id: int, data: NodePositionUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SkillNode).where(SkillNode.id == node_id))
    node = result.scalar_one_or_none()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    node.position_x = data.x
    node.position_y = data.y
    await db.commit()
    return {"status": "updated"}


@router.patch("/nodes/{node_id}/complete")
async def toggle_node_complete(node_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SkillNode).where(SkillNode.id == node_id))
    node = result.scalar_one_or_none()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    node.is_completed = not node.is_completed
    await db.commit()
    return {"is_completed": node.is_completed}


@router.post("/nodes/{node_id}/fetch-resources", status_code=202)
async def fetch_node_resources(node_id: int, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SkillNode).where(SkillNode.id == node_id))
    node = result.scalar_one_or_none()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    # Placeholder — Phase 4 will call the scoring pipeline here
    return {"status": "queued", "node_id": node_id}
