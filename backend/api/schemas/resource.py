from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class CriterionScoreResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    criterion_id: int
    score: float
    match_level: str
    reasoning: Optional[str]


class TimestampResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    start_seconds: int
    end_seconds: Optional[int]
    label: str
    relevance_score: float


class YoutubeResourceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    node_id: int
    video_id: str
    playlist_id: Optional[str]
    title: str
    channel_name: Optional[str]
    duration_seconds: Optional[int]
    thumbnail_url: Optional[str]
    youtube_url: str
    overall_score: float
    sort_rank: int
    is_playlist: bool


class ResourceDetailResponse(YoutubeResourceResponse):
    scores: List[CriterionScoreResponse] = []
    timestamps: List[TimestampResponse] = []
