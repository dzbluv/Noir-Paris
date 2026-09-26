import uuid
from typing import Dict, Any
from backend.app.schemas.reservation import ReservationCreate, ReservationResponse

class ReservationService:
    @staticmethod
    def process_reservation(payload: ReservationCreate) -> ReservationResponse:
        """
        Process reservation request.
        Architecture is ready for future PostgreSQL persistence, email delivery,
        and availability checks.
        """
        reservation_id = f"NOIR-{uuid.uuid4().hex[:7].upper()}"
        
        return ReservationResponse(
            success=True,
            message="Votre demande de réservation a été enregistrée avec succès.",
            reservation_id=reservation_id,
            data={
                "name": payload.name,
                "email": payload.email,
                "phone": payload.phone,
                "guests": payload.guests,
                "date": payload.date,
                "time": payload.time,
                "message": payload.message,
            }
        )

reservation_service = ReservationService()
