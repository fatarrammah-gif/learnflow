from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class RoadmapGenerateRequest(BaseModel):
    output_format: str = "interactive_map"  # interactive_map/schedule/steps


class SkillNodeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    roadmap_id: int
    title: str
    description: Optional[str]
    category: Optional[str]
    estimated_hours: float
    sort_order: int
    position_x: float
    position_y: float
    is_completed: bool
    search_queries: Optional[List[str]]
    key_concepts: Optional[List[str]]


class NodeEdgeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    source_node_id: int
    target_node_id: int


class RoadmapResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    goal_id: int
    output_format: str
    status: str
    time_conflict_strategy: str
    total_hours_est: Optional[float]
    created_at: datetime


class RoadmapDetailResponse(RoadmapResponse):
    nodes: List[SkillNodeResponse] = []
    edges: List[NodeEdgeResponse] = []


class NodePositionUpdate(BaseModel):
    x: float
    y: float


class TimeResolutionRequest(BaseModel):
    strategy: str  # focus/extend/compromise
