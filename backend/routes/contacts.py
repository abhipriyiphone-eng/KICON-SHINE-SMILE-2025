from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import logging
from datetime import datetime

from models.Contact import (
    Contact,
    ContactCreate,
    ContactUpdate,
    ContactResponse,
    ContactListResponse
)

# Get database connection
from server import db

router = APIRouter(prefix="/contacts", tags=["contacts"])
logger = logging.getLogger(__name__)

@router.post("", response_model=ContactResponse)
async def create_contact_inquiry(contact_data: ContactCreate):
    """Submit a contact form inquiry"""
    
    try:
        # Create contact object
        contact = Contact(**contact_data.dict())
        
        # Insert into database
        result = await db.contacts.insert_one(contact.dict())
        
        if result.inserted_id:
            logger.info(f"New contact inquiry created: {contact.email}")
            return ContactResponse(
                success=True,
                data=contact,
                message="Your inquiry has been submitted successfully! We will get back to you soon."
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to submit inquiry")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating contact inquiry: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit inquiry")

@router.get("", response_model=ContactListResponse)
async def get_all_contacts(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    inquiry_type: Optional[str] = Query(None)
):
    """Get all contact inquiries (admin endpoint)"""
    
    try:
        # Build query filter
        query = {}
        if status:
            query["status"] = status
        if inquiry_type:
            query["inquiryType"] = inquiry_type
        
        # Get total count
        total = await db.contacts.count_documents(query)
        
        # Get contacts with pagination
        cursor = db.contacts.find(query).skip(skip).limit(limit).sort("createdDate", -1)
        contacts_data = await cursor.to_list(length=limit)
        
        # Convert to Contact objects
        contacts = [Contact(**contact) for contact in contacts_data]
        
        return ContactListResponse(
            success=True,
            data=contacts,
            total=total,
            message=f"Retrieved {len(contacts)} contact inquiries"
        )
        
    except Exception as e:
        logger.error(f"Error fetching contacts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch contact inquiries")

@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(contact_id: str):
    """Get a specific contact inquiry by ID"""
    
    try:
        contact_data = await db.contacts.find_one({"id": contact_id})
        
        if not contact_data:
            raise HTTPException(status_code=404, detail="Contact inquiry not found")
        
        contact = Contact(**contact_data)
        
        return ContactResponse(
            success=True,
            data=contact,
            message="Contact inquiry found"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching contact {contact_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch contact inquiry")

@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact_status(contact_id: str, update_data: ContactUpdate):
    """Update contact inquiry status (admin endpoint)"""
    
    try:
        # Check if contact exists
        existing = await db.contacts.find_one({"id": contact_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Contact inquiry not found")
        
        # Prepare update data
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        
        if update_dict:
            update_dict["lastUpdated"] = datetime.utcnow()
            
            # Update in database
            result = await db.contacts.update_one(
                {"id": contact_id},
                {"$set": update_dict}
            )
            
            if result.modified_count > 0:
                # Fetch updated contact
                updated_data = await db.contacts.find_one({"id": contact_id})
                updated_contact = Contact(**updated_data)
                
                logger.info(f"Contact inquiry updated: {contact_id}")
                
                return ContactResponse(
                    success=True,
                    data=updated_contact,
                    message="Contact inquiry updated successfully"
                )
            else:
                return ContactResponse(
                    success=True,
                    data=Contact(**existing),
                    message="No changes were made"
                )
        else:
            return ContactResponse(
                success=True,
                data=Contact(**existing),
                message="No update data provided"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating contact {contact_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update contact inquiry")

@router.get("/stats/summary")
async def get_contact_stats():
    """Get contact inquiry statistics"""
    
    try:
        # Total inquiries
        total = await db.contacts.count_documents({})
        
        # By status
        open_inquiries = await db.contacts.count_documents({"status": "open"})
        responded = await db.contacts.count_documents({"status": "responded"})
        closed = await db.contacts.count_documents({"status": "closed"})
        
        # By type
        general = await db.contacts.count_documents({"inquiryType": "general"})
        registration = await db.contacts.count_documents({"inquiryType": "registration"})
        accommodation = await db.contacts.count_documents({"inquiryType": "accommodation"})
        technical = await db.contacts.count_documents({"inquiryType": "technical"})
        
        # Recent inquiries (last 7 days)
        seven_days_ago = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        from datetime import timedelta
        seven_days_ago = seven_days_ago - timedelta(days=7)
        
        recent = await db.contacts.count_documents({
            "createdDate": {"$gte": seven_days_ago}
        })
        
        return {
            "success": True,
            "data": {
                "total_inquiries": total,
                "recent_inquiries": recent,
                "by_status": {
                    "open": open_inquiries,
                    "responded": responded,
                    "closed": closed
                },
                "by_type": {
                    "general": general,
                    "registration": registration,
                    "accommodation": accommodation,
                    "technical": technical
                }
            },
            "message": "Contact statistics retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error getting contact stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get contact statistics")