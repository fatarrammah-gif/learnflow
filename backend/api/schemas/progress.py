from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class ProgressLogCreate(BaseModel):
    node_id: int
    resource_id: Optional[int] = None
    log_date: date
    minutes_spent: int
    notes: Optional[str] = ""


class ProgressLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    node_id: int
    resource_id: Optional[int]
    log_date: date
    minutes_spent: int
    notes: Optional[str]
    source: str
    created_at: datetime


class NodeProgressResponse(BaseModel):
    node_id: int
    node_title: str
    total_minutes: int
    completion_pct: float


class GoalProgressResponse(BaseModel):
    total_minutes: int
    overall_completion_pct: float
    by_node: List[NodeProgressResponse]
