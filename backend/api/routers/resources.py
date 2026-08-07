from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from db.database import get_db
from db.models import YoutubeResource, VideoTimestamp
from api.schemas.resource import ResourceDetailResponse, TimestampResponse

router = APIRouter(tags=["resources"])


@router.get("/resources/{resource_id}", response_model=ResourceDetailResponse)
async def get_resource(resource_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(YoutubeResource)
        .where(YoutubeResource.id == resource_id)
        .options(
            selectinload(YoutubeResource.scores),
            selectinload(YoutubeResource.timestamps),
        )
    )
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource


@router.get("/resources/{resource_id}/timestamps", response_model=List[TimestampResponse])
async def get_timestamps(resource_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(VideoTimestamp)
        .where(VideoTimestamp.resource_id == resource_id)
        .order_by(VideoTimestamp.relevance_score.desc())
    )
    return result.scalars().all()
