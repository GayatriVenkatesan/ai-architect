# ArchiFlow AI

ArchiFlow AI is a full-stack AI-powered architecture workflow management platform designed to help architecture teams manage projects, client requirements, 2D floor plans, interior design concepts, 3D visualization, construction updates, documents, analytics, and client feedback in one centralized workspace.

This project is built as a modern full-stack MVP using Next.js, TypeScript, Tailwind CSS, FastAPI, SQLite, SQLAlchemy, Three.js, and Groq AI.

---

## Project Overview

Architecture projects usually involve multiple stages such as requirement collection, floor planning, interior design, document handling, construction monitoring, client feedback, and progress tracking. Managing all these workflows separately can become time-consuming and difficult for architecture teams.

ArchiFlow AI solves this problem by providing a centralized platform where architects, designers, project managers, and clients can manage architecture project workflows from one place. The platform also includes AI-powered assistance and 3D visualization features to improve project understanding and decision-making.

---

## Problem Statement

Architecture firms and design teams often struggle with:

* Scattered project information
* Manual tracking of client requirements
* Difficulty in organizing floor plan details
* Lack of centralized construction monitoring
* Unstructured client feedback
* Separate tools for documents, analytics, and visualization
* Limited AI assistance in project workflow planning

ArchiFlow AI addresses these issues by combining project management, AI assistance, 3D visualization, analytics, and backend database storage into a single full-stack web application.

---

## Objectives

The main objectives of ArchiFlow AI are:

* To manage architecture projects in a structured way
* To analyze and store client requirements
* To manage 2D floor plan records
* To support interior design workflow planning
* To provide 3D visualization for project concepts
* To monitor construction progress and site updates
* To store and manage project documents
* To collect and manage client feedback
* To provide analytics for project performance
* To integrate an AI chatbot for project-related assistance

---

## Key Features

### Project Management

Users can create, view, update, and manage architecture projects with details such as project name, client name, location, project type, budget, progress, and risk level.

### Requirement Analyzer

The Requirement Analyzer helps convert client requirements into structured project planning data. It stores client needs, project type, budget range, number of floors, architectural style, AI summary, key requirements, and risk notes.

### 2D Floor Plan Management

This module allows users to manage floor plan records including floor level, room count, total area, design notes, plan status, and AI-generated planning summaries.

### Interior Design Module

The Interior Design module helps organize room-based design ideas, design styles, color palettes, budget range, material preferences, walkthrough details, and AI suggestions.

### 3D Visualization

The 3D Visualization module provides interactive project visualization using Three.js and React Three Fiber. It helps users view architecture concepts in a more visual and engaging way.

### Construction Monitoring

This module helps track construction updates such as site location, construction stage, progress percentage, material status, safety status, issue severity, inspector name, observation notes, and AI monitoring summary.

### Document Management

Users can manage project-related documents such as design files, approval documents, floor plan documents, and other architecture project records.

### Clients and Feedback

The Clients module stores client feedback, approval status, rating, response notes, and sentiment summaries. This helps architecture teams track client satisfaction and requested changes.

### Analytics Dashboard

The Analytics Dashboard provides insights such as total projects, total budget, average progress, high-risk projects, planning projects, completed projects, and project type breakdown.

### AI Chatbot

The AI chatbot uses Groq AI to provide project-related assistance. Users can ask questions about architecture workflows, project planning, design suggestions, and module-related guidance.

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Three.js
* React Three Fiber

### Backend

* FastAPI
* Python
* SQLAlchemy
* SQLite

### AI Integration

* Groq API

### Database

* SQLite

### Development Tools

* VS Code
* Git
* GitHub

---

## Project Modules

The project includes the following main modules:

* Dashboard
* Projects
* Clients and Feedback
* Requirement Analyzer
* 2D Floor Plan
* Interior Design
* 3D Visualization
* Documents
* AI Chatbot
* Construction Monitoring
* Analytics
* Settings

---

## System Workflow

1. The user opens the ArchiFlow AI dashboard.
2. The user creates or manages architecture projects.
3. Client requirements are added and analyzed in the Requirement Analyzer module.
4. Floor plan details are stored in the 2D Floor Plan module.
5. Interior design concepts and suggestions are managed in the Interior Design module.
6. Project concepts can be viewed through the 3D Visualization module.
7. Construction progress is tracked through the Construction Monitoring module.
8. Project documents are stored in the Documents module.
9. Client feedback is collected and managed through the Clients module.
10. Analytics summarizes project performance, budget, progress, and risk.
11. The AI chatbot provides project-related assistance using Groq AI.

---

## Backend API Modules

The backend is built using FastAPI and contains APIs for:

* Projects
* Requirement Analyzer
* Interior Design
* Construction Monitoring
* Documents
* Clients and Feedback
* 2D Floor Plans
* Analytics
* AI Chatbot

---

## How to Run the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/GayatriVenkatesan/ai-architect.git
cd ai-architect
```

---

## Frontend Setup

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Run Frontend

```bash
npm run dev
```

Frontend will run at:

```bash
http://localhost:3000
```

---

## Backend Setup

### 4. Go to Backend Folder

```bash
cd backend
```

### 5. Create Virtual Environment

```bash
python -m venv venv
```

### 6. Activate Virtual Environment

For Windows:

```bash
venv\Scripts\activate
```

### 7. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 8. Run Backend Server

```bash
uvicorn main:app --reload
```

Backend will run at:

```bash
http://127.0.0.1:8000
```

Swagger API documentation will be available at:

```bash
http://127.0.0.1:8000/docs
```

---

## Environment Variables

Create a `.env` file inside the `backend` folder.

```env
GROQ_API_KEY=your_groq_api_key_here
```

Do not share or upload the real API key publicly.

---

## Important Notes

* The frontend and backend must run at the same time.
* Frontend runs on `http://localhost:3000`.
* Backend runs on `http://127.0.0.1:8000`.
* The `.env` file is ignored using `.gitignore` for security.
* SQLite is used as the local database for this MVP.



---

## Future Improvements

Possible future improvements include:

* User authentication and role-based access
* PostgreSQL database integration
* Real-time collaboration
* File upload support for documents
* Advanced AI-based design recommendations
* Improved 3D model generation
* Deployment to cloud platforms
* Project team management
* Notification system
* Advanced analytics and reporting

---

## Project Status

This project is completed as a full-stack MVP with frontend, backend, database integration, AI chatbot, analytics, and 3D visualization modules.

---

## Conclusion

ArchiFlow AI is a full-stack AI-powered architecture workflow platform that brings together project management, client requirement analysis, floor plan management, interior design planning, construction monitoring, document handling, feedback management, analytics, AI assistance, and 3D visualization into one centralized system.

This project demonstrates practical full-stack development skills, backend API integration, database handling, AI integration, and modern frontend design.
