from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(
    prefix="/interior",
    tags=["Interior Design"]
)


@router.get("/designs", response_model=schemas.InteriorDesignsListResponse)
def read_interior_designs(db: Session = Depends(get_db)):
    designs = crud.get_interior_designs(db)

    return {
        "total": len(designs),
        "designs": designs
    }


@router.get("/designs/{design_id}", response_model=schemas.InteriorDesignResponse)
def read_interior_design(
    design_id: int,
    db: Session = Depends(get_db)
):
    design = crud.get_interior_design(db, design_id)

    if design is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interior design not found"
        )

    return design


@router.post(
    "/designs",
    response_model=schemas.InteriorDesignResponse,
    status_code=status.HTTP_201_CREATED
)
def create_interior_design(
    design_data: schemas.InteriorDesignCreate,
    db: Session = Depends(get_db)
):
    return crud.create_interior_design(db, design_data)


@router.put("/designs/{design_id}", response_model=schemas.InteriorDesignResponse)
def update_interior_design(
    design_id: int,
    design_data: schemas.InteriorDesignUpdate,
    db: Session = Depends(get_db)
):
    design = crud.update_interior_design(db, design_id, design_data)

    if design is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interior design not found"
        )

    return design


@router.delete("/designs/{design_id}", response_model=schemas.MessageResponse)
def delete_interior_design(
    design_id: int,
    db: Session = Depends(get_db)
):
    design = crud.delete_interior_design(db, design_id)

    if design is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interior design not found"
        )

    return {
        "message": "Interior design deleted successfully"
    }