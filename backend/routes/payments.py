from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import logging
from datetime import datetime

from models.Payment import (
    Payment,
    PaymentCreate,
    PaymentUpdate,
    PaymentInfo,
    PaymentResponse,
    PaymentListResponse,
    PaymentCalculation,
    BankDetails
)

# Get database connection
from database import db

router = APIRouter(prefix="/payments", tags=["payments"])
logger = logging.getLogger(__name__)

@router.get("/bank-details")
async def get_bank_details():
    """Get bank account details for payment"""
    
    try:
        bank_details = BankDetails()
        payment_calc = PaymentCalculation().calculate_amounts()
        
        return {
            "success": True,
            "data": {
                "bank_details": bank_details.dict(),
                "payment_calculation": payment_calc.dict(),
                "instructions": """
Please transfer the total amount to the bank account provided above.

Payment Process:
1. Calculate Total: USD $3,000 × Rs. 90 = Rs. 2,70,000
2. Add GST (5%): Rs. 13,500
3. Final Amount: Rs. 2,83,500 (to be transferred)

After Payment:
• Keep transaction receipt/screenshot
• Send payment proof with your Registration ID
• Payment verification within 24 hours
• Registration confirmed after payment verification
                """.strip()
            },
            "message": "Bank details retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error fetching bank details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch bank details")

@router.get("/info/{registration_id}")
async def get_payment_info(registration_id: str):
    """Get payment information for a specific registration"""
    
    try:
        # Check if registration exists
        registration = await db.registrations.find_one({"id": registration_id})
        if not registration:
            raise HTTPException(status_code=404, detail="Registration not found")
        
        # Get or create payment record
        payment_record = await db.payments.find_one({"registration_id": registration_id})
        
        if not payment_record:
            # Create new payment record
            payment = Payment(registration_id=registration_id)
            await db.payments.insert_one(payment.dict())
        else:
            payment = Payment(**payment_record)
        
        # Create payment info response
        payment_info = PaymentInfo(registration_id=registration_id)
        
        return PaymentResponse(
            success=True,
            data=payment,
            payment_info=payment_info,
            message="Payment information retrieved successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching payment info for {registration_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch payment information")

@router.post("", response_model=PaymentResponse)
async def create_payment_record(payment_data: PaymentCreate):
    """Create or update payment record for registration"""
    
    try:
        # Verify registration exists
        registration = await db.registrations.find_one({"id": payment_data.registration_id})
        if not registration:
            raise HTTPException(status_code=404, detail="Registration not found")
        
        # Check if payment record already exists
        existing_payment = await db.payments.find_one({"registration_id": payment_data.registration_id})
        
        if existing_payment:
            # Update existing payment
            update_data = {
                "transaction_id": payment_data.transaction_id,
                "payment_proof_url": payment_data.payment_proof_url,
                "payment_notes": payment_data.payment_notes,
                "last_updated": datetime.utcnow()
            }
            
            if payment_data.transaction_id:
                update_data["payment_date"] = datetime.utcnow()
            
            await db.payments.update_one(
                {"registration_id": payment_data.registration_id},
                {"$set": update_data}
            )
            
            # Fetch updated record
            updated_record = await db.payments.find_one({"registration_id": payment_data.registration_id})
            payment = Payment(**updated_record)
            
        else:
            # Create new payment record
            payment = Payment(**payment_data.dict())
            if payment_data.transaction_id:
                payment.payment_date = datetime.utcnow()
            
            await db.payments.insert_one(payment.dict())
        
        # Update registration payment status
        await db.registrations.update_one(
            {"id": payment_data.registration_id},
            {"$set": {"paymentStatus": "advance_paid" if payment_data.transaction_id else "unpaid"}}
        )
        
        logger.info(f"Payment record created/updated for registration: {payment_data.registration_id}")
        
        return PaymentResponse(
            success=True,
            data=payment,
            message="Payment record created/updated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating payment record: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment record")

@router.get("", response_model=PaymentListResponse)
async def get_all_payments(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    registration_id: Optional[str] = Query(None)
):
    """Get all payment records (admin endpoint)"""
    
    try:
        # Build query filter
        query = {}
        if status:
            query["payment_status"] = status
        if registration_id:
            query["registration_id"] = registration_id
        
        # Get total count
        total = await db.payments.count_documents(query)
        
        # Get payments with pagination
        cursor = db.payments.find(query).skip(skip).limit(limit).sort("created_date", -1)
        payments_data = await cursor.to_list(length=limit)
        
        # Convert to Payment objects
        payments = [Payment(**payment) for payment in payments_data]
        
        return PaymentListResponse(
            success=True,
            data=payments,
            total=total,
            message=f"Retrieved {len(payments)} payment records"
        )
        
    except Exception as e:
        logger.error(f"Error fetching payments: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch payment records")

@router.put("/{payment_id}", response_model=PaymentResponse)
async def update_payment(payment_id: str, update_data: PaymentUpdate):
    """Update payment status and details (admin endpoint)"""
    
    try:
        # Check if payment exists
        existing = await db.payments.find_one({"id": payment_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Payment record not found")
        
        # Prepare update data
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        
        if update_dict:
            update_dict["last_updated"] = datetime.utcnow()
            
            # If payment is being verified, set verification date
            if update_data.payment_status == "completed" and "verification_date" not in update_dict:
                update_dict["verification_date"] = datetime.utcnow()
            
            # Update in database
            result = await db.payments.update_one(
                {"id": payment_id},
                {"$set": update_dict}
            )
            
            if result.modified_count > 0:
                # Update corresponding registration payment status
                if update_data.payment_status:
                    registration_payment_status = {
                        "pending": "unpaid",
                        "partial": "advance_paid", 
                        "completed": "full_paid",
                        "failed": "unpaid"
                    }.get(update_data.payment_status, "unpaid")
                    
                    await db.registrations.update_one(
                        {"id": existing["registration_id"]},
                        {"$set": {"paymentStatus": registration_payment_status}}
                    )
                
                # Fetch updated payment
                updated_data = await db.payments.find_one({"id": payment_id})
                updated_payment = Payment(**updated_data)
                
                logger.info(f"Payment updated: {payment_id}")
                
                return PaymentResponse(
                    success=True,
                    data=updated_payment,
                    message="Payment updated successfully"
                )
            else:
                return PaymentResponse(
                    success=True,
                    data=Payment(**existing),
                    message="No changes were made"
                )
        else:
            return PaymentResponse(
                success=True,
                data=Payment(**existing),
                message="No update data provided"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating payment {payment_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update payment")

@router.get("/stats/summary")
async def get_payment_statistics():
    """Get payment statistics for admin dashboard"""
    
    try:
        # Total payments
        total_payments = await db.payments.count_documents({})
        
        # By status
        pending = await db.payments.count_documents({"payment_status": "pending"})
        partial = await db.payments.count_documents({"payment_status": "partial"})
        completed = await db.payments.count_documents({"payment_status": "completed"})
        failed = await db.payments.count_documents({"payment_status": "failed"})
        
        # Total amount calculations
        completed_payments = await db.payments.find({"payment_status": "completed"}).to_list(1000)
        total_amount_collected = sum(payment.get("total_inr_amount", 283500) for payment in completed_payments)
        
        pending_amount = pending * 283500  # Assuming standard amount
        
        return {
            "success": True,
            "data": {
                "total_payments": total_payments,
                "by_status": {
                    "pending": pending,
                    "partial": partial,
                    "completed": completed,
                    "failed": failed
                },
                "amounts": {
                    "per_registration_inr": 283500,
                    "per_registration_usd": 3000,
                    "total_collected_inr": total_amount_collected,
                    "pending_amount_inr": pending_amount,
                    "gst_per_registration": 13500,
                    "base_amount_per_registration": 270000
                },
                "bank_details": {
                    "account_number": "50200073668320",
                    "bank_name": "HDFC BANK",
                    "total_expected_if_full": 200 * 283500  # If all 200 slots filled
                }
            },
            "message": "Payment statistics retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error getting payment stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get payment statistics")