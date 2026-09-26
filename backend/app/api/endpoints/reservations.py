from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.reservation import ReservationCreate, ReservationResponse
from backend.app.services.reservation_service import reservation_service

router = APIRouter()

@router.post(
    "/reservations",
    response_model=ReservationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a reservation request for NOIR"
)
async def create_reservation(reservation_in: ReservationCreate):
    """
    Submits a reservation request for NOIR Paris.
    Validates name, email, phone, guest count (1-12), date, time, and dietary notes.
    """
    try:
        response = reservation_service.process_reservation(reservation_in)
        return response
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while recording the reservation."
        )

@router.get("/health", summary="Health check endpoint")
async def health_check():
    return {"status": "ok", "service": "NOIR Restaurant API", "location": "Paris"}
