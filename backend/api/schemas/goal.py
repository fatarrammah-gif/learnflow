from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, field_validator


class GoalCreate(BaseModel):
    title: str
    level: str  # beginner/intermediate/expert
    topic_focus: Optional[str] = ""
    skills_tools: List[str] = []
    time_weeks: float
    hours_per_week: float

    @field_validator("title")
    @classmethod
    def title_min_length(cls, v: str) -> str:
        if len(v.strip()) < 3:
            raise ValueError("Title must be at least 3 characters")
        return v

    @field_validator("level")
    @classmethod
    def validate_level(cls, v: str) -> str:
        if v not in ("beginner", "intermediate", "expert"):
            raise ValueError("Level must be beginner, intermediate, or expert")
        return v


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    level: Optional[str] = None
    topic_focus: Optional[str] = None
    skills_tools: Optional[List[str]] = None
    time_weeks: Optional[float] = None
    hours_per_week: Optional[float] = None


class GoalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    level: str
    topic_focus: Optional[str]
    skills_tools: Optional[List[str]]
    time_weeks: float
    hours_per_week: float
    created_at: datetime
    updated_at: datetime
