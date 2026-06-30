from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import crud
import models
from database import Base, SessionLocal, engine
from routers import (
    analytics,
    chatbot,
    construction,
    documents,
    feedback,
    floor_plan,
    interior,
    projects,
    requirements,
)


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="ArchiFlow AI Backend",
    description="Backend API for ArchiFlow AI architecture workflow platform",
    version="1.0.0",
)


# CORS configuration for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    db = SessionLocal()

    try:
        crud.seed_default_projects(db)
    finally:
        db.close()


@app.get("/")
def read_root():
    return {
        "message": "Welcome to ArchiFlow AI Backend",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ArchiFlow AI Backend",
        "version": "1.0.0",
        "database": "SQLite connected",
    }


# Routers
app.include_router(projects.router)
app.include_router(analytics.router)
app.include_router(requirements.router)
app.include_router(interior.router)
app.include_router(construction.router)
app.include_router(documents.router)
app.include_router(feedback.router)
app.include_router(chatbot.router)
app.include_router(floor_plan.router)