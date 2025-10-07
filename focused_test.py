#!/usr/bin/env python3
"""
Focused Backend Test for Review Request
Tests specific functionality requested in the review
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE_URL}")

class FocusedTester:
    def __init__(self):
        self.base_url = API_BASE_URL
        self.results = []

    def log_result(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.results.append({
            'test': test_name,
            'success': success,
            'details': details
        })
        print(f"{status}: {test_name}")
        if details:
            print(f"    Details: {details}")

    def test_gallery_new_image(self):
        """Test 1: Verify new gallery image (id: 18, Advanced Dental Chair System)"""
        try:
            response = requests.get(f"{self.base_url}/static/gallery")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('data'):
                    data = result['data']
                    
                    # Check total count
                    total_images = len(data)
                    
                    # Look for the specific new image (id: 18)
                    image_18 = next((img for img in data if img.get('id') == 18), None)
                    
                    if image_18:
                        if image_18.get('title') == "Advanced Dental Chair System":
                            self.log_result(
                                'Gallery New Image Verification', 
                                True, 
                                f"Found image id 18 with correct title. Total images: {total_images}"
                            )
                        else:
                            self.log_result(
                                'Gallery New Image Verification', 
                                False, 
                                f"Image id 18 found but wrong title: {image_18.get('title')}"
                            )
                    else:
                        self.log_result(
                            'Gallery New Image Verification', 
                            False, 
                            f"Image with id 18 not found. Total images: {total_images}"
                        )
                else:
                    self.log_result('Gallery New Image Verification', False, "Invalid API response structure")
            else:
                self.log_result('Gallery New Image Verification', False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result('Gallery New Image Verification', False, str(e))

    def test_payment_bank_details(self):
        """Test 2: Verify payment bank details endpoint"""
        try:
            response = requests.get(f"{self.base_url}/payments/bank-details")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('data'):
                    data = result['data']
                    
                    # Check required fields
                    required_fields = ['bank_details', 'payment_calculation', 'instructions']
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields:
                        bank_details = data['bank_details']
                        bank_required = ['account_number', 'account_name', 'bank_name', 'ifsc_code']
                        missing_bank_fields = [field for field in bank_required if field not in bank_details]
                        
                        if not missing_bank_fields:
                            self.log_result(
                                'Payment Bank Details', 
                                True, 
                                f"All required fields present. Account: {bank_details.get('account_number')}"
                            )
                        else:
                            self.log_result(
                                'Payment Bank Details', 
                                False, 
                                f"Missing bank fields: {missing_bank_fields}"
                            )
                    else:
                        self.log_result('Payment Bank Details', False, f"Missing fields: {missing_fields}")
                else:
                    self.log_result('Payment Bank Details', False, "Invalid API response structure")
            else:
                self.log_result('Payment Bank Details', False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result('Payment Bank Details', False, str(e))

    def test_registration_to_payment_flow(self):
        """Test 3: Complete registration to payment flow"""
        try:
            # Create unique test data
            unique_id = str(uuid.uuid4())[:8]
            
            # Step 1: Create a registration
            registration_data = {
                "fullName": "Dr. Sarah Johnson",
                "gender": "female",
                "dateOfBirth": (datetime.now() - timedelta(days=365 * 35)).isoformat(),
                "nationality": "Indian",
                "passportNumber": f"B{unique_id.upper()}",
                "passportExpiry": datetime(2027, 6, 1).isoformat(),
                "mobile": "+919876543213",
                "email": f"dr.sarah.{unique_id}@example.com",
                "specialty": "dentistry",
                "yearsOfPractice": 12,
                "clinicName": "Johnson Dental Clinic",
                "clinicAddress": "456 Dental Avenue, Mumbai, India",
                "company": "Johnson Healthcare Ltd",
                "designation": "Chief Dentist",
                "interests": ["Dental Equipment", "Skincare Devices"],
                "mou": True,
                "foodPreference": "non-vegetarian",
                "emergencyContact": "+919876543214",
                "allergies": "None",
                "specialAssistance": False,
                "termsAccepted": True
            }
            
            reg_response = requests.post(f"{self.base_url}/registrations", json=registration_data)
            
            if reg_response.status_code == 200:
                reg_result = reg_response.json()
                if reg_result.get('success') and reg_result.get('data'):
                    registration_id = reg_result['data']['id']
                    
                    # Step 2: Get payment info for this registration
                    payment_response = requests.get(f"{self.base_url}/payments/info/{registration_id}")
                    
                    if payment_response.status_code == 200:
                        payment_result = payment_response.json()
                        if payment_result.get('success'):
                            
                            # Step 3: Verify bank details are accessible
                            bank_response = requests.get(f"{self.base_url}/payments/bank-details")
                            
                            if bank_response.status_code == 200:
                                bank_result = bank_response.json()
                                if bank_result.get('success'):
                                    self.log_result(
                                        'Registration to Payment Flow', 
                                        True, 
                                        f"Complete flow working. Registration ID: {registration_id}"
                                    )
                                else:
                                    self.log_result('Registration to Payment Flow', False, "Bank details not accessible")
                            else:
                                self.log_result('Registration to Payment Flow', False, f"Bank details failed: HTTP {bank_response.status_code}")
                        else:
                            self.log_result('Registration to Payment Flow', False, f"Payment info invalid: {payment_result}")
                    else:
                        self.log_result('Registration to Payment Flow', False, f"Payment info failed: HTTP {payment_response.status_code}: {payment_response.text}")
                else:
                    self.log_result('Registration to Payment Flow', False, f"Registration creation failed: {reg_result}")
            else:
                self.log_result('Registration to Payment Flow', False, f"Registration failed: HTTP {reg_response.status_code}: {reg_response.text}")
        except Exception as e:
            self.log_result('Registration to Payment Flow', False, str(e))

    def test_core_apis_quick_check(self):
        """Test 4: Quick verification of core APIs"""
        try:
            # Test registration stats
            reg_stats = requests.get(f"{self.base_url}/registrations/stats/summary")
            reg_ok = reg_stats.status_code == 200 and reg_stats.json().get('success')
            
            # Test contact stats
            contact_stats = requests.get(f"{self.base_url}/contacts/stats/summary")
            contact_ok = contact_stats.status_code == 200 and contact_stats.json().get('success')
            
            # Test static data
            static_schedule = requests.get(f"{self.base_url}/static/schedule")
            static_ok = static_schedule.status_code == 200 and static_schedule.json().get('success')
            
            if reg_ok and contact_ok and static_ok:
                self.log_result(
                    'Core APIs Quick Check', 
                    True, 
                    "Registration, Contact, and Static Data APIs all responding correctly"
                )
            else:
                failed_apis = []
                if not reg_ok: failed_apis.append("Registration")
                if not contact_ok: failed_apis.append("Contact")
                if not static_ok: failed_apis.append("Static Data")
                
                self.log_result('Core APIs Quick Check', False, f"Failed APIs: {', '.join(failed_apis)}")
        except Exception as e:
            self.log_result('Core APIs Quick Check', False, str(e))

    def run_focused_tests(self):
        """Run all focused tests"""
        print("🎯 FOCUSED BACKEND TESTING FOR REVIEW REQUEST")
        print("=" * 60)
        print("Testing specific functionality requested in review:")
        print("1. Gallery Images Update (new image id: 18)")
        print("2. Registration to Payment Flow")
        print("3. Payment Bank Details Endpoint")
        print("4. Core API Functionality")
        print("=" * 60)
        
        self.test_gallery_new_image()
        self.test_payment_bank_details()
        self.test_registration_to_payment_flow()
        self.test_core_apis_quick_check()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 FOCUSED TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r['success'])
        failed = sum(1 for r in self.results if not r['success'])
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed / len(self.results) * 100):.1f}%")
        
        if failed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.results:
                if not result['success']:
                    print(f"  ❌ {result['test']}: {result['details']}")
        
        print(f"\n🎉 BACKEND READY FOR FRONTEND TESTING!" if failed == 0 else f"\n⚠️  {failed} issues need attention before frontend testing")

if __name__ == "__main__":
    tester = FocusedTester()
    tester.run_focused_tests()