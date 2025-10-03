# KICON 2025 - Backend Integration Contracts

## Overview
This document outlines the API contracts, data models, and integration plan for KICON 2025 website backend development.

## Frontend Mock Data Currently Used
- **Registration Form**: Mock form submission with browser alerts
- **Gallery Images**: Static medical/dental images from Unsplash
- **Contact Form**: Mock contact interactions
- **Schedule Data**: Static schedule from mockData.js
- **Package Information**: Static pricing and inclusions

## Required Backend Implementation

### 1. Database Models

#### Registration Model
```javascript
{
  _id: ObjectId,
  
  // Personal Information
  fullName: String (required),
  gender: String (required),
  dateOfBirth: Date (required),
  nationality: String (required),
  passportNumber: String (required),
  passportExpiry: Date (required),
  mobile: String (required),
  email: String (required, unique),
  
  // Professional Information
  specialty: String (required), // Dermatology, Dentistry, Cosmetology, Other
  yearsOfPractice: Number (required),
  clinicName: String (required),
  clinicAddress: String (required),
  company: String (optional),
  designation: String (required),
  interests: [String], // Dental Equipment, Skincare Devices, Cosmetic Products
  mou: Boolean (default: false), // Interest in MOU/Exclusivity
  
  // Preferences
  foodPreference: String (required), // Vegetarian, Non-Vegetarian, Both
  emergencyContact: String (required),
  allergies: String (optional),
  specialAssistance: Boolean (default: false),
  
  // Status & Metadata
  registrationStatus: String (default: 'pending'), // pending, confirmed, cancelled
  paymentStatus: String (default: 'unpaid'), // unpaid, advance_paid, full_paid
  termsAccepted: Boolean (required),
  registrationDate: Date (default: Date.now),
  lastUpdated: Date (default: Date.now)
}
```

#### Contact Inquiry Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String (optional),
  subject: String (required),
  message: String (required),
  inquiryType: String (default: 'general'), // general, registration, accommodation
  status: String (default: 'open'), // open, responded, closed
  createdDate: Date (default: Date.now)
}
```

### 2. API Endpoints

#### Registration APIs
- `POST /api/registrations` - Create new registration
- `GET /api/registrations` - Get all registrations (admin)
- `GET /api/registrations/:id` - Get specific registration
- `PUT /api/registrations/:id` - Update registration
- `DELETE /api/registrations/:id` - Cancel registration
- `GET /api/registrations/email/:email` - Check if email already registered

#### Contact APIs
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get all inquiries (admin)
- `PUT /api/contacts/:id` - Update inquiry status

#### Static Data APIs
- `GET /api/schedule` - Get event schedule
- `GET /api/gallery` - Get gallery images
- `GET /api/package-info` - Get package details

### 3. Frontend Integration Changes

#### Remove Mock Data Usage
- Replace `mockData.js` imports with API calls
- Update registration form to submit to backend
- Add loading states and error handling
- Implement form validation feedback

#### API Integration Points
1. **Registration Form** (`RegistrationPage.jsx`):
   - Replace mock submission with POST to `/api/registrations`
   - Add email duplicate check before submission
   - Show loading spinner during submission
   - Display success/error messages

2. **Gallery Component** (`Gallery.jsx`):
   - Replace static images with GET from `/api/gallery`
   - Add image loading states

3. **Schedule Component** (`Schedule.jsx`):
   - Replace static schedule with GET from `/api/schedule`

4. **Contact Component** (`Contact.jsx`):
   - Add contact form submission to `/api/contacts`

### 4. Validation Rules

#### Registration Validation
- Email: Valid format, unique in database
- Passport: Valid format, future expiry date
- Mobile: Valid Indian phone format
- Required fields: All marked fields must be provided
- Age: Must be 18+ (derived from DOB)

#### Business Rules
- Maximum 200 registrations allowed
- Registration deadline: October 17, 2025
- Email uniqueness across all registrations

### 5. Response Formats

#### Success Response
```javascript
{
  success: true,
  data: { ... },
  message: "Operation completed successfully"
}
```

#### Error Response
```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human readable error message",
    details: { ... } // Optional validation details
  }
}
```

### 6. Error Handling
- Duplicate email registration
- Invalid passport/visa information
- Registration limit exceeded
- Database connection errors
- Validation failures

## Implementation Priority
1. Registration model and APIs (highest priority)
2. Contact form functionality
3. Static data APIs (schedule, gallery)
4. Admin functionalities (future enhancement)

## Frontend Updates Required
- Remove mock data dependencies
- Add axios API calls
- Implement loading states
- Add proper error handling and user feedback
- Form validation improvements