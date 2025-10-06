#!/usr/bin/env python3
"""
KICON 2025 Backend API Test Suite
Tests all backend APIs including registration, contact, and static data endpoints
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

class KICONAPITester:
    def __init__(self):
        self.base_url = API_BASE_URL
        self.test_results = {
            'registration_api': {'passed': 0, 'failed': 0, 'errors': []},
            'contact_api': {'passed': 0, 'failed': 0, 'errors': []},
            'static_api': {'passed': 0, 'failed': 0, 'errors': []}
        }
        self.created_registrations = []
        self.created_contacts = []

    def log_result(self, category: str, test_name: str, success: bool, error_msg: str = None):
        """Log test result"""
        if success:
            self.test_results[category]['passed'] += 1
            print(f"✅ {test_name}")
        else:
            self.test_results[category]['failed'] += 1
            self.test_results[category]['errors'].append(f"{test_name}: {error_msg}")
            print(f"❌ {test_name}: {error_msg}")

    def create_valid_registration_data(self, email_suffix: str = None) -> Dict[str, Any]:
        """Create valid registration data for testing"""
        if not email_suffix:
            email_suffix = str(uuid.uuid4())[:8]
        
        # Calculate valid dates
        birth_date = datetime.now() - timedelta(days=365 * 30)  # 30 years old
        passport_expiry = datetime(2027, 1, 1)  # Valid well beyond event
        
        return {
            "fullName": "Dr. Rajesh Kumar",
            "gender": "male",
            "dateOfBirth": birth_date.isoformat(),
            "nationality": "Indian",
            "passportNumber": f"A{email_suffix[:8].upper()}",
            "passportExpiry": passport_expiry.isoformat(),
            "mobile": "+919876543210",
            "email": f"dr.rajesh.{email_suffix}@example.com",
            "specialty": "dermatology",
            "yearsOfPractice": 10,
            "clinicName": "Kumar Skin Clinic",
            "clinicAddress": "123 Medical Street, New Delhi, India",
            "company": "Kumar Healthcare Pvt Ltd",
            "designation": "Senior Dermatologist",
            "interests": ["Skincare Devices", "Cosmetic Products"],
            "mou": True,
            "foodPreference": "vegetarian",
            "emergencyContact": "+919876543211",
            "allergies": "None",
            "specialAssistance": False,
            "termsAccepted": True
        }

    def create_valid_contact_data(self, email_suffix: str = None) -> Dict[str, Any]:
        """Create valid contact data for testing"""
        if not email_suffix:
            email_suffix = str(uuid.uuid4())[:8]
        
        return {
            "name": "Dr. Priya Sharma",
            "email": f"priya.sharma.{email_suffix}@example.com",
            "phone": "+919876543212",
            "subject": "Inquiry about KICON 2025 Registration",
            "message": "I would like to know more about the registration process and accommodation options for KICON 2025.",
            "inquiryType": "registration"
        }

    # Registration API Tests
    def test_registration_create_valid(self):
        """Test creating a valid registration"""
        try:
            data = self.create_valid_registration_data()
            response = requests.post(f"{self.base_url}/registrations", json=data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('data'):
                    self.created_registrations.append(result['data']['id'])
                    self.log_result('registration_api', 'Create valid registration', True)
                else:
                    self.log_result('registration_api', 'Create valid registration', False, f"Invalid response structure: {result}")
            else:
                self.log_result('registration_api', 'Create valid registration', False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('registration_api', 'Create valid registration', False, str(e))

    def test_registration_email_uniqueness(self):
        """Test email uniqueness validation"""
        try:
            # Create first registration
            data1 = self.create_valid_registration_data("unique1")
            response1 = requests.post(f"{self.base_url}/registrations", json=data1)
            
            if response1.status_code == 200:
                result1 = response1.json()
                if result1.get('success'):
                    self.created_registrations.append(result1['data']['id'])
                    
                    # Try to create second registration with same email
                    data2 = self.create_valid_registration_data("unique1")  # Same email
                    response2 = requests.post(f"{self.base_url}/registrations", json=data2)
                    
                    if response2.status_code == 400:
                        result2 = response2.json()
                        if "already registered" in result2.get('detail', '').lower():
                            self.log_result('registration_api', 'Email uniqueness validation', True)
                        else:
                            self.log_result('registration_api', 'Email uniqueness validation', False, f"Wrong error message: {result2.get('detail')}")
                    else:
                        self.log_result('registration_api', 'Email uniqueness validation', False, f"Expected 400, got {response2.status_code}")
                else:
                    self.log_result('registration_api', 'Email uniqueness validation', False, "First registration failed")
            else:
                self.log_result('registration_api', 'Email uniqueness validation', False, f"First registration failed: HTTP {response1.status_code}")
        except Exception as e:
            self.log_result('registration_api', 'Email uniqueness validation', False, str(e))

    def test_registration_age_validation(self):
        """Test age validation (must be 18+)"""
        try:
            data = self.create_valid_registration_data("minor")
            # Set birth date to make person 17 years old
            data['dateOfBirth'] = (datetime.now() - timedelta(days=365 * 17)).isoformat()
            
            response = requests.post(f"{self.base_url}/registrations", json=data)
            
            if response.status_code == 422:  # Validation error
                result = response.json()
                if "18 years old" in str(result).lower():
                    self.log_result('registration_api', 'Age validation (18+)', True)
                else:
                    self.log_result('registration_api', 'Age validation (18+)', False, f"Wrong validation message: {result}")
            else:
                self.log_result('registration_api', 'Age validation (18+)', False, f"Expected 422, got {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('registration_api', 'Age validation (18+)', False, str(e))

    def test_registration_passport_validation(self):
        """Test passport expiry validation (6 months after event)"""
        try:
            data = self.create_valid_registration_data("passport")
            # Set passport expiry to be invalid (before required date)
            data['passportExpiry'] = datetime(2025, 12, 1).isoformat()  # Too early
            
            response = requests.post(f"{self.base_url}/registrations", json=data)
            
            if response.status_code == 422:  # Validation error
                result = response.json()
                if "6 months" in str(result).lower():
                    self.log_result('registration_api', 'Passport expiry validation', True)
                else:
                    self.log_result('registration_api', 'Passport expiry validation', False, f"Wrong validation message: {result}")
            else:
                self.log_result('registration_api', 'Passport expiry validation', False, f"Expected 422, got {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('registration_api', 'Passport expiry validation', False, str(e))

    def test_registration_required_fields(self):
        """Test required field validation"""
        try:
            data = self.create_valid_registration_data("required")
            del data['fullName']  # Remove required field
            
            response = requests.post(f"{self.base_url}/registrations", json=data)
            
            if response.status_code == 422:  # Validation error
                self.log_result('registration_api', 'Required field validation', True)
            else:
                self.log_result('registration_api', 'Required field validation', False, f"Expected 422, got {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('registration_api', 'Required field validation', False, str(e))

    def test_registration_email_check(self):
        """Test email existence check endpoint"""
        try:
            # First create a registration
            data = self.create_valid_registration_data("emailcheck")
            response1 = requests.post(f"{self.base_url}/registrations", json=data)
            
            if response1.status_code == 200:
                result1 = response1.json()
                if result1.get('success'):
                    self.created_registrations.append(result1['data']['id'])
                    
                    # Check if email exists
                    email = data['email']
                    response2 = requests.get(f"{self.base_url}/registrations/email/{email}")
                    
                    if response2.status_code == 200:
                        result2 = response2.json()
                        if result2.get('success') and result2.get('exists') == True:
                            self.log_result('registration_api', 'Email existence check', True)
                        else:
                            self.log_result('registration_api', 'Email existence check', False, f"Wrong response: {result2}")
                    else:
                        self.log_result('registration_api', 'Email existence check', False, f"HTTP {response2.status_code}: {response2.text}")
                else:
                    self.log_result('registration_api', 'Email existence check', False, "Registration creation failed")
            else:
                self.log_result('registration_api', 'Email existence check', False, f"Registration creation failed: HTTP {response1.status_code}")
        except Exception as e:
            self.log_result('registration_api', 'Email existence check', False, str(e))

    def test_registration_stats(self):
        """Test registration statistics endpoint"""
        try:
            response = requests.get(f"{self.base_url}/registrations/stats/summary")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('data'):
                    data = result['data']
                    required_fields = ['total_registrations', 'active_registrations', 'available_spots', 'registration_limit']
                    if all(field in data for field in required_fields):
                        self.log_result('registration_api', 'Registration statistics', True)
                    else:
                        self.log_result('registration_api', 'Registration statistics', False, f"Missing required fields in response: {data}")
                else:
                    self.log_result('registration_api', 'Registration statistics', False, f"Invalid response structure: {result}")
            else:
                self.log_result('registration_api', 'Registration statistics', False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('registration_api', 'Registration statistics', False, str(e))

    def test_registration_get_all(self):
        """Test get all registrations endpoint"""
        try:
            response = requests.get(f"{self.base_url}/registrations")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and 'data' in result and 'total' in result:
                    self.log_result('registration_api', 'Get all registrations', True)
                else:
                    self.log_result('registration_api', 'Get all registrations', False, f"Invalid response structure: {result}")
            else:
                self.log_result('registration_api', 'Get all registrations', False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('registration_api', 'Get all registrations', False, str(e))

    # Contact API Tests
    def test_contact_create_valid(self):
        """Test creating a valid contact inquiry"""
        try:
            data = self.create_valid_contact_data()
            response = requests.post(f"{self.base_url}/contacts", json=data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('data'):
                    self.created_contacts.append(result['data']['id'])
                    self.log_result('contact_api', 'Create valid contact inquiry', True)
                else:
                    self.log_result('contact_api', 'Create valid contact inquiry', False, f"Invalid response structure: {result}")
            else:
                self.log_result('contact_api', 'Create valid contact inquiry', False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('contact_api', 'Create valid contact inquiry', False, str(e))

    def test_contact_required_fields(self):
        """Test contact form required field validation"""
        try:
            data = self.create_valid_contact_data("required")
            del data['subject']  # Remove required field
            
            response = requests.post(f"{self.base_url}/contacts", json=data)
            
            if response.status_code == 422:  # Validation error
                self.log_result('contact_api', 'Contact required field validation', True)
            else:
                self.log_result('contact_api', 'Contact required field validation', False, f"Expected 422, got {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('contact_api', 'Contact required field validation', False, str(e))

    def test_contact_get_all(self):
        """Test get all contacts endpoint"""
        try:
            response = requests.get(f"{self.base_url}/contacts")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and 'data' in result and 'total' in result:
                    self.log_result('contact_api', 'Get all contacts', True)
                else:
                    self.log_result('contact_api', 'Get all contacts', False, f"Invalid response structure: {result}")
            else:
                self.log_result('contact_api', 'Get all contacts', False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('contact_api', 'Get all contacts', False, str(e))

    def test_contact_stats(self):
        """Test contact statistics endpoint"""
        try:
            response = requests.get(f"{self.base_url}/contacts/stats/summary")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('data'):
                    data = result['data']
                    required_fields = ['total_inquiries', 'by_status', 'by_type']
                    if all(field in data for field in required_fields):
                        self.log_result('contact_api', 'Contact statistics', True)
                    else:
                        self.log_result('contact_api', 'Contact statistics', False, f"Missing required fields in response: {data}")
                else:
                    self.log_result('contact_api', 'Contact statistics', False, f"Invalid response structure: {result}")
            else:
                self.log_result('contact_api', 'Contact statistics', False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('contact_api', 'Contact statistics', False, str(e))

    # Static Data API Tests
    def test_static_schedule(self):
        """Test get event schedule endpoint"""
        try:
            response = requests.get(f"{self.base_url}/static/schedule")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('data'):
                    data = result['data']
                    if isinstance(data, list) and len(data) > 0:
                        # Check if first item has required structure
                        first_item = data[0]
                        if 'date' in first_item and 'title' in first_item and 'events' in first_item:
                            self.log_result('static_api', 'Get event schedule', True)
                        else:
                            self.log_result('static_api', 'Get event schedule', False, f"Invalid schedule structure: {first_item}")
                    else:
                        self.log_result('static_api', 'Get event schedule', False, "Empty or invalid schedule data")
                else:
                    self.log_result('static_api', 'Get event schedule', False, f"Invalid response structure: {result}")
            else:
                self.log_result('static_api', 'Get event schedule', False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('static_api', 'Get event schedule', False, str(e))

    def test_static_gallery(self):
        """Test get gallery images endpoint"""
        try:
            response = requests.get(f"{self.base_url}/static/gallery")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('data'):
                    data = result['data']
                    if isinstance(data, list) and len(data) > 0:
                        # Check if first item has required structure
                        first_item = data[0]
                        if 'id' in first_item and 'url' in first_item and 'title' in first_item:
                            self.log_result('static_api', 'Get gallery images', True)
                        else:
                            self.log_result('static_api', 'Get gallery images', False, f"Invalid gallery structure: {first_item}")
                    else:
                        self.log_result('static_api', 'Get gallery images', False, "Empty or invalid gallery data")
                else:
                    self.log_result('static_api', 'Get gallery images', False, f"Invalid response structure: {result}")
            else:
                self.log_result('static_api', 'Get gallery images', False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('static_api', 'Get gallery images', False, str(e))

    def test_static_package_info(self):
        """Test get package information endpoint"""
        try:
            response = requests.get(f"{self.base_url}/static/package-info")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('data'):
                    data = result['data']
                    required_fields = ['package_price', 'inclusions', 'exclusions', 'payment_terms']
                    if all(field in data for field in required_fields):
                        self.log_result('static_api', 'Get package information', True)
                    else:
                        self.log_result('static_api', 'Get package information', False, f"Missing required fields in response: {data}")
                else:
                    self.log_result('static_api', 'Get package information', False, f"Invalid response structure: {result}")
            else:
                self.log_result('static_api', 'Get package information', False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('static_api', 'Get package information', False, str(e))

    def test_static_contact_info(self):
        """Test get contact information endpoint"""
        try:
            response = requests.get(f"{self.base_url}/static/contact-info")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('data'):
                    data = result['data']
                    required_fields = ['office_address', 'contacts', 'business_hours']
                    if all(field in data for field in required_fields):
                        self.log_result('static_api', 'Get contact information', True)
                    else:
                        self.log_result('static_api', 'Get contact information', False, f"Missing required fields in response: {data}")
                else:
                    self.log_result('static_api', 'Get contact information', False, f"Invalid response structure: {result}")
            else:
                self.log_result('static_api', 'Get contact information', False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result('static_api', 'Get contact information', False, str(e))

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting KICON 2025 Backend API Tests...")
        print("=" * 60)
        
        # Registration API Tests (High Priority)
        print("\n📋 REGISTRATION API TESTS (High Priority)")
        print("-" * 40)
        self.test_registration_create_valid()
        self.test_registration_email_uniqueness()
        self.test_registration_age_validation()
        self.test_registration_passport_validation()
        self.test_registration_required_fields()
        self.test_registration_email_check()
        self.test_registration_stats()
        self.test_registration_get_all()
        
        # Contact API Tests (Medium Priority)
        print("\n📞 CONTACT API TESTS (Medium Priority)")
        print("-" * 40)
        self.test_contact_create_valid()
        self.test_contact_required_fields()
        self.test_contact_get_all()
        self.test_contact_stats()
        
        # Static Data API Tests (Low Priority)
        print("\n📊 STATIC DATA API TESTS (Low Priority)")
        print("-" * 40)
        self.test_static_schedule()
        self.test_static_gallery()
        self.test_static_package_info()
        self.test_static_contact_info()
        
        # Print Summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_passed = 0
        total_failed = 0
        
        for category, results in self.test_results.items():
            passed = results['passed']
            failed = results['failed']
            total_passed += passed
            total_failed += failed
            
            category_name = category.replace('_', ' ').title()
            print(f"\n{category_name}:")
            print(f"  ✅ Passed: {passed}")
            print(f"  ❌ Failed: {failed}")
            
            if results['errors']:
                print(f"  🔍 Errors:")
                for error in results['errors']:
                    print(f"    - {error}")
        
        print(f"\n🎯 OVERALL RESULTS:")
        print(f"  ✅ Total Passed: {total_passed}")
        print(f"  ❌ Total Failed: {total_failed}")
        print(f"  📈 Success Rate: {(total_passed / (total_passed + total_failed) * 100):.1f}%")
        
        if total_failed == 0:
            print("\n🎉 ALL TESTS PASSED! Backend APIs are working correctly.")
        else:
            print(f"\n⚠️  {total_failed} tests failed. Please review the errors above.")

if __name__ == "__main__":
    tester = KICONAPITester()
    tester.run_all_tests()