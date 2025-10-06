from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum
import uuid

class PaymentMethod(str, Enum):
    BANK_TRANSFER = "bank_transfer"
    ONLINE = "online"
    CASH = "cash"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PARTIAL = "partial"
    COMPLETED = "completed"
    FAILED = "failed"

class BankDetails(BaseModel):
    bank_name: str = "HDFC BANK"
    account_name: str = "ARYAN & DRAVIDIAN TRAD & CONSULT P LTD."
    account_number: str = "50200073668320"
    ifsc_code: str = "HDFC0001360"
    branch: str = "DLHMALVIYA NAGAR BRANCH"

class PaymentCalculation(BaseModel):
    usd_amount: float = 3000.0
    exchange_rate: float = 90.0  # 1 USD = 90 INR
    base_inr_amount: float = Field(default=270000.0)  # 3000 × 90
    gst_percentage: float = 5.0
    gst_amount: float = Field(default=13500.0)  # 5% of 270000
    total_inr_amount: float = Field(default=283500.0)  # 270000 + 13500
    
    def calculate_amounts(self):
        """Recalculate amounts based on current rates"""
        self.base_inr_amount = self.usd_amount * self.exchange_rate
        self.gst_amount = (self.base_inr_amount * self.gst_percentage) / 100
        self.total_inr_amount = self.base_inr_amount + self.gst_amount
        return self

class PaymentInfo(BaseModel):
    registration_id: str
    bank_details: BankDetails = Field(default_factory=BankDetails)
    payment_calculation: PaymentCalculation = Field(default_factory=PaymentCalculation)
    payment_instructions: str = Field(default="""
Please transfer the amount to the above bank account and send the payment proof to our team.
Payment Instructions:
1. Transfer Rs. 283,500 (including 5% GST) to the provided bank account
2. Keep the transaction receipt/screenshot
3. Send payment proof via email or WhatsApp to our team
4. Include your registration ID in the payment reference
5. Payment confirmation will be processed within 24 hours
    """.strip())

class Payment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    registration_id: str
    payment_method: PaymentMethod = PaymentMethod.BANK_TRANSFER
    payment_status: PaymentStatus = PaymentStatus.PENDING
    
    # Amount details
    usd_amount: float = 3000.0
    inr_base_amount: float = 270000.0
    gst_amount: float = 13500.0
    total_inr_amount: float = 283500.0
    
    # Payment tracking
    transaction_id: Optional[str] = None
    payment_proof_url: Optional[str] = None
    payment_date: Optional[datetime] = None
    verification_date: Optional[datetime] = None
    verified_by: Optional[str] = None
    
    # Bank details used
    bank_account_number: str = "50200073668320"
    bank_name: str = "HDFC BANK"
    
    # Timestamps
    created_date: datetime = Field(default_factory=datetime.utcnow)
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    
    # Notes
    payment_notes: Optional[str] = None
    admin_notes: Optional[str] = None

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class PaymentCreate(BaseModel):
    registration_id: str
    transaction_id: Optional[str] = None
    payment_proof_url: Optional[str] = None
    payment_notes: Optional[str] = None

class PaymentUpdate(BaseModel):
    payment_status: Optional[PaymentStatus] = None
    transaction_id: Optional[str] = None
    payment_proof_url: Optional[str] = None
    payment_date: Optional[datetime] = None
    verification_date: Optional[datetime] = None
    verified_by: Optional[str] = None
    admin_notes: Optional[str] = None

class PaymentResponse(BaseModel):
    success: bool
    data: Optional[Payment] = None
    payment_info: Optional[PaymentInfo] = None
    message: str

class PaymentListResponse(BaseModel):
    success: bool
    data: list[Payment]
    total: int
    message: str