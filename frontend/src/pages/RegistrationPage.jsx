import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, CheckCircle, User, Building, Globe, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registrationFormData } from "../mock/mockData";
import { useToast } from "../hooks/use-toast";
import PaymentDetails from "../components/PaymentDetails";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "India",
    passportNumber: "",
    passportExpiry: "",
    mobile: "",
    email: "",
    
    // Professional Information
    specialty: "",
    clinicName: "",
    clinicAddress: "",
    yearsOfPractice: "",
    interests: [],
    mou: false,
    
    // Additional Information
    company: "",
    designation: "",
    emergencyContact: "",
    foodPreference: "",
    allergies: "",
    specialAssistance: false,
    
    // Agreement
    termsAccepted: false
  });

  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const checkEmailExists = async (email) => {
    if (!email || !email.includes('@')) return;
    
    setEmailChecking(true);
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/registrations/email/${encodeURIComponent(email)}`);
      const result = await response.json();
      
      if (result.success) {
        setEmailExists(result.exists);
        if (result.exists) {
          toast({
            title: "Email Already Registered",
            description: "This email is already registered. Please use a different email address.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Email check error:", error);
    } finally {
      setEmailChecking(false);
    }
  };

  const handleInterestChange = (interest, checked) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      
      // Prepare registration data
      const registrationData = {
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth + "T00:00:00.000Z", // Convert to ISO format
        nationality: formData.nationality,
        passportNumber: formData.passportNumber,
        passportExpiry: formData.passportExpiry + "T00:00:00.000Z", // Convert to ISO format
        mobile: formData.mobile,
        email: formData.email,
        specialty: formData.specialty,
        yearsOfPractice: parseInt(formData.yearsOfPractice),
        clinicName: formData.clinicName,
        clinicAddress: formData.clinicAddress,
        company: formData.company || "",
        designation: formData.designation,
        interests: formData.interests,
        mou: formData.mou,
        foodPreference: formData.foodPreference,
        emergencyContact: formData.emergencyContact,
        allergies: formData.allergies || "",
        specialAssistance: formData.specialAssistance,
        termsAccepted: formData.termsAccepted
      };

      // Submit registration
      const response = await fetch(`${BACKEND_URL}/api/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const result = await response.json();

      if (result.success) {
        setRegistrationId(result.data.id);
        setShowPaymentDetails(true);
        
        toast({
          title: "Registration Successful!",
          description: "Please complete the payment to confirm your registration.",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: result.error?.message || "An error occurred during registration. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentDetails(false);
    navigate("/");
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: <User className="h-5 w-5" /> },
    { number: 2, title: "Professional", icon: <Building className="h-5 w-5" /> },
    { number: 3, title: "Preferences", icon: <Globe className="h-5 w-5" /> },
    { number: 4, title: "Payment", icon: <CreditCard className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">KICON 2025 Registration</h1>
              <p className="text-gray-600">Shine & Smile - Korea Convention</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    currentStep >= step.number 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-emerald-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2">
                Step {currentStep} of 4: {steps[currentStep - 1].title}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="text-2xl font-bold text-gray-800 text-center">
                  {steps[currentStep - 1].title} Information
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-8">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender *</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="nationality" className="text-sm font-medium text-gray-700">Nationality *</Label>
                        <Input
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) => handleInputChange('nationality', e.target.value)}
                          placeholder="Nationality"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="passportNumber" className="text-sm font-medium text-gray-700">Passport Number *</Label>
                        <Input
                          id="passportNumber"
                          value={formData.passportNumber}
                          onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                          placeholder="Enter passport number"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="passportExpiry" className="text-sm font-medium text-gray-700">Passport Expiry *</Label>
                        <Input
                          id="passportExpiry"
                          type="date"
                          value={formData.passportExpiry}
                          onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile Number *</Label>
                        <Input
                          id="mobile"
                          value={formData.mobile}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          placeholder="+91-9999999999"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onBlur={(e) => checkEmailExists(e.target.value)}
                          placeholder="your.email@example.com"
                          required
                          className={`mt-1 ${emailExists ? 'border-red-500 focus:border-red-500' : ''}`}
                        />
                        {emailChecking && (
                          <p className="text-sm text-gray-500 mt-1">Checking email...</p>
                        )}
                        {emailExists && (
                          <p className="text-sm text-red-500 mt-1">This email is already registered</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="specialty" className="text-sm font-medium text-gray-700">Medical Specialty *</Label>
                        <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            {registrationFormData.specialties.map((specialty) => (
                              <SelectItem key={specialty} value={specialty.toLowerCase()}>
                                {specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="yearsOfPractice" className="text-sm font-medium text-gray-700">Years of Practice *</Label>
                        <Input
                          id="yearsOfPractice"
                          type="number"
                          value={formData.yearsOfPractice}
                          onChange={(e) => handleInputChange('yearsOfPractice', e.target.value)}
                          placeholder="e.g., 5"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="clinicName" className="text-sm font-medium text-gray-700">Clinic/Hospital Name *</Label>
                        <Input
                          id="clinicName"
                          value={formData.clinicName}
                          onChange={(e) => handleInputChange('clinicName', e.target.value)}
                          placeholder="Name of your clinic or hospital"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="clinicAddress" className="text-sm font-medium text-gray-700">Clinic/Hospital Address *</Label>
                        <Textarea
                          id="clinicAddress"
                          value={formData.clinicAddress}
                          onChange={(e) => handleInputChange('clinicAddress', e.target.value)}
                          placeholder="Complete address of your clinic/hospital"
                          required
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company (if different)</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Company name (optional)"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="designation" className="text-sm font-medium text-gray-700">Designation/Title *</Label>
                        <Input
                          id="designation"
                          value={formData.designation}
                          onChange={(e) => handleInputChange('designation', e.target.value)}
                          placeholder="e.g., Senior Consultant, Director"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Areas of Interest *</Label>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {registrationFormData.interests.map((interest) => (
                          <div key={interest} className="flex items-center space-x-2">
                            <Checkbox
                              id={interest}
                              checked={formData.interests.includes(interest)}
                              onCheckedChange={(checked) => handleInterestChange(interest, checked)}
                            />
                            <Label htmlFor={interest} className="text-sm text-gray-700">{interest}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mou"
                        checked={formData.mou}
                        onCheckedChange={(checked) => handleInputChange('mou', checked)}
                      />
                      <Label htmlFor="mou" className="text-sm text-gray-700">
                        Interested in signing MOU/Exclusivity agreements
                      </Label>
                    </div>
                  </div>
                )}

                {/* Step 3: Preferences */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="foodPreference" className="text-sm font-medium text-gray-700">Food Preference *</Label>
                        <Select value={formData.foodPreference} onValueChange={(value) => handleInputChange('foodPreference', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select food preference" />
                          </SelectTrigger>
                          <SelectContent>
                            {registrationFormData.foodOptions.map((option) => (
                              <SelectItem key={option} value={option.toLowerCase()}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">Emergency Contact *</Label>
                        <Input
                          id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                          placeholder="Emergency contact number"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="allergies" className="text-sm font-medium text-gray-700">Food Allergies</Label>
                        <Textarea
                          id="allergies"
                          value={formData.allergies}
                          onChange={(e) => handleInputChange('allergies', e.target.value)}
                          placeholder="Please list any food allergies or dietary restrictions"
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="specialAssistance"
                        checked={formData.specialAssistance}
                        onCheckedChange={(checked) => handleInputChange('specialAssistance', checked)}
                      />
                      <Label htmlFor="specialAssistance" className="text-sm text-gray-700">
                        I require special assistance (mobility, accessibility, etc.)
                      </Label>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment & Terms */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-4">Package Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-700">KICON 2025 Registration</span>
                          <span className="font-semibold">USD $3,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 text-sm">GST (as applicable)</span>
                          <span className="font-semibold text-sm">Extra</span>
                        </div>
                        <div className="border-t border-emerald-200 pt-2">
                          <div className="flex justify-between text-lg font-bold text-emerald-800">
                            <span>Base Amount</span>
                            <span>USD $3,000</span>
                          </div>
                          <p className="text-xs text-orange-600 mt-1">*GST will be added as per applicable rates</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Payment Terms</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• 50% advance payment (USD $1,500) required at registration</li>
                        <li>• Remaining 50% due by October 17, 2025</li>
                        <li>• Payment can be made via bank transfer or online payment</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">Cancellation Policy</h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Before October 18, 2025: 100% refund (minus visa fee)</li>
                        <li>• October 22-28, 2025: 50% refund (minus visa fee)</li>
                        <li>• After October 29, 2025: No refund</li>
                      </ul>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                        I agree to the terms and conditions, cancellation policy, and understand that this registration 
                        is subject to visa approval. I acknowledge that the organizers are not responsible for visa 
                        rejections or delays beyond their control.
                      </Label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t border-gray-200">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="px-6"
                    >
                      Previous
                    </Button>
                  )}
                  
                  <div className="ml-auto">
                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-6"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!formData.termsAccepted || emailExists || emailChecking || submitting}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-8"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : emailChecking ? "Checking Email..." : "Complete Registration"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
      
      {/* Payment Details Modal */}
      {showPaymentDetails && registrationId && (
        <PaymentDetails 
          registrationId={registrationId}
          onClose={handlePaymentClose}
        />
      )}
    </div>
  );
};

export default RegistrationPage;