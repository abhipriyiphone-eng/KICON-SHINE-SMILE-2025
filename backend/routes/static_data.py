from fastapi import APIRouter, HTTPException
import logging

router = APIRouter(prefix="/static", tags=["static-data"])
logger = logging.getLogger(__name__)

@router.get("/schedule")
async def get_event_schedule():
    """Get KICON 2025 event schedule"""
    
    try:
        schedule_data = [
            {
                "date": "November 23, 2025",
                "title": "Arrival & Welcome",
                "events": [
                    {
                        "time": "All Day",
                        "title": "Arrival at Incheon Airport",
                        "description": "Hotel check-in at Paradise Hotel & Resort, Inspire Entertainment Resort, or Same Class"
                    },
                    {
                        "time": "6:00 PM - 8:00 PM",
                        "title": "Welcome Dinner",
                        "description": "Korean cultural performance included"
                    }
                ]
            },
            {
                "date": "November 24, 2025",
                "title": "Showcase & Product Selection",
                "events": [
                    {
                        "time": "9:30 AM - 12:30 PM",
                        "title": "Opening Ceremony & Keynote",
                        "description": "Vendor presentations: Dental, Skin, Cosmetics"
                    },
                    {
                        "time": "2:00 PM - 5:00 PM",
                        "title": "Live Demonstrations",
                        "description": "Dental machines, skincare devices & cosmetics"
                    },
                    {
                        "time": "7:00 PM onwards",
                        "title": "Networking Dinner",
                        "description": "Connect with Korean exhibitors"
                    }
                ]
            },
            {
                "date": "November 25, 2025",
                "title": "Business & MoU Signing",
                "events": [
                    {
                        "time": "9:30 AM - 12:30 PM",
                        "title": "Buyer-Vendor Roundtables",
                        "description": "Structured 1:1 meetings for partnerships"
                    },
                    {
                        "time": "2:00 PM - 5:00 PM",
                        "title": "MoU & Exclusivity Signing",
                        "description": "Media coverage and deal finalization"
                    },
                    {
                        "time": "7:00 PM - 9:00 PM",
                        "title": "Gala Dinner",
                        "description": "Indo-Korean Cultural Night"
                    }
                ]
            },
            {
                "date": "November 26, 2025",
                "title": "Distribution & Closing",
                "events": [
                    {
                        "time": "9:30 AM - 12:30 PM",
                        "title": "Workshop",
                        "description": "India Entry Strategy for Korean Products"
                    },
                    {
                        "time": "2:00 PM - 4:30 PM",
                        "title": "Final Deal Closures",
                        "description": "Event-only offers & Closing Ceremony"
                    },
                    {
                        "time": "Evening",
                        "title": "Farewell Dinner",
                        "description": "Celebration and networking"
                    }
                ]
            }
        ]
        
        return {
            "success": True,
            "data": schedule_data,
            "message": "Event schedule retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error fetching schedule: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch event schedule")

@router.get("/gallery")
async def get_gallery_images():
    """Get gallery images for KICON 2025"""
    
    try:
        gallery_images = [
            {
                "id": 1,
                "url": "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/4172tad4_1.png",
                "title": "V Max HIFU System",
                "description": "Dual handpieces with stable cooling system and non-consumable operation for pain-free treatment"
            },
            {
                "id": 2,
                "url": "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/huaffgtt_2.png",
                "title": "High-Frequency Aesthetic Technology",
                "description": "MEDITEC's unrivalled technological prowess in high-frequency treatments"
            },
            {
                "id": 3,
                "url": "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/3ik974zx_3.png",
                "title": "Magic Line System",
                "description": "Bipolar high frequency + thermal suction + color therapy for comprehensive treatment"
            },
            {
                "id": 4,
                "url": "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/a4f0i3we_4.png",
                "title": "Vita Zet Face & Body Care",
                "description": "Needle-free injector minimizing pain with solenoid method for full face and body care"
            },
            {
                "id": 5,
                "url": "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/nq4sasfb_5.png",
                "title": "Vita Zet Dermal Absorption",
                "description": "Non-invasive dermal drug absorption system - No needle, no pain, no steroid technology"
            }
        ]
        
        return {
            "success": True,
            "data": gallery_images,
            "message": "Gallery images retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error fetching gallery: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch gallery images")

@router.get("/package-info")
async def get_package_information():
    """Get KICON 2025 package information"""
    
    try:
        package_info = {
            "package_price": {
                "amount": 3000,
                "currency": "USD",
                "gst_extra": True,
                "gst_note": "GST extra as applicable"
            },
            "inclusions": [
                "4 nights Luxurious 5 Star Accommodation",
                "Round-trip International Flights",
                "Korean Visa Processing",
                "All Meals (Breakfast/Lunch/Dinner)",
                "Special Gala Dinner with Beverages",
                "All Airport Transfers",
                "Seoul Sightseeing with English Guide",
                "Daily Mineral Water (2 bottles)",
                "K-pop Cultural Night"
            ],
            "exclusions": [
                "Personal Expenses",
                "Medical & Travel Insurance",
                "Optional Tours & Activities",
                "Early Check-in / Late Check-out",
                "Excess Baggage Charges",
                "Tips & Gratuities",
                "Items not mentioned in inclusions"
            ],
            "payment_terms": {
                "advance_payment": {
                    "amount": 1500,
                    "currency": "USD",
                    "percentage": 50,
                    "due_on": "Registration"
                },
                "balance_payment": {
                    "amount": 1500,
                    "currency": "USD",
                    "percentage": 50,
                    "due_date": "2025-10-17"
                }
            },
            "cancellation_policy": [
                {
                    "period": "Before October 18, 2025",
                    "refund": "100% (minus visa fee)"
                },
                {
                    "period": "October 22-28, 2025",
                    "refund": "50% (minus visa fee)"
                },
                {
                    "period": "After October 29, 2025",
                    "refund": "No refund"
                }
            ],
            "accommodation": {
                "options": [
                    "Paradise Hotel & Resort",
                    "Inspire Entertainment Resort",
                    "Same Class Hotels"
                ],
                "location": "Incheon, South Korea",
                "standard": "5 Star Luxury"
            },
            "event_details": {
                "dates": {
                    "start": "2025-11-24",
                    "end": "2025-11-26"
                },
                "location": "Incheon, South Korea",
                "max_delegates": 200,
                "registration_deadline": "2025-10-17"
            }
        }
        
        return {
            "success": True,
            "data": package_info,
            "message": "Package information retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error fetching package info: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch package information")

@router.get("/contact-info")
async def get_contact_information():
    """Get KICON 2025 contact information"""
    
    try:
        contact_info = {
            "office_address": "DSC- 317 Southcourt Mall District Center Saket New Delhi-110017",
            "contacts": [
                {
                    "name": "Abhipriy Gupta",
                    "phones": ["+91-9810571665", "+91-8700998182"]
                },
                {
                    "name": "Mr. Parag Tyagi",
                    "phones": ["+91-9999489292"]
                },
                {
                    "name": "Mr. Sanjay Arya",
                    "phones": ["+91-9873577029"]
                }
            ],
            "business_hours": {
                "monday_friday": "9:00 AM - 6:00 PM",
                "saturday": "10:00 AM - 4:00 PM",
                "sunday": "Closed"
            },
            "organizers": {
                "primary": "AryaD Consulting & Projects Pvt Ltd",
                "partner": "U&I International Korea"
            }
        }
        
        return {
            "success": True,
            "data": contact_info,
            "message": "Contact information retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error fetching contact info: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch contact information")