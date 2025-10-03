from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional
from datetime import datetime
from enum import Enum
import uuid

class InquiryType(str, Enum):
    GENERAL = "general"
    REGISTRATION = "registration"
    ACCOMMODATION = "accommodation"
    TECHNICAL = "technical"

class InquiryStatus(str, Enum):
    OPEN = "open"
    RESPONDED = "responded"
    CLOSED = "closed"

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, pattern=r'^\+?\d{10,15}$')
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=1000)
    inquiryType: InquiryType = Field(default=InquiryType.GENERAL)

class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    inquiryType: InquiryType
    status: InquiryStatus = InquiryStatus.OPEN
    createdDate: datetime = Field(default_factory=datetime.utcnow)
    lastUpdated: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class ContactUpdate(BaseModel):
    status: Optional[InquiryStatus] = None
    
class ContactResponse(BaseModel):
    success: bool
    data: Optional[Contact] = None
    message: str
    
class ContactListResponse(BaseModel):
    success: bool
    data: list[Contact]
    total: int
    message: str