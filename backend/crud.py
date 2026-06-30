from sqlalchemy.orm import Session

import models
import schemas


default_projects = [
    {
        "name": "Luxury Villa Design - ECR Residence",
        "client": "Rohan Sharma",
        "project_type": "Villa",
        "location": "Chennai, Tamil Nadu",
        "status": "Design Review",
        "stage": "Design Planning",
        "progress": 72,
        "budget": 8500000,
        "deadline": "Aug 2026",
        "description": "Premium villa project with interior design and walkthrough support.",
        "delay_risk": "Medium",
        "client_satisfaction": 88,
    },
    {
        "name": "Hospital Building Design - Renuga Healthcare",
        "client": "Renuga Healthcare",
        "project_type": "Hospital",
        "location": "Coimbatore, Tamil Nadu",
        "status": "Planning",
        "stage": "Requirement Analysis",
        "progress": 46,
        "budget": 42000000,
        "deadline": "Dec 2026",
        "description": "Healthcare architecture project with patient flow and space planning.",
        "delay_risk": "High",
        "client_satisfaction": 82,
    },
    {
        "name": "Urban Galleria Shopping Mall",
        "client": "Urban Galleria Group",
        "project_type": "Mall",
        "location": "Bengaluru, Karnataka",
        "status": "Concept Design",
        "stage": "Design Planning",
        "progress": 38,
        "budget": 68000000,
        "deadline": "Mar 2027",
        "description": "Commercial mall design with retail zones and circulation planning.",
        "delay_risk": "Medium",
        "client_satisfaction": 86,
    },
    {
        "name": "Skyline Apartment Tower",
        "client": "Skyline Developers",
        "project_type": "Apartment",
        "location": "Hyderabad, Telangana",
        "status": "Design Development",
        "stage": "Interior Design",
        "progress": 58,
        "budget": 52000000,
        "deadline": "Jan 2027",
        "description": "High-rise residential apartment design with shared amenities.",
        "delay_risk": "Low",
        "client_satisfaction": 91,
    },
    {
        "name": "Smart Campus Academic Block",
        "client": "SVCE Campus",
        "project_type": "Campus",
        "location": "Sriperumbudur, Tamil Nadu",
        "status": "Approval Pending",
        "stage": "Final Review",
        "progress": 63,
        "budget": 36000000,
        "deadline": "Nov 2026",
        "description": "Smart academic campus block with classrooms, labs, and open spaces.",
        "delay_risk": "Medium",
        "client_satisfaction": 89,
    },
    {
        "name": "Commercial Office Building - Nova Tech Park",
        "client": "Nova Tech Park",
        "project_type": "Office",
        "location": "Chennai, Tamil Nadu",
        "status": "Construction Monitoring",
        "stage": "Construction Monitoring",
        "progress": 81,
        "budget": 74000000,
        "deadline": "Sep 2026",
        "description": "Modern office building with workspace planning and monitoring support.",
        "delay_risk": "Low",
        "client_satisfaction": 94,
    },
]


def seed_default_projects(db: Session):
    project_count = db.query(models.Project).count()

    if project_count > 0:
        return

    for project_data in default_projects:
        project = models.Project(**project_data)
        db.add(project)

    db.commit()


def get_projects(db: Session):
    return db.query(models.Project).order_by(models.Project.id.desc()).all()


def get_project(db: Session, project_id: int):
    return (
        db.query(models.Project)
        .filter(models.Project.id == project_id)
        .first()
    )


def create_project(db: Session, project_data: schemas.ProjectCreate):
    new_project = models.Project(**project_data.model_dump())
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


def update_project(
    db: Session,
    project_id: int,
    project_data: schemas.ProjectUpdate
):
    project = get_project(db, project_id)

    if project is None:
        return None

    update_data = project_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return project


def delete_project(db: Session, project_id: int):
    project = get_project(db, project_id)

    if project is None:
        return None

    db.delete(project)
    db.commit()

    return project


def analyze_requirement_text(requirement_text: str):
    text = requirement_text.lower()

    key_points = []

    if "parking" in text:
        key_points.append("Parking space required")

    if "garden" in text or "landscape" in text:
        key_points.append("Landscape or garden area required")

    if "smart" in text or "automation" in text:
        key_points.append("Smart automation features required")

    if "solar" in text or "sustainable" in text:
        key_points.append("Sustainable design elements required")

    if "budget" in text or "low cost" in text:
        key_points.append("Budget optimization required")

    if "modern" in text:
        key_points.append("Modern architectural style preferred")

    if not key_points:
        key_points.append("General architecture requirements captured")

    risk_notes = "No major risk detected."

    if "urgent" in text or "quick" in text or "fast" in text:
        risk_notes = "Timeline pressure detected. Project scheduling should be reviewed."

    if "low cost" in text or "cheap" in text:
        risk_notes = "Budget constraint detected. Material and design choices need careful planning."

    priority_level = "Medium"

    if "urgent" in text or "hospital" in text or "safety" in text:
        priority_level = "High"
    elif "simple" in text or "basic" in text:
        priority_level = "Low"

    ai_summary = (
        "Requirement analysis completed. The client needs have been converted "
        "into structured design priorities for architecture planning."
    )

    return {
        "priority_level": priority_level,
        "ai_summary": ai_summary,
        "key_requirements": ", ".join(key_points),
        "risk_notes": risk_notes,
    }


def create_requirement_analysis(
    db: Session,
    requirement_data: schemas.RequirementAnalysisCreate
):
    analysis_result = analyze_requirement_text(
        requirement_data.requirement_text
    )

    new_analysis = models.RequirementAnalysis(
        client_name=requirement_data.client_name,
        project_type=requirement_data.project_type,
        requirement_text=requirement_data.requirement_text,
        estimated_budget=requirement_data.estimated_budget,
        estimated_timeline=requirement_data.estimated_timeline,
        priority_level=analysis_result["priority_level"],
        ai_summary=analysis_result["ai_summary"],
        key_requirements=analysis_result["key_requirements"],
        risk_notes=analysis_result["risk_notes"],
    )

    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)

    return new_analysis


def get_requirement_analyses(db: Session):
    return (
        db.query(models.RequirementAnalysis)
        .order_by(models.RequirementAnalysis.id.desc())
        .all()
    )


def get_requirement_analysis(db: Session, analysis_id: int):
    return (
        db.query(models.RequirementAnalysis)
        .filter(models.RequirementAnalysis.id == analysis_id)
        .first()
    )


def generate_interior_suggestions(design_data: schemas.InteriorDesignCreate):
    suggestions = []

    style = (design_data.design_style or "").lower()
    room_type = (design_data.room_type or "").lower()
    palette = (design_data.color_palette or "").lower()

    if "modern" in style:
        suggestions.append("Use clean lines, minimal furniture, and hidden storage.")

    if "luxury" in style:
        suggestions.append("Add premium lighting, marble finishes, and rich textures.")

    if "minimal" in style:
        suggestions.append("Use open space, simple furniture, and limited decor.")

    if "living" in room_type:
        suggestions.append("Prioritize comfortable seating and a clear focal wall.")

    if "bedroom" in room_type:
        suggestions.append("Use warm lighting, soft textures, and calming colors.")

    if "kitchen" in room_type:
        suggestions.append("Focus on workflow, storage, ventilation, and durable materials.")

    if "neutral" in palette:
        suggestions.append("Neutral colors can make the space look larger and timeless.")

    if "dark" in palette:
        suggestions.append("Use layered lighting to balance darker tones.")

    if not suggestions:
        suggestions.append(
            "Create a balanced interior layout based on function, comfort, and client preference."
        )

    return " ".join(suggestions)


def get_interior_designs(db: Session):
    return (
        db.query(models.InteriorDesign)
        .order_by(models.InteriorDesign.id.desc())
        .all()
    )


def get_interior_design(db: Session, design_id: int):
    return (
        db.query(models.InteriorDesign)
        .filter(models.InteriorDesign.id == design_id)
        .first()
    )


def create_interior_design(
    db: Session,
    design_data: schemas.InteriorDesignCreate
):
    ai_suggestions = generate_interior_suggestions(design_data)

    new_design = models.InteriorDesign(
        project_name=design_data.project_name,
        room_type=design_data.room_type,
        design_style=design_data.design_style,
        color_palette=design_data.color_palette,
        material_preferences=design_data.material_preferences,
        budget_range=design_data.budget_range,
        walkthrough_url=design_data.walkthrough_url,
        ai_suggestions=ai_suggestions,
    )

    db.add(new_design)
    db.commit()
    db.refresh(new_design)

    return new_design


def update_interior_design(
    db: Session,
    design_id: int,
    design_data: schemas.InteriorDesignUpdate
):
    design = get_interior_design(db, design_id)

    if design is None:
        return None

    update_data = design_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(design, field, value)

    db.commit()
    db.refresh(design)

    return design


def delete_interior_design(db: Session, design_id: int):
    design = get_interior_design(db, design_id)

    if design is None:
        return None

    db.delete(design)
    db.commit()

    return design


def generate_construction_risk_summary(
    update_data: schemas.ConstructionUpdateCreate
):
    risks = []

    issue_severity = (update_data.issue_severity or "").lower()
    material_status = (update_data.material_status or "").lower()
    safety_status = (update_data.safety_status or "").lower()
    progress_percent = update_data.progress_percent or 0

    if issue_severity == "high":
        risks.append(
            "High severity site issue detected. Immediate project manager review is required."
        )

    if "delay" in material_status or "shortage" in material_status:
        risks.append(
            "Material availability risk detected. Procurement follow-up is required."
        )

    if "unsafe" in safety_status or "risk" in safety_status:
        risks.append(
            "Safety concern detected. Site safety inspection should be prioritized."
        )

    if progress_percent < 30:
        risks.append(
            "Project is still in early construction progress. Monitor schedule closely."
        )

    if progress_percent >= 80:
        risks.append(
            "Project is nearing completion. Final inspection and handover checklist should be prepared."
        )

    if not risks:
        risks.append("Construction update looks stable. No major risk detected.")

    return " ".join(risks)


def get_construction_updates(db: Session):
    return (
        db.query(models.ConstructionUpdate)
        .order_by(models.ConstructionUpdate.id.desc())
        .all()
    )


def get_construction_update(db: Session, update_id: int):
    return (
        db.query(models.ConstructionUpdate)
        .filter(models.ConstructionUpdate.id == update_id)
        .first()
    )


def create_construction_update(
    db: Session,
    update_data: schemas.ConstructionUpdateCreate
):
    ai_risk_summary = generate_construction_risk_summary(update_data)

    new_update = models.ConstructionUpdate(
        project_name=update_data.project_name,
        site_location=update_data.site_location,
        work_stage=update_data.work_stage,
        progress_percent=update_data.progress_percent,
        material_status=update_data.material_status,
        safety_status=update_data.safety_status,
        issue_severity=update_data.issue_severity,
        issue_notes=update_data.issue_notes,
        inspector_name=update_data.inspector_name,
        ai_risk_summary=ai_risk_summary,
    )

    db.add(new_update)
    db.commit()
    db.refresh(new_update)

    return new_update


def update_construction_update(
    db: Session,
    update_id: int,
    update_data: schemas.ConstructionUpdateUpdate
):
    construction_update = get_construction_update(db, update_id)

    if construction_update is None:
        return None

    update_values = update_data.model_dump(exclude_unset=True)

    for field, value in update_values.items():
        setattr(construction_update, field, value)

    db.commit()
    db.refresh(construction_update)

    return construction_update


def delete_construction_update(db: Session, update_id: int):
    construction_update = get_construction_update(db, update_id)

    if construction_update is None:
        return None

    db.delete(construction_update)
    db.commit()

    return construction_update


def get_documents(db: Session):
    return (
        db.query(models.Document)
        .order_by(models.Document.id.desc())
        .all()
    )


def get_document(db: Session, document_id: int):
    return (
        db.query(models.Document)
        .filter(models.Document.id == document_id)
        .first()
    )


def create_document(
    db: Session,
    document_data: schemas.DocumentCreate
):
    new_document = models.Document(**document_data.model_dump())

    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    return new_document


def update_document(
    db: Session,
    document_id: int,
    document_data: schemas.DocumentUpdate
):
    document = get_document(db, document_id)

    if document is None:
        return None

    update_data = document_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(document, field, value)

    db.commit()
    db.refresh(document)

    return document


def delete_document(db: Session, document_id: int):
    document = get_document(db, document_id)

    if document is None:
        return None

    db.delete(document)
    db.commit()

    return document


def generate_feedback_sentiment_summary(
    feedback_data: schemas.ClientFeedbackCreate
):
    rating = feedback_data.rating or 0
    feedback_text = feedback_data.feedback_text.lower()

    notes = []

    if rating >= 4:
        notes.append("Client sentiment is positive.")

    if rating == 3:
        notes.append("Client sentiment is neutral and may need follow-up.")

    if rating <= 2:
        notes.append("Client sentiment is negative. Immediate follow-up is recommended.")

    if "delay" in feedback_text or "late" in feedback_text:
        notes.append("Client mentioned delay concerns.")

    if "design" in feedback_text:
        notes.append("Feedback is related to design quality or design changes.")

    if "budget" in feedback_text or "cost" in feedback_text:
        notes.append("Client mentioned budget or cost concerns.")

    if "approve" in feedback_text or "approved" in feedback_text:
        notes.append("Client approval signal detected.")

    if not notes:
        notes.append("Feedback captured. No specific issue detected.")

    return " ".join(notes)


def get_client_feedback_list(db: Session):
    return (
        db.query(models.ClientFeedback)
        .order_by(models.ClientFeedback.id.desc())
        .all()
    )


def get_client_feedback(db: Session, feedback_id: int):
    return (
        db.query(models.ClientFeedback)
        .filter(models.ClientFeedback.id == feedback_id)
        .first()
    )


def create_client_feedback(
    db: Session,
    feedback_data: schemas.ClientFeedbackCreate
):
    sentiment_summary = generate_feedback_sentiment_summary(feedback_data)

    new_feedback = models.ClientFeedback(
        project_name=feedback_data.project_name,
        client_name=feedback_data.client_name,
        rating=feedback_data.rating,
        feedback_text=feedback_data.feedback_text,
        approval_status=feedback_data.approval_status,
        response_note=feedback_data.response_note,
        sentiment_summary=sentiment_summary,
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return new_feedback


def update_client_feedback(
    db: Session,
    feedback_id: int,
    feedback_data: schemas.ClientFeedbackUpdate
):
    feedback = get_client_feedback(db, feedback_id)

    if feedback is None:
        return None

    update_data = feedback_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(feedback, field, value)

    db.commit()
    db.refresh(feedback)

    return feedback


def delete_client_feedback(db: Session, feedback_id: int):
    feedback = get_client_feedback(db, feedback_id)

    if feedback is None:
        return None

    db.delete(feedback)
    db.commit()

    return feedback
# -------------------- Floor Plan CRUD --------------------

def get_floor_plans(db: Session):
    return db.query(models.FloorPlan).order_by(models.FloorPlan.id.desc()).all()


def get_floor_plan_by_id(db: Session, floor_plan_id: int):
    return (
        db.query(models.FloorPlan)
        .filter(models.FloorPlan.id == floor_plan_id)
        .first()
    )


def create_floor_plan(db: Session, floor_plan_data: schemas.FloorPlanCreate):
    ai_summary = floor_plan_data.ai_summary

    if not ai_summary:
        ai_summary = (
            f"The {floor_plan_data.floor_level} plan for "
            f"{floor_plan_data.project_name} includes "
            f"{floor_plan_data.room_count} rooms across {floor_plan_data.total_area}. "
            f"The plan is currently marked as {floor_plan_data.plan_status}. "
            "The layout should be reviewed for circulation, ventilation, space usage, "
            "and functional zoning."
        )

    new_floor_plan = models.FloorPlan(
        project_name=floor_plan_data.project_name,
        client_name=floor_plan_data.client_name,
        floor_level=floor_plan_data.floor_level,
        plan_title=floor_plan_data.plan_title,
        room_count=floor_plan_data.room_count,
        total_area=floor_plan_data.total_area,
        plan_status=floor_plan_data.plan_status,
        design_notes=floor_plan_data.design_notes,
        ai_summary=ai_summary,
    )

    db.add(new_floor_plan)
    db.commit()
    db.refresh(new_floor_plan)

    return new_floor_plan


def update_floor_plan(
    db: Session,
    floor_plan_id: int,
    floor_plan_data: schemas.FloorPlanUpdate,
):
    floor_plan = get_floor_plan_by_id(db, floor_plan_id)

    if not floor_plan:
        return None

    update_data = floor_plan_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(floor_plan, key, value)

    db.commit()
    db.refresh(floor_plan)

    return floor_plan


def delete_floor_plan(db: Session, floor_plan_id: int):
    floor_plan = get_floor_plan_by_id(db, floor_plan_id)

    if not floor_plan:
        return None

    db.delete(floor_plan)
    db.commit()

    return floor_plan