from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db


router = APIRouter(
    prefix="/requirements",
    tags=["Requirement Analyzer"],
)


def get_requirement_model():
    if hasattr(models, "RequirementAnalysis"):
        return models.RequirementAnalysis

    if hasattr(models, "Requirement"):
        return models.Requirement

    raise RuntimeError(
        "No requirement model found. Expected RequirementAnalysis or Requirement in models.py"
    )


def get_value(obj, *names, default=None):
    for name in names:
        if hasattr(obj, name):
            value = getattr(obj, name)
            if value is not None:
                return value

    return default


def requirement_to_dict(requirement):
    return {
        "id": get_value(requirement, "id"),
        "client_name": get_value(
            requirement,
            "client_name",
            "client",
            "customer_name",
            default="Unknown Client",
        ),
        "project_type": get_value(
            requirement,
            "project_type",
            "type",
            "category",
            default="Architecture",
        ),
        "plot_size": get_value(
            requirement,
            "plot_size",
            "site_area",
            "area",
            default="Not specified",
        ),
        "budget_range": get_value(
            requirement,
            "budget_range",
            "budget",
            default="Not specified",
        ),
        "number_of_floors": get_value(
            requirement,
            "number_of_floors",
            "floors",
            "floor_count",
            default="Not specified",
        ),
        "architectural_style": get_value(
            requirement,
            "architectural_style",
            "style",
            "design_style",
            default="Modern",
        ),
        "requirement_description": get_value(
            requirement,
            "requirement_description",
            "description",
            "requirements",
            "notes",
            default="No requirement description added.",
        ),
        "ai_summary": get_value(
            requirement,
            "ai_summary",
            "summary",
            "generated_summary",
            default="Requirement analysis saved successfully.",
        ),
        "key_requirements": get_value(
            requirement,
            "key_requirements",
            "key_points",
            default="Functional planning, budget control, space usage, and client needs should be reviewed.",
        ),
        "risk_notes": get_value(
            requirement,
            "risk_notes",
            "risks",
            "risk_analysis",
            default="No major risk detected. Review budget, space constraints, and approval timeline.",
        ),
        "created_at": get_value(requirement, "created_at", default=None),
    }


def set_requirement_value(requirement, schema_name, value):
    field_map = {
        "client_name": ["client_name", "client", "customer_name"],
        "project_type": ["project_type", "type", "category"],
        "plot_size": ["plot_size", "site_area", "area"],
        "budget_range": ["budget_range", "budget"],
        "number_of_floors": ["number_of_floors", "floors", "floor_count"],
        "architectural_style": ["architectural_style", "style", "design_style"],
        "requirement_description": [
            "requirement_description",
            "description",
            "requirements",
            "notes",
        ],
        "ai_summary": ["ai_summary", "summary", "generated_summary"],
        "key_requirements": ["key_requirements", "key_points"],
        "risk_notes": ["risk_notes", "risks", "risk_analysis"],
    }

    possible_model_fields = field_map.get(schema_name, [schema_name])

    for model_field in possible_model_fields:
        if hasattr(requirement, model_field):
            setattr(requirement, model_field, value)
            return


@router.get("", response_model=schemas.RequirementsListResponse)
def read_requirements(db: Session = Depends(get_db)):
    RequirementModel = get_requirement_model()

    requirements = (
        db.query(RequirementModel)
        .order_by(RequirementModel.id.desc())
        .all()
    )

    requirement_list = [
        requirement_to_dict(requirement) for requirement in requirements
    ]

    return {
        "total": len(requirement_list),
        "requirements": requirement_list,
        "analyses": requirement_list,
        "requirement_analyses": requirement_list,
    }


@router.get("/{requirement_id}", response_model=schemas.RequirementAnalysisResponse)
def read_requirement_by_id(
    requirement_id: int,
    db: Session = Depends(get_db),
):
    RequirementModel = get_requirement_model()

    requirement = (
        db.query(RequirementModel)
        .filter(RequirementModel.id == requirement_id)
        .first()
    )

    if not requirement:
        raise HTTPException(
            status_code=404,
            detail="Requirement analysis not found",
        )

    return requirement_to_dict(requirement)


@router.post("/analyze", response_model=schemas.RequirementAnalysisResponse)
def create_requirement_analysis(
    requirement_data: schemas.RequirementAnalysisCreate,
    db: Session = Depends(get_db),
):
    RequirementModel = get_requirement_model()

    new_requirement = RequirementModel()

    set_requirement_value(
        new_requirement,
        "client_name",
        requirement_data.client_name,
    )
    set_requirement_value(
        new_requirement,
        "project_type",
        requirement_data.project_type,
    )
    set_requirement_value(
        new_requirement,
        "plot_size",
        requirement_data.plot_size,
    )
    set_requirement_value(
        new_requirement,
        "budget_range",
        requirement_data.budget_range,
    )
    set_requirement_value(
        new_requirement,
        "number_of_floors",
        requirement_data.number_of_floors,
    )
    set_requirement_value(
        new_requirement,
        "architectural_style",
        requirement_data.architectural_style,
    )
    set_requirement_value(
        new_requirement,
        "requirement_description",
        requirement_data.requirement_description,
    )

    ai_summary = requirement_data.ai_summary

    if not ai_summary:
        ai_summary = (
            f"The client requires a {requirement_data.project_type} project "
            f"with a plot size of {requirement_data.plot_size}, budget range "
            f"{requirement_data.budget_range}, and {requirement_data.number_of_floors}. "
            f"The preferred architectural style is "
            f"{requirement_data.architectural_style}."
        )

    key_requirements = requirement_data.key_requirements

    if not key_requirements:
        key_requirements = (
            "Space planning, client requirements, budget alignment, "
            "functional zoning, circulation, ventilation, and approval workflow "
            "should be reviewed."
        )

    risk_notes = requirement_data.risk_notes

    if not risk_notes:
        risk_notes = (
            "Check for budget mismatch, space constraints, approval delays, "
            "material availability, and design feasibility before final execution."
        )

    set_requirement_value(new_requirement, "ai_summary", ai_summary)
    set_requirement_value(new_requirement, "key_requirements", key_requirements)
    set_requirement_value(new_requirement, "risk_notes", risk_notes)

    db.add(new_requirement)
    db.commit()
    db.refresh(new_requirement)

    return requirement_to_dict(new_requirement)


@router.put("/{requirement_id}", response_model=schemas.RequirementAnalysisResponse)
def update_requirement_analysis(
    requirement_id: int,
    requirement_data: schemas.RequirementAnalysisUpdate,
    db: Session = Depends(get_db),
):
    RequirementModel = get_requirement_model()

    requirement = (
        db.query(RequirementModel)
        .filter(RequirementModel.id == requirement_id)
        .first()
    )

    if not requirement:
        raise HTTPException(
            status_code=404,
            detail="Requirement analysis not found",
        )

    update_data = requirement_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        set_requirement_value(requirement, key, value)

    db.commit()
    db.refresh(requirement)

    return requirement_to_dict(requirement)


@router.delete("/{requirement_id}")
def delete_requirement_analysis(
    requirement_id: int,
    db: Session = Depends(get_db),
):
    RequirementModel = get_requirement_model()

    requirement = (
        db.query(RequirementModel)
        .filter(RequirementModel.id == requirement_id)
        .first()
    )

    if not requirement:
        raise HTTPException(
            status_code=404,
            detail="Requirement analysis not found",
        )

    db.delete(requirement)
    db.commit()

    return {
        "message": "Requirement analysis deleted successfully",
    }