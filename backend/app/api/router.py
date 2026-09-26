from fastapi import APIRouter
from backend.app.api.endpoints import reservations

api_router = APIRouter()
api_router.include_router(reservations.router, tags=["reservations"])
