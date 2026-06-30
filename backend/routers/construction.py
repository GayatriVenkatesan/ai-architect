from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db


router = APIRouter(
    prefix="/construction",
    tags=["Construction Monitoring"],
)


def get_value(obj, *names, default=None):
    for name in names:
        if hasattr(obj, name):
            value = getattr(obj, name)
            if value is not None:
                return value

    return default


def construction_update_to_dict(update):
    return {
        "id": get_value(update, "id"),
        "project_name": get_value(
            update,
            "project_name",
            "project",
            "name",
            default="Untitled Project",
        ),
        "site_location": get_value(
            update,
            "site_location",
            "location",
            default="Not specified",
        ),
        "construction_stage": get_value(
            update,
            "construction_stage",
            "stage",
            default="Planning",
        ),
        "progress_percentage": get_value(
            update,
            "progress_percentage",
            "progress",
            default=0,
        ),
        "material_status": get_value(
            update,
            "material_status",
            "materials",
            default="Available",
        ),
        "safety_status": get_value(
            update,
            "safety_status",
            "safety",
            default="Safe",
        ),
        "issue_severity": get_value(
            update,
            "issue_severity",
            "severity",
            "risk_level",
            default="Low",
        ),
        "inspector_name": get_value(
            update,
            "inspector_name",
            "inspector",
            default="Site Engineer",
        ),
        "observation_notes": get_value(
            update,
            "observation_notes",
            "notes",
            "description",
            default="No observation notes added.",
        ),
        "ai_monitoring_summary": get_value(
            update,
            "ai_monitoring_summary",
            "ai_summary",
            "summary",
            default="Site update recorded successfully.",
        ),
        "created_at": get_value(update, "created_at", default=None),
    }


def set_update_value(update, schema_name, value):
    field_map = {
        "project_name": ["project_name", "project", "name"],
        "site_location": ["site_location", "location"],
        "construction_stage": ["construction_stage", "stage"],
        "progress_percentage": ["progress_percentage", "progress"],
        "material_status": ["material_status", "materials"],
        "safety_status": ["safety_status", "safety"],
        "issue_severity": ["issue_severity", "severity", "risk_level"],
        "inspector_name": ["inspector_name", "inspector"],
        "observation_notes": ["observation_notes", "notes", "description"],
        "ai_monitoring_summary": ["ai_monitoring_summary", "ai_summary", "summary"],
    }

    possible_model_fields = field_map.get(schema_name, [schema_name])

    for model_field in possible_model_fields:
        if hasattr(update, model_field):
            setattr(update, model_field, value)
            return


@router.get("/updates", response_model=schemas.ConstructionUpdatesListResponse)
def read_construction_updates(db: Session = Depends(get_db)):
    updates = (
        db.query(models.ConstructionUpdate)
        .order_by(models.ConstructionUpdate.id.desc())
        .all()
    )

    update_list = [construction_update_to_dict(update) for update in updates]

    return {
        "total": len(update_list),
        "updates": update_list,
        "construction_updates": update_list,
    }


@router.get(
    "/updates/{update_id}",
    response_model=schemas.ConstructionUpdateResponse,
)
def read_construction_update_by_id(
    update_id: int,
    db: Session = Depends(get_db),
):
    update = (
        db.query(models.ConstructionUpdate)
        .filter(models.ConstructionUpdate.id == update_id)
        .first()
    )

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Construction update not found",
        )

    return construction_update_to_dict(update)


@router.post(
    "/updates",
    response_model=schemas.ConstructionUpdateResponse,
)
def create_new_construction_update(
    update_data: schemas.ConstructionUpdateCreate,
    db: Session = Depends(get_db),
):
    new_update = models.ConstructionUpdate()

    set_update_value(new_update, "project_name", update_data.project_name)
    set_update_value(new_update, "site_location", update_data.site_location)
    set_update_value(
        new_update,
        "construction_stage",
        update_data.construction_stage,
    )
    set_update_value(
        new_update,
        "progress_percentage",
        update_data.progress_percentage,
    )
    set_update_value(new_update, "material_status", update_data.material_status)
    set_update_value(new_update, "safety_status", update_data.safety_status)
    set_update_value(new_update, "issue_severity", update_data.issue_severity)
    set_update_value(new_update, "inspector_name", update_data.inspector_name)
    set_update_value(
        new_update,
        "observation_notes",
        update_data.observation_notes,
    )

    ai_summary = update_data.ai_monitoring_summary

    if not ai_summary:
        ai_summary = (
            f"{update_data.project_name} is currently in the "
            f"{update_data.construction_stage} stage with "
            f"{update_data.progress_percentage}% progress. "
            f"Material status is {update_data.material_status}, safety status is "
            f"{update_data.safety_status}, and issue severity is "
            f"{update_data.issue_severity}. Continue monitoring site safety, "
            "material usage, and work progress."
        )

    set_update_value(new_update, "ai_monitoring_summary", ai_summary)

    db.add(new_update)
    db.commit()
    db.refresh(new_update)

    return construction_update_to_dict(new_update)


@router.put(
    "/updates/{update_id}",
    response_model=schemas.ConstructionUpdateResponse,
)
def update_existing_construction_update(
    update_id: int,
    update_data: schemas.ConstructionUpdateUpdate,
    db: Session = Depends(get_db),
):
    update = (
        db.query(models.ConstructionUpdate)
        .filter(models.ConstructionUpdate.id == update_id)
        .first()
    )

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Construction update not found",
        )

    update_values = update_data.model_dump(exclude_unset=True)

    for key, value in update_values.items():
        set_update_value(update, key, value)

    db.commit()
    db.refresh(update)

    return construction_update_to_dict(update)


@router.delete("/updates/{update_id}")
def delete_existing_construction_update(
    update_id: int,
    db: Session = Depends(get_db),
):
    update = (
        db.query(models.ConstructionUpdate)
        .filter(models.ConstructionUpdate.id == update_id)
        .first()
    )

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Construction update not found",
        )

    db.delete(update)
    db.commit()

    return {
        "message": "Construction update deleted successfully",
    }