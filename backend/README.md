# NOIR — FastAPI Backend Service

This directory contains the Python FastAPI backend service for NOIR Paris.

## Features
- **Pydantic v2 validation**: Type-safe validation of guest reservation requests (name, email, international phone number, guest count, dining slot, notes).
- **CORS enabled**: Ready for local Vite dev server (`http://localhost:3000` or `http://localhost:5173`).
- **Extensible architecture**: Structured cleanly for future PostgreSQL integration, transactional email dispatch (Sendgrid / Resend), and multi-restaurant management.

## Setup & Running Locally

1. Create and activate a virtual environment:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run with Uvicorn:
```bash
uvicorn app.main:app --reload --port 8000
```

4. Interactive API Documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints
- `POST /api/reservations` : Submit reservation request
- `GET /api/health` : Health check status
