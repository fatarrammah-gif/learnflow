from datetime import datetime, date
from typing import List, Optional
from sqlalchemy import (
    Boolean, DateTime, Float, ForeignKey, Integer, String, Text, Date,
    func, JSON
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.database import Base


class LearningGoal(Base):
    __tablename__ = "learning_goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    level: Mapped[str] = mapped_column(String(20), nullable=False)  # beginner/intermediate/expert
    topic_focus: Mapped[Optional[str]] = mapped_column(String(200))
    skills_tools: Mapped[Optional[list]] = mapped_column(JSON, default=list)
    time_weeks: Mapped[float] = mapped_column(Float, nullable=False)
    hours_per_week: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    criteria: Mapped[List["Criterion"]] = relationship("Criterion", back_populates="goal", cascade="all, delete-orphan")
    uploads: Mapped[List["InspirationUpload"]] = relationship("InspirationUpload", back_populates="goal", cascade="all, delete-orphan")
    roadmaps: Mapped[List["Roadmap"]] = relationship("Roadmap", back_populates="goal", cascade="all, delete-orphan")
    progress_logs: Mapped[List["ProgressLog"]] = relationship("ProgressLog", back_populates="goal", cascade="all, delete-orphan")


class Criterion(Base):
    __tablename__ = "criteria"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    goal_id: Mapped[int] = mapped_column(Integer, ForeignKey("learning_goals.id"), nullable=False)
    label: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(300))
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_custom: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    goal: Mapped["LearningGoal"] = relationship("LearningGoal", back_populates="criteria")
    scores: Mapped[List["ResourceCriterionScore"]] = relationship("ResourceCriterionScore", back_populates="criterion", cascade="all, delete-orphan")


class InspirationUpload(Base):
    __tablename__ = "inspiration_uploads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    goal_id: Mapped[int] = mapped_column(Integer, ForeignKey("learning_goals.id"), nullable=False)
    upload_type: Mapped[str] = mapped_column(String(20), nullable=False)  # image/webpage/pdf/youtube
    original_url: Mapped[Optional[str]] = mapped_column(String(500))
    file_path: Mapped[Optional[str]] = mapped_column(String(500))
    parsed_content: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    goal: Mapped["LearningGoal"] = relationship("LearningGoal", back_populates="uploads")


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    goal_id: Mapped[int] = mapped_column(Integer, ForeignKey("learning_goals.id"), nullable=False)
    output_format: Mapped[str] = mapped_column(String(20), default="interactive_map")
    status: Mapped[str] = mapped_column(String(20), default="generating")  # generating/ready/error/time_conflict
    time_conflict_strategy: Mapped[str] = mapped_column(String(20), default="none")
    total_hours_est: Mapped[Optional[float]] = mapped_column(Float)
    raw_ai_response: Mapped[Optional[dict]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    goal: Mapped["LearningGoal"] = relationship("LearningGoal", back_populates="roadmaps")
    nodes: Mapped[List["SkillNode"]] = relationship("SkillNode", back_populates="roadmap", cascade="all, delete-orphan")
    edges: Mapped[List["NodeEdge"]] = relationship("NodeEdge", back_populates="roadmap", cascade="all, delete-orphan", foreign_keys="NodeEdge.roadmap_id")


class SkillNode(Base):
    __tablename__ = "skill_nodes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    roadmap_id: Mapped[int] = mapped_column(Integer, ForeignKey("roadmaps.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    category: Mapped[Optional[str]] = mapped_column(String(100))
    estimated_hours: Mapped[float] = mapped_column(Float, default=1.0)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    position_x: Mapped[float] = mapped_column(Float, default=0.0)
    position_y: Mapped[float] = mapped_column(Float, default=0.0)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    search_queries: Mapped[Optional[list]] = mapped_column(JSON, default=list)
    key_concepts: Mapped[Optional[list]] = mapped_column(JSON, default=list)

    roadmap: Mapped["Roadmap"] = relationship("Roadmap", back_populates="nodes")
    resources: Mapped[List["YoutubeResource"]] = relationship("YoutubeResource", back_populates="node", cascade="all, delete-orphan")
    progress_logs: Mapped[List["ProgressLog"]] = relationship("ProgressLog", back_populates="node")


class NodeEdge(Base):
    __tablename__ = "node_edges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    roadmap_id: Mapped[int] = mapped_column(Integer, ForeignKey("roadmaps.id"), nullable=False)
    source_node_id: Mapped[int] = mapped_column(Integer, ForeignKey("skill_nodes.id"), nullable=False)
    target_node_id: Mapped[int] = mapped_column(Integer, ForeignKey("skill_nodes.id"), nullable=False)

    roadmap: Mapped["Roadmap"] = relationship("Roadmap", back_populates="edges", foreign_keys=[roadmap_id])
    source_node: Mapped["SkillNode"] = relationship("SkillNode", foreign_keys=[source_node_id])
    target_node: Mapped["SkillNode"] = relationship("SkillNode", foreign_keys=[target_node_id])


class YoutubeResource(Base):
    __tablename__ = "youtube_resources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    node_id: Mapped[int] = mapped_column(Integer, ForeignKey("skill_nodes.id"), nullable=False)
    video_id: Mapped[str] = mapped_column(String(20), nullable=False)
    playlist_id: Mapped[Optional[str]] = mapped_column(String(50))
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    channel_name: Mapped[Optional[str]] = mapped_column(String(200))
    duration_seconds: Mapped[Optional[int]] = mapped_column(Integer)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500))
    youtube_url: Mapped[str] = mapped_column(String(500), nullable=False)
    overall_score: Mapped[float] = mapped_column(Float, default=0.0)
    sort_rank: Mapped[int] = mapped_column(Integer, default=0)
    is_playlist: Mapped[bool] = mapped_column(Boolean, default=False)
    fetched_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    node: Mapped["SkillNode"] = relationship("SkillNode", back_populates="resources")
    scores: Mapped[List["ResourceCriterionScore"]] = relationship("ResourceCriterionScore", back_populates="resource", cascade="all, delete-orphan")
    transcript: Mapped[Optional["Transcript"]] = relationship("Transcript", back_populates="resource", uselist=False, cascade="all, delete-orphan")
    timestamps: Mapped[List["VideoTimestamp"]] = relationship("VideoTimestamp", back_populates="resource", cascade="all, delete-orphan")


class ResourceCriterionScore(Base):
    __tablename__ = "resource_criterion_scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    resource_id: Mapped[int] = mapped_column(Integer, ForeignKey("youtube_resources.id"), nullable=False)
    criterion_id: Mapped[int] = mapped_column(Integer, ForeignKey("criteria.id"), nullable=False)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    match_level: Mapped[str] = mapped_column(String(10), default="low")  # high/medium/low
    reasoning: Mapped[Optional[str]] = mapped_column(Text)

    resource: Mapped["YoutubeResource"] = relationship("YoutubeResource", back_populates="scores")
    criterion: Mapped["Criterion"] = relationship("Criterion", back_populates="scores")


class Transcript(Base):
    __tablename__ = "transcripts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    resource_id: Mapped[int] = mapped_column(Integer, ForeignKey("youtube_resources.id"), unique=True, nullable=False)
    full_text: Mapped[Optional[str]] = mapped_column(Text)
    is_sampled: Mapped[bool] = mapped_column(Boolean, default=False)
    sampled_chunks: Mapped[Optional[list]] = mapped_column(JSON)
    token_count: Mapped[Optional[int]] = mapped_column(Integer)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    resource: Mapped["YoutubeResource"] = relationship("YoutubeResource", back_populates="transcript")


class VideoTimestamp(Base):
    __tablename__ = "video_timestamps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    resource_id: Mapped[int] = mapped_column(Integer, ForeignKey("youtube_resources.id"), nullable=False)
    start_seconds: Mapped[int] = mapped_column(Integer, nullable=False)
    end_seconds: Mapped[Optional[int]] = mapped_column(Integer)
    label: Mapped[str] = mapped_column(String(200), nullable=False)
    relevance_score: Mapped[float] = mapped_column(Float, default=0.0)

    resource: Mapped["YoutubeResource"] = relationship("YoutubeResource", back_populates="timestamps")


class ProgressLog(Base):
    __tablename__ = "progress_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    goal_id: Mapped[int] = mapped_column(Integer, ForeignKey("learning_goals.id"), nullable=False)
    node_id: Mapped[int] = mapped_column(Integer, ForeignKey("skill_nodes.id"), nullable=False)
    resource_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("youtube_resources.id"), nullable=True)
    log_date: Mapped[date] = mapped_column(Date, nullable=False)
    minutes_spent: Mapped[int] = mapped_column(Integer, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(20), default="manual")  # manual/youtube_api
    youtube_watch_pct: Mapped[Optional[float]] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    goal: Mapped["LearningGoal"] = relationship("LearningGoal", back_populates="progress_logs")
    node: Mapped["SkillNode"] = relationship("SkillNode", back_populates="progress_logs")
