from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(
    prefix="/floor-plans",
    tags=["2D Floor Plans"],
)


@router.get("/")
def read_floor_plans(db: Session = Depends(get_db)):
    floor_plans = crud.get_floor_plans(db)

    return {
        "total": len(floor_plans),
        "floor_plans": floor_plans,
    }


@router.get("/{floor_plan_id}", response_model=schemas.FloorPlanResponse)
def read_floor_plan_by_id(
    floor_plan_id: int,
    db: Session = Depends(get_db),
):
    floor_plan = crud.get_floor_plan_by_id(db, floor_plan_id)

    if not floor_plan:
        raise HTTPException(
            status_code=404,
            detail="Floor plan not found",
        )

    return floor_plan


@router.post("/", response_model=schemas.FloorPlanResponse)
def create_new_floor_plan(
    floor_plan_data: schemas.FloorPlanCreate,
    db: Session = Depends(get_db),
):
    return crud.create_floor_plan(db, floor_plan_data)


@router.put("/{floor_plan_id}", response_model=schemas.FloorPlanResponse)
def update_existing_floor_plan(
    floor_plan_id: int,
    floor_plan_data: schemas.FloorPlanUpdate,
    db: Session = Depends(get_db),
):
    floor_plan = crud.update_floor_plan(
        db,
        floor_plan_id,
        floor_plan_data,
    )

    if not floor_plan:
        raise HTTPException(
            status_code=404,
            detail="Floor plan not found",
        )

    return floor_plan


@router.delete("/{floor_plan_id}")
def delete_existing_floor_plan(
    floor_plan_id: int,
    db: Session = Depends(get_db),
):
    floor_plan = crud.delete_floor_plan(db, floor_plan_id)

    if not floor_plan:
        raise HTTPException(
            status_code=404,
            detail="Floor plan not found",
        )

    return {
        "message": "Floor plan deleted successfully",
    }