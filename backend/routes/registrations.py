from fastapi import APIRouter, HTTPException, Depends, Query
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
import os
from datetime import datetime
import logging

from models.Registration import (
    Registration, 
    RegistrationCreate, 
    RegistrationUpdate, 
    RegistrationResponse,
    RegistrationListResponse
)

# Get database connection
from server import db

router = APIRouter(prefix="/registrations", tags=["registrations"])
logger = logging.getLogger(__name__)

# Constants
MAX_REGISTRATIONS = 200
REGISTRATION_DEADLINE = datetime(2025, 10, 17, 23, 59, 59)

@router.post("", response_model=RegistrationResponse)
async def create_registration(registration_data: RegistrationCreate):
    """Create a new registration for KICON 2025"""
    
    try:
        # Check if registration deadline has passed
        if datetime.utcnow() > REGISTRATION_DEADLINE:
            raise HTTPException(
                status_code=400,
                detail="Registration deadline has passed. Registration closed on October 17, 2025."
            )
        
        # Check if email already exists
        existing_registration = await db.registrations.find_one({"email": registration_data.email})
        if existing_registration:
            raise HTTPException(
                status_code=400,
                detail="Email already registered. Please use a different email address or contact support."
            )
        
        # Check registration limit
        total_registrations = await db.registrations.count_documents({
            "registrationStatus": {"$ne": "cancelled"}
        })
        
        if total_registrations >= MAX_REGISTRATIONS:
            raise HTTPException(
                status_code=400,
                detail="Registration limit reached. Maximum 200 delegates allowed."
            )
        
        # Create registration object
        registration = Registration(**registration_data.dict())
        
        # Insert into database
        result = await db.registrations.insert_one(registration.dict())
        
        if result.inserted_id:
            logger.info(f"New registration created: {registration.email}")
            return RegistrationResponse(
                success=True,
                data=registration,
                message="Registration submitted successfully! You will receive a confirmation email shortly."
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create registration")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating registration: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error occurred")

@router.get("", response_model=RegistrationListResponse)
async def get_all_registrations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    status: Optional[str] = Query(None)
):
    """Get all registrations (admin endpoint)"""
    
    try:
        # Build query filter
        query = {}
        if status:
            query["registrationStatus"] = status
        
        # Get total count
        total = await db.registrations.count_documents(query)
        
        # Get registrations with pagination
        cursor = db.registrations.find(query).skip(skip).limit(limit).sort("registrationDate", -1)
        registrations_data = await cursor.to_list(length=limit)
        
        # Convert to Registration objects
        registrations = [Registration(**reg) for reg in registrations_data]
        
        return RegistrationListResponse(
            success=True,
            data=registrations,
            total=total,
            message=f"Retrieved {len(registrations)} registrations"
        )
        
    except Exception as e:
        logger.error(f"Error fetching registrations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch registrations")

@router.get("/{registration_id}", response_model=RegistrationResponse)
async def get_registration(registration_id: str):
    """Get a specific registration by ID"""
    
    try:
        registration_data = await db.registrations.find_one({"id": registration_id})
        
        if not registration_data:
            raise HTTPException(status_code=404, detail="Registration not found")
        
        registration = Registration(**registration_data)
        
        return RegistrationResponse(
            success=True,
            data=registration,
            message="Registration found"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching registration {registration_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch registration")

@router.get("/email/{email}", response_model=dict)
async def check_email_exists(email: str):
    """Check if an email is already registered"""
    
    try:
        existing = await db.registrations.find_one({"email": email})
        
        return {
            "success": True,
            "exists": existing is not None,
            "message": "Email already registered" if existing else "Email available"
        }
        
    except Exception as e:
        logger.error(f"Error checking email {email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to check email")

@router.put("/{registration_id}", response_model=RegistrationResponse)
async def update_registration(registration_id: str, update_data: RegistrationUpdate):
    """Update an existing registration"""
    
    try:
        # Check if registration exists
        existing = await db.registrations.find_one({"id": registration_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Registration not found")
        
        # Prepare update data (only non-None fields)
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        
        if update_dict:
            update_dict["lastUpdated"] = datetime.utcnow()
            
            # Update in database
            result = await db.registrations.update_one(
                {"id": registration_id},
                {"$set": update_dict}
            )
            
            if result.modified_count > 0:
                # Fetch updated registration
                updated_data = await db.registrations.find_one({"id": registration_id})
                updated_registration = Registration(**updated_data)
                
                logger.info(f"Registration updated: {registration_id}")
                
                return RegistrationResponse(
                    success=True,
                    data=updated_registration,
                    message="Registration updated successfully"
                )
            else:
                return RegistrationResponse(
                    success=True,
                    data=Registration(**existing),
                    message="No changes were made"
                )
        else:
            return RegistrationResponse(
                success=True,
                data=Registration(**existing),
                message="No update data provided"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating registration {registration_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update registration")

@router.delete("/{registration_id}", response_model=RegistrationResponse)
async def cancel_registration(registration_id: str):
    """Cancel a registration (soft delete by changing status)"""
    
    try:
        # Check if registration exists
        existing = await db.registrations.find_one({"id": registration_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Registration not found")
        
        # Update status to cancelled
        result = await db.registrations.update_one(
            {"id": registration_id},
            {
                "$set": {
                    "registrationStatus": "cancelled",
                    "lastUpdated": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count > 0:
            # Fetch updated registration
            updated_data = await db.registrations.find_one({"id": registration_id})
            cancelled_registration = Registration(**updated_data)
            
            logger.info(f"Registration cancelled: {registration_id}")
            
            return RegistrationResponse(
                success=True,
                data=cancelled_registration,
                message="Registration cancelled successfully"
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to cancel registration")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling registration {registration_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to cancel registration")

@router.get("/stats/summary")
async def get_registration_stats():
    """Get registration statistics"""
    
    try:
        # Total registrations
        total = await db.registrations.count_documents({})
        
        # By status
        pending = await db.registrations.count_documents({"registrationStatus": "pending"})
        confirmed = await db.registrations.count_documents({"registrationStatus": "confirmed"})
        cancelled = await db.registrations.count_documents({"registrationStatus": "cancelled"})
        
        # By specialty
        dermatology = await db.registrations.count_documents({"specialty": "dermatology"})
        dentistry = await db.registrations.count_documents({"specialty": "dentistry"})
        cosmetology = await db.registrations.count_documents({"specialty": "cosmetology"})
        other = await db.registrations.count_documents({"specialty": "other"})
        
        # Available spots
        active_registrations = total - cancelled
        available_spots = MAX_REGISTRATIONS - active_registrations
        
        return {
            "success": True,
            "data": {
                "total_registrations": total,
                "active_registrations": active_registrations,
                "available_spots": available_spots,
                "registration_limit": MAX_REGISTRATIONS,
                "by_status": {
                    "pending": pending,
                    "confirmed": confirmed,
                    "cancelled": cancelled
                },
                "by_specialty": {
                    "dermatology": dermatology,
                    "dentistry": dentistry,
                    "cosmetology": cosmetology,
                    "other": other
                },
                "registration_deadline": REGISTRATION_DEADLINE.isoformat(),
                "deadline_passed": datetime.utcnow() > REGISTRATION_DEADLINE
            },
            "message": "Registration statistics retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error getting registration stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get registration statistics")