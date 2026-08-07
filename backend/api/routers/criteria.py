from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.database import get_db
from db.models import Criterion, LearningGoal
from api.schemas.criteria import CriterionCreate, CriterionUpdate, CriterionResponse, ReorderRequest

router = APIRouter(tags=["criteria"])


@router.get("/goals/{goal_id}/criteria", response_model=List[CriterionResponse])
async def list_criteria(goal_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Criterion)
        .where(Criterion.goal_id == goal_id)
        .order_by(Criterion.sort_order)
    )
    return result.scalars().all()


@router.post("/goals/{goal_id}/criteria", response_model=CriterionResponse, status_code=201)
async def create_criterion(goal_id: int, data: CriterionCreate, db: AsyncSession = Depends(get_db)):
    goal_result = await db.execute(select(LearningGoal).where(LearningGoal.id == goal_id))
    if not goal_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Goal not found")
    criterion = Criterion(goal_id=goal_id, **data.model_dump())
    db.add(criterion)
    await db.commit()
    await db.refresh(criterion)
    return criterion


@router.patch("/goals/{goal_id}/criteria/{criterion_id}", response_model=CriterionResponse)
async def update_criterion(goal_id: int, criterion_id: int, data: CriterionUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Criterion).where(Criterion.id == criterion_id, Criterion.goal_id == goal_id)
    )
    criterion = result.scalar_one_or_none()
    if not criterion:
        raise HTTPException(status_code=404, detail="Criterion not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(criterion, field, value)
    await db.commit()
    await db.refresh(criterion)
    return criterion


@router.delete("/goals/{goal_id}/criteria/{criterion_id}", status_code=204)
async def delete_criterion(goal_id: int, criterion_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Criterion).where(Criterion.id == criterion_id, Criterion.goal_id == goal_id)
    )
    criterion = result.scalar_one_or_none()
    if not criterion:
        raise HTTPException(status_code=404, detail="Criterion not found")
    await db.delete(criterion)
    await db.commit()


@router.post("/goals/{goal_id}/criteria/reorder", status_code=200)
async def reorder_criteria(goal_id: int, data: ReorderRequest, db: AsyncSession = Depends(get_db)):
    for item in data.items:
        result = await db.execute(
            select(Criterion).where(Criterion.id == item.id, Criterion.goal_id == goal_id)
        )
        criterion = result.scalar_one_or_none()
        if criterion:
            criterion.sort_order = item.sort_order
    await db.commit()
    return {"message": "Reordered successfully"}
