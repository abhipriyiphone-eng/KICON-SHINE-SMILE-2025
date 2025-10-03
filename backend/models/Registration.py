from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional
from datetime import datetime
from enum import Enum
import uuid

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class Specialty(str, Enum):
    DERMATOLOGY = "dermatology"
    DENTISTRY = "dentistry"
    COSMETOLOGY = "cosmetology"
    OTHER = "other"

class FoodPreference(str, Enum):
    VEGETARIAN = "vegetarian"
    NON_VEGETARIAN = "non-vegetarian"
    BOTH = "both"

class RegistrationStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    UNPAID = "unpaid"
    ADVANCE_PAID = "advance_paid"
    FULL_PAID = "full_paid"

class Interest(str, Enum):
    DENTAL_EQUIPMENT = "Dental Equipment"
    SKINCARE_DEVICES = "Skincare Devices"
    COSMETIC_PRODUCTS = "Cosmetic Products"

class RegistrationCreate(BaseModel):
    # Personal Information
    fullName: str = Field(..., min_length=2, max_length=100)
    gender: Gender
    dateOfBirth: datetime
    nationality: str = Field(..., min_length=2, max_length=50)
    passportNumber: str = Field(..., min_length=6, max_length=20)
    passportExpiry: datetime
    mobile: str = Field(..., pattern=r'^\+?\d{10,15}$')
    email: EmailStr
    
    # Professional Information
    specialty: Specialty
    yearsOfPractice: int = Field(..., ge=0, le=50)
    clinicName: str = Field(..., min_length=2, max_length=200)
    clinicAddress: str = Field(..., min_length=10, max_length=500)
    company: Optional[str] = Field(None, max_length=200)
    designation: str = Field(..., min_length=2, max_length=100)
    interests: List[Interest] = Field(default_factory=list)
    mou: bool = Field(default=False)
    
    # Preferences
    foodPreference: FoodPreference
    emergencyContact: str = Field(..., pattern=r'^\+?\d{10,15}$')
    allergies: Optional[str] = Field(None, max_length=500)
    specialAssistance: bool = Field(default=False)
    
    # Agreement
    termsAccepted: bool = Field(..., description="Must be true")

    @validator('dateOfBirth')
    def validate_age(cls, v):
        if v > datetime.now():
            raise ValueError('Date of birth cannot be in the future')
        
        age = (datetime.now() - v).days / 365.25
        if age < 18:
            raise ValueError('Registrant must be at least 18 years old')
        
        return v

    @validator('passportExpiry')
    def validate_passport_expiry(cls, v):
        if v <= datetime.now():
            raise ValueError('Passport must be valid (not expired)')
        
        # Passport should be valid for at least 6 months after the event
        event_date = datetime(2025, 11, 27)  # Last day of event
        min_expiry = datetime(2026, 5, 27)   # 6 months after event
        
        if v < min_expiry:
            raise ValueError('Passport must be valid for at least 6 months after the event end date')
        
        return v

    @validator('termsAccepted')
    def validate_terms(cls, v):
        if not v:
            raise ValueError('Terms and conditions must be accepted')
        return v

class Registration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    # Personal Information
    fullName: str
    gender: Gender
    dateOfBirth: datetime
    nationality: str
    passportNumber: str
    passportExpiry: datetime
    mobile: str
    email: EmailStr
    
    # Professional Information
    specialty: Specialty
    yearsOfPractice: int
    clinicName: str
    clinicAddress: str
    company: Optional[str] = None
    designation: str
    interests: List[Interest]
    mou: bool = False
    
    # Preferences
    foodPreference: FoodPreference
    emergencyContact: str
    allergies: Optional[str] = None
    specialAssistance: bool = False
    
    # Status & Metadata
    registrationStatus: RegistrationStatus = RegistrationStatus.PENDING
    paymentStatus: PaymentStatus = PaymentStatus.UNPAID
    termsAccepted: bool
    registrationDate: datetime = Field(default_factory=datetime.utcnow)
    lastUpdated: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class RegistrationUpdate(BaseModel):
    # Allow updating selected fields
    mobile: Optional[str] = Field(None, pattern=r'^\+?\d{10,15}$')
    clinicName: Optional[str] = Field(None, min_length=2, max_length=200)
    clinicAddress: Optional[str] = Field(None, min_length=10, max_length=500)
    company: Optional[str] = Field(None, max_length=200)
    designation: Optional[str] = Field(None, min_length=2, max_length=100)
    interests: Optional[List[Interest]] = None
    mou: Optional[bool] = None
    foodPreference: Optional[FoodPreference] = None
    emergencyContact: Optional[str] = Field(None, pattern=r'^\+?\d{10,15}$')
    allergies: Optional[str] = Field(None, max_length=500)
    specialAssistance: Optional[bool] = None
    registrationStatus: Optional[RegistrationStatus] = None
    paymentStatus: Optional[PaymentStatus] = None

class RegistrationResponse(BaseModel):
    success: bool
    data: Optional[Registration] = None
    message: str
    
class RegistrationListResponse(BaseModel):
    success: bool
    data: List[Registration]
    total: int
    message: str