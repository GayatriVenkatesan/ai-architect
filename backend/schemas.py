from datetime import datetime
from pydantic import BaseModel, ConfigDict


# -------------------- Common Response --------------------

class MessageResponse(BaseModel):
    message: str


# -------------------- Projects --------------------

class ProjectBase(BaseModel):
    project_name: str
    client_name: str
    location: str
    project_type: str | None = "Architecture"
    status: str | None = "Planning"
    budget: float | None = 0
    progress: int | None = 0
    risk_level: str | None = "Medium"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    project_name: str | None = None
    client_name: str | None = None
    location: str | None = None
    project_type: str | None = None
    status: str | None = None
    budget: float | None = None
    progress: int | None = None
    risk_level: str | None = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class ProjectsListResponse(BaseModel):
    total: int
    projects: list[ProjectResponse] = []


# -------------------- Analytics --------------------

class AnalyticsSummary(BaseModel):
    total_projects: int
    total_budget: float
    average_progress: float
    high_risk_projects: int


# -------------------- Requirement Analyzer --------------------

class RequirementAnalysisBase(BaseModel):
    client_name: str
    project_type: str
    plot_size: str
    budget_range: str
    number_of_floors: str
    architectural_style: str
    requirement_description: str
    ai_summary: str | None = None
    key_requirements: str | None = None
    risk_notes: str | None = None


class RequirementAnalysisCreate(RequirementAnalysisBase):
    pass


class RequirementAnalysisUpdate(BaseModel):
    client_name: str | None = None
    project_type: str | None = None
    plot_size: str | None = None
    budget_range: str | None = None
    number_of_floors: str | None = None
    architectural_style: str | None = None
    requirement_description: str | None = None
    ai_summary: str | None = None
    key_requirements: str | None = None
    risk_notes: str | None = None


class RequirementAnalysisResponse(RequirementAnalysisBase):
    id: int
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class RequirementsListResponse(BaseModel):
    total: int
    requirements: list[RequirementAnalysisResponse] = []


class RequirementAnalysesListResponse(BaseModel):
    total: int
    requirements: list[RequirementAnalysisResponse] = []
    analyses: list[RequirementAnalysisResponse] = []
    requirement_analyses: list[RequirementAnalysisResponse] = []


# -------------------- Interior Design --------------------

class InteriorDesignBase(BaseModel):
    project_name: str
    room_type: str
    design_style: str
    color_palette: str
    budget_range: str
    material_preferences: str | None = None
    special_needs: str | None = None
    walkthrough_url: str | None = None
    generated_summary: str | None = None
    ai_suggestions: str | None = None


class InteriorDesignCreate(InteriorDesignBase):
    pass


class InteriorDesignUpdate(BaseModel):
    project_name: str | None = None
    room_type: str | None = None
    design_style: str | None = None
    color_palette: str | None = None
    budget_range: str | None = None
    material_preferences: str | None = None
    special_needs: str | None = None
    walkthrough_url: str | None = None
    generated_summary: str | None = None
    ai_suggestions: str | None = None


class InteriorDesignResponse(InteriorDesignBase):
    id: int
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class InteriorDesignsListResponse(BaseModel):
    total: int
    designs: list[InteriorDesignResponse] = []
    interior_designs: list[InteriorDesignResponse] = []


# -------------------- Construction Monitoring --------------------

class ConstructionUpdateBase(BaseModel):
    project_name: str
    site_location: str
    construction_stage: str
    progress_percentage: int
    material_status: str
    safety_status: str
    issue_severity: str
    inspector_name: str
    observation_notes: str
    ai_monitoring_summary: str | None = None


class ConstructionUpdateCreate(ConstructionUpdateBase):
    pass


class ConstructionUpdateUpdate(BaseModel):
    project_name: str | None = None
    site_location: str | None = None
    construction_stage: str | None = None
    progress_percentage: int | None = None
    material_status: str | None = None
    safety_status: str | None = None
    issue_severity: str | None = None
    inspector_name: str | None = None
    observation_notes: str | None = None
    ai_monitoring_summary: str | None = None


class ConstructionUpdateResponse(ConstructionUpdateBase):
    id: int
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class ConstructionUpdatesListResponse(BaseModel):
    total: int
    updates: list[ConstructionUpdateResponse] = []
    construction_updates: list[ConstructionUpdateResponse] = []


# -------------------- Documents --------------------

class DocumentBase(BaseModel):
    project_name: str
    document_title: str
    uploaded_by: str
    document_category: str
    approval_status: str
    file_name: str | None = None
    file_url: str | None = None
    notes: str | None = None


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(BaseModel):
    project_name: str | None = None
    document_title: str | None = None
    uploaded_by: str | None = None
    document_category: str | None = None
    approval_status: str | None = None
    file_name: str | None = None
    file_url: str | None = None
    notes: str | None = None


class DocumentResponse(DocumentBase):
    id: int
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class DocumentsListResponse(BaseModel):
    total: int
    documents: list[DocumentResponse] = []


# -------------------- Client Feedback / Clients --------------------

class ClientFeedbackBase(BaseModel):
    project_name: str
    client_name: str
    rating: int
    feedback_text: str
    approval_status: str
    response_note: str | None = None
    sentiment_summary: str | None = None


class ClientFeedbackCreate(ClientFeedbackBase):
    pass


class ClientFeedbackUpdate(BaseModel):
    project_name: str | None = None
    client_name: str | None = None
    rating: int | None = None
    feedback_text: str | None = None
    approval_status: str | None = None
    response_note: str | None = None
    sentiment_summary: str | None = None


class ClientFeedbackResponse(ClientFeedbackBase):
    id: int
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class ClientFeedbackListResponse(BaseModel):
    total: int
    feedback: list[ClientFeedbackResponse] = []
    feedbacks: list[ClientFeedbackResponse] = []
    client_feedback: list[ClientFeedbackResponse] = []


# -------------------- 2D Floor Plans --------------------

class FloorPlanBase(BaseModel):
    project_name: str
    client_name: str
    floor_level: str
    plan_title: str
    room_count: int
    total_area: str
    plan_status: str
    design_notes: str
    ai_summary: str | None = None


class FloorPlanCreate(FloorPlanBase):
    pass


class FloorPlanUpdate(BaseModel):
    project_name: str | None = None
    client_name: str | None = None
    floor_level: str | None = None
    plan_title: str | None = None
    room_count: int | None = None
    total_area: str | None = None
    plan_status: str | None = None
    design_notes: str | None = None
    ai_summary: str | None = None


class FloorPlanResponse(FloorPlanBase):
    id: int
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class FloorPlansListResponse(BaseModel):
    total: int
    floor_plans: list[FloorPlanResponse] = []


# -------------------- Chatbot --------------------

class ChatbotRequest(BaseModel):
    message: str
    project_context: str | None = None


class ChatbotResponse(BaseModel):
    answer: str