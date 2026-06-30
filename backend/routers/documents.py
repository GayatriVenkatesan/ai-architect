from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


def get_value(obj, *names, default=None):
    for name in names:
        if hasattr(obj, name):
            value = getattr(obj, name)
            if value is not None:
                return value

    return default


def document_to_dict(document):
    return {
        "id": get_value(document, "id"),
        "project_name": get_value(
            document,
            "project_name",
            "project",
            "name",
            default="Untitled Project",
        ),
        "document_title": get_value(
            document,
            "document_title",
            "title",
            "doc_title",
            "name",
            default="Untitled Document",
        ),
        "uploaded_by": get_value(
            document,
            "uploaded_by",
            "uploader",
            "created_by",
            default="Unknown User",
        ),
        "document_category": get_value(
            document,
            "document_category",
            "category",
            "type",
            default="General",
        ),
        "approval_status": get_value(
            document,
            "approval_status",
            "status",
            default="Pending",
        ),
        "file_name": get_value(
            document,
            "file_name",
            "filename",
            default=None,
        ),
        "file_url": get_value(
            document,
            "file_url",
            "url",
            "link",
            default=None,
        ),
        "notes": get_value(
            document,
            "notes",
            "description",
            default=None,
        ),
        "created_at": get_value(document, "created_at", default=None),
    }


def set_document_value(document, schema_name, value):
    field_map = {
        "project_name": ["project_name", "project", "name"],
        "document_title": ["document_title", "title", "doc_title", "name"],
        "uploaded_by": ["uploaded_by", "uploader", "created_by"],
        "document_category": ["document_category", "category", "type"],
        "approval_status": ["approval_status", "status"],
        "file_name": ["file_name", "filename"],
        "file_url": ["file_url", "url", "link"],
        "notes": ["notes", "description"],
    }

    possible_model_fields = field_map.get(schema_name, [schema_name])

    for model_field in possible_model_fields:
        if hasattr(document, model_field):
            setattr(document, model_field, value)
            return


@router.get("", response_model=schemas.DocumentsListResponse)
def read_documents(db: Session = Depends(get_db)):
    documents = (
        db.query(models.Document)
        .order_by(models.Document.id.desc())
        .all()
    )

    document_list = [document_to_dict(document) for document in documents]

    return {
        "total": len(document_list),
        "documents": document_list,
    }


@router.get("/{document_id}", response_model=schemas.DocumentResponse)
def read_document_by_id(
    document_id: int,
    db: Session = Depends(get_db),
):
    document = (
        db.query(models.Document)
        .filter(models.Document.id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return document_to_dict(document)


@router.post("", response_model=schemas.DocumentResponse)
def create_new_document(
    document_data: schemas.DocumentCreate,
    db: Session = Depends(get_db),
):
    new_document = models.Document()

    set_document_value(new_document, "project_name", document_data.project_name)
    set_document_value(
        new_document,
        "document_title",
        document_data.document_title,
    )
    set_document_value(new_document, "uploaded_by", document_data.uploaded_by)
    set_document_value(
        new_document,
        "document_category",
        document_data.document_category,
    )
    set_document_value(
        new_document,
        "approval_status",
        document_data.approval_status,
    )
    set_document_value(new_document, "file_name", document_data.file_name)
    set_document_value(new_document, "file_url", document_data.file_url)
    set_document_value(new_document, "notes", document_data.notes)

    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    return document_to_dict(new_document)


@router.put("/{document_id}", response_model=schemas.DocumentResponse)
def update_existing_document(
    document_id: int,
    document_data: schemas.DocumentUpdate,
    db: Session = Depends(get_db),
):
    document = (
        db.query(models.Document)
        .filter(models.Document.id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    update_data = document_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        set_document_value(document, key, value)

    db.commit()
    db.refresh(document)

    return document_to_dict(document)


@router.delete("/{document_id}")
def delete_existing_document(
    document_id: int,
    db: Session = Depends(get_db),
):
    document = (
        db.query(models.Document)
        .filter(models.Document.id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully",
    }