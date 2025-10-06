from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
import logging
import os
from pathlib import Path

router = APIRouter(prefix="/brochure", tags=["brochure"])
logger = logging.getLogger(__name__)

@router.get("/download")
async def download_brochure():
    """Download KICON 2025 brochure as HTML file"""
    
    try:
        # Path to the brochure file
        brochure_path = Path("/app/frontend/public/KICON_2025_Brochure.html")
        
        if not brochure_path.exists():
            raise HTTPException(status_code=404, detail="Brochure file not found")
        
        return FileResponse(
            path=str(brochure_path),
            filename="KICON_2025_Brochure.html",
            media_type="text/html"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error downloading brochure: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to download brochure")

@router.get("/view")
async def view_brochure():
    """View KICON 2025 brochure in browser"""
    
    try:
        # Path to the brochure file
        brochure_path = Path("/app/frontend/public/KICON_2025_Brochure.html")
        
        if not brochure_path.exists():
            raise HTTPException(status_code=404, detail="Brochure file not found")
        
        # Read the HTML content
        with open(brochure_path, 'r', encoding='utf-8') as file:
            html_content = file.read()
        
        return HTMLResponse(content=html_content)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error viewing brochure: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to view brochure")

@router.get("/info")
async def get_brochure_info():
    """Get information about available brochures and downloads"""
    
    try:
        brochure_path = Path("/app/frontend/public/KICON_2025_Brochure.html")
        
        brochure_info = {
            "available_downloads": [
                {
                    "name": "KICON 2025 Official Brochure",
                    "description": "Complete event information including schedule, pricing, and contact details",
                    "format": "HTML",
                    "download_url": "/api/brochure/download",
                    "view_url": "/api/brochure/view",
                    "file_exists": brochure_path.exists()
                },
                {
                    "name": "KICON 2025 Package Details", 
                    "description": "Detailed package information and terms",
                    "format": "PDF",
                    "download_url": "/KICON_2025_Details.pdf",
                    "file_exists": False,
                    "note": "Will be available soon"
                }
            ],
            "event_info": {
                "event_name": "KICON: Shine & Smile 2025",
                "dates": "November 24-26, 2025",
                "location": "Incheon, South Korea",
                "price": "USD $3,000 per delegate",
                "registration_deadline": "October 17, 2025"
            }
        }
        
        return {
            "success": True,
            "data": brochure_info,
            "message": "Brochure information retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error getting brochure info: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get brochure information")