from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
from database import get_db


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    projects = db.query(models.Project).all()

    total_projects = len(projects)

    total_budget = sum(project.budget or 0 for project in projects)

    average_progress = 0
    if total_projects > 0:
        average_progress = round(
            sum(project.progress or 0 for project in projects) / total_projects
        )

    high_risk_projects = len(
        [project for project in projects if project.delay_risk == "High"]
    )

    completed_projects = len(
        [
            project
            for project in projects
            if project.status.lower() == "completed"
            or project.stage.lower() == "completed"
        ]
    )

    planning_projects = len(
        [
            project
            for project in projects
            if "planning" in project.status.lower()
            or "requirement" in project.stage.lower()
        ]
    )

    project_type_breakdown = {}

    for project in projects:
        project_type = project.project_type or "General"

        if project_type not in project_type_breakdown:
            project_type_breakdown[project_type] = 0

        project_type_breakdown[project_type] += 1

    return {
        "total_projects": total_projects,
        "total_budget": total_budget,
        "average_progress": average_progress,
        "high_risk_projects": high_risk_projects,
        "completed_projects": completed_projects,
        "planning_projects": planning_projects,
        "project_type_breakdown": project_type_breakdown,
    }