from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(
    prefix="/feedback",
    tags=["Client Feedback"]
)


@router.get("", response_model=schemas.ClientFeedbackListResponse)
def read_feedback_list(db: Session = Depends(get_db)):
    feedback_list = crud.get_client_feedback_list(db)

    return {
        "total": len(feedback_list),
        "feedback": feedback_list
    }


@router.get("/{feedback_id}", response_model=schemas.ClientFeedbackResponse)
def read_feedback(
    feedback_id: int,
    db: Session = Depends(get_db)
):
    feedback = crud.get_client_feedback(db, feedback_id)

    if feedback is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client feedback not found"
        )

    return feedback


@router.post(
    "",
    response_model=schemas.ClientFeedbackResponse,
    status_code=status.HTTP_201_CREATED
)
def create_feedback(
    feedback_data: schemas.ClientFeedbackCreate,
    db: Session = Depends(get_db)
):
    return crud.create_client_feedback(db, feedback_data)


@router.put("/{feedback_id}", response_model=schemas.ClientFeedbackResponse)
def update_feedback(
    feedback_id: int,
    feedback_data: schemas.ClientFeedbackUpdate,
    db: Session = Depends(get_db)
):
    feedback = crud.update_client_feedback(db, feedback_id, feedback_data)

    if feedback is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client feedback not found"
        )

    return feedback


@router.delete("/{feedback_id}", response_model=schemas.MessageResponse)
def delete_feedback(
    feedback_id: int,
    db: Session = Depends(get_db)
):
    feedback = crud.delete_client_feedback(db, feedback_id)

    if feedback is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client feedback not found"
        )

    return {
        "message": "Client feedback deleted successfully"
    }