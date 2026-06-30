from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db


router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


def get_value(obj, *names, default=None):
    for name in names:
        if hasattr(obj, name):
            value = getattr(obj, name)
            if value is not None:
                return value

    return default


def project_to_dict(project):
    return {
        "id": get_value(project, "id"),
        "project_name": get_value(
            project,
            "project_name",
            "name",
            "title",
            default="Untitled Project",
        ),
        "client_name": get_value(
            project,
            "client_name",
            "client",
            "customer_name",
            default="Unknown Client",
        ),
        "location": get_value(
            project,
            "location",
            "site_location",
            default="Not specified",
        ),
        "project_type": get_value(
            project,
            "project_type",
            "type",
            "category",
            default="Architecture",
        ),
        "status": get_value(project, "status", default="Planning"),
        "budget": get_value(project, "budget", default=0),
        "progress": get_value(project, "progress", default=0),
        "risk_level": get_value(
            project,
            "risk_level",
            "risk",
            default="Medium",
        ),
        "created_at": get_value(project, "created_at", default=None),
    }


def set_project_value(project, schema_name, value):
    field_map = {
        "project_name": ["project_name", "name", "title"],
        "client_name": ["client_name", "client", "customer_name"],
        "location": ["location", "site_location"],
        "project_type": ["project_type", "type", "category"],
        "status": ["status"],
        "budget": ["budget"],
        "progress": ["progress"],
        "risk_level": ["risk_level", "risk"],
    }

    possible_model_fields = field_map.get(schema_name, [schema_name])

    for model_field in possible_model_fields:
        if hasattr(project, model_field):
            setattr(project, model_field, value)
            return


@router.get("", response_model=schemas.ProjectsListResponse)
def read_projects(db: Session = Depends(get_db)):
    projects = db.query(models.Project).order_by(models.Project.id.desc()).all()

    project_list = [project_to_dict(project) for project in projects]

    return {
        "total": len(project_list),
        "projects": project_list,
    }


@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def read_project_by_id(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = (
        db.query(models.Project)
        .filter(models.Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return project_to_dict(project)


@router.post("", response_model=schemas.ProjectResponse)
def create_new_project(
    project_data: schemas.ProjectCreate,
    db: Session = Depends(get_db),
):
    new_project = models.Project()

    set_project_value(new_project, "project_name", project_data.project_name)
    set_project_value(new_project, "client_name", project_data.client_name)
    set_project_value(new_project, "location", project_data.location)
    set_project_value(new_project, "project_type", project_data.project_type)
    set_project_value(new_project, "status", project_data.status)
    set_project_value(new_project, "budget", project_data.budget)
    set_project_value(new_project, "progress", project_data.progress)
    set_project_value(new_project, "risk_level", project_data.risk_level)

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return project_to_dict(new_project)


@router.put("/{project_id}", response_model=schemas.ProjectResponse)
def update_existing_project(
    project_id: int,
    project_data: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
):
    project = (
        db.query(models.Project)
        .filter(models.Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    update_data = project_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        set_project_value(project, key, value)

    db.commit()
    db.refresh(project)

    return project_to_dict(project)


@router.delete("/{project_id}")
def delete_existing_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = (
        db.query(models.Project)
        .filter(models.Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully",
    }