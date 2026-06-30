from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String, Text, Float

from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    client = Column(String, default="Not specified")
    project_type = Column(String, default="General")
    location = Column(String, default="Not specified")
    status = Column(String, default="Planning")
    stage = Column(String, default="Requirement Analysis")
    progress = Column(Integer, default=0)
    budget = Column(Integer, default=0)
    deadline = Column(String, default="Not set")
    description = Column(Text, nullable=True)
    delay_risk = Column(String, default="Low")
    client_satisfaction = Column(Integer, default=0)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )


class RequirementAnalysis(Base):
    __tablename__ = "requirement_analyses"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, default="Not specified")
    project_type = Column(String, default="General")
    requirement_text = Column(Text, nullable=False)
    estimated_budget = Column(Integer, default=0)
    estimated_timeline = Column(String, default="Not estimated")
    priority_level = Column(String, default="Medium")
    ai_summary = Column(Text, nullable=True)
    key_requirements = Column(Text, nullable=True)
    risk_notes = Column(Text, nullable=True)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )


class InteriorDesign(Base):
    __tablename__ = "interior_designs"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, default="Untitled Project")
    room_type = Column(String, default="Living Room")
    design_style = Column(String, default="Modern")
    color_palette = Column(String, default="Neutral")
    material_preferences = Column(Text, nullable=True)
    budget_range = Column(String, default="Not specified")
    walkthrough_url = Column(Text, nullable=True)
    ai_suggestions = Column(Text, nullable=True)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )


class ConstructionUpdate(Base):
    __tablename__ = "construction_updates"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, default="Untitled Project")
    site_location = Column(String, default="Not specified")
    work_stage = Column(String, default="Foundation")
    progress_percent = Column(Integer, default=0)
    material_status = Column(String, default="Available")
    safety_status = Column(String, default="Safe")
    issue_severity = Column(String, default="Low")
    issue_notes = Column(Text, nullable=True)
    inspector_name = Column(String, default="Not assigned")
    ai_risk_summary = Column(Text, nullable=True)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, default="Untitled Project")
    title = Column(String, nullable=False)
    document_type = Column(String, default="General")
    file_url = Column(Text, nullable=True)
    uploaded_by = Column(String, default="Admin")
    approval_status = Column(String, default="Pending")
    notes = Column(Text, nullable=True)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )


class ClientFeedback(Base):
    __tablename__ = "client_feedback"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, default="Untitled Project")
    client_name = Column(String, default="Not specified")
    rating = Column(Integer, default=0)
    feedback_text = Column(Text, nullable=False)
    approval_status = Column(String, default="Pending")
    response_note = Column(Text, nullable=True)
    sentiment_summary = Column(Text, nullable=True)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )
class FloorPlan(Base):
    __tablename__ = "floor_plans"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, nullable=False)
    client_name = Column(String, nullable=False)
    floor_level = Column(String, nullable=False)
    plan_title = Column(String, nullable=False)
    room_count = Column(Integer, nullable=False)
    total_area = Column(String, nullable=False)
    plan_status = Column(String, nullable=False)
    design_notes = Column(Text, nullable=False)
    ai_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)