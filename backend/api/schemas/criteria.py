from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class CriterionCreate(BaseModel):
    label: str
    description: Optional[str] = ""
    sort_order: int = 0
    is_custom: bool = False


class CriterionUpdate(BaseModel):
    label: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None


class CriterionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    goal_id: int
    label: str
    description: Optional[str]
    sort_order: int
    is_custom: bool
    created_at: datetime


class ReorderItem(BaseModel):
    id: int
    sort_order: int


class ReorderRequest(BaseModel):
    items: List[ReorderItem]
