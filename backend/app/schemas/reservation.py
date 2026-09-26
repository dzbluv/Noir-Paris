from pydantic import BaseModel, Field, field_validator
from typing import Optional
import re

class ReservationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full name of guest")
    email: str = Field(..., description="Email address for confirmation")
    phone: str = Field(..., min_length=6, max_length=25, description="Contact phone number")
    guests: int = Field(..., ge=1, le=12, description="Number of guests (1-12)")
    date: str = Field(..., description="Reservation date (YYYY-MM-DD)")
    time: str = Field(..., description="Seating time (e.g. 19:30)")
    message: Optional[str] = Field(None, max_length=500, description="Special requests or dietary notes")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(pattern, v):
            raise ValueError("Invalid email format.")
        return v.lower().strip()

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"[\s\-\(\)\.]", "", v)
        if len(cleaned) < 6:
            raise ValueError("Phone number must have at least 6 digits.")
        return v.strip()

class ReservationResponse(BaseModel):
    success: bool = True
    message: str = "Reservation request received."
    reservation_id: Optional[str] = None
    data: Optional[dict] = None
