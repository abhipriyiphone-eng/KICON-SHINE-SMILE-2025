import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Copy, CheckCircle, CreditCard, Building, Phone, Banknote } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const PaymentDetails = ({ registrationId, onClose }) => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/payments/bank-details`);
        const result = await response.json();
        
        if (result.success) {
          setPaymentInfo(result.data);
        }
      } catch (error) {
        console.error("Error fetching payment info:", error);
        toast({
          title: "Error",
          description: "Failed to load payment information. Please contact support.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [registrationId, toast]);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [field]: true });
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
      setTimeout(() => {
        setCopied({ ...copied, [field]: false });
      }, 2000);
    } catch (error) {
      toast({
        title: "Copy Failed", 
        description: "Please copy manually",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p>Loading payment information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paymentInfo) {
    return null;
  }

  const { bank_details, payment_calculation } = paymentInfo;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center">
                <CreditCard className="h-6 w-6 mr-3" />
                Payment Information
              </CardTitle>
              <p className="text-emerald-100 mt-2">Complete your KICON 2025 registration payment</p>
            </div>
            <Badge className="bg-white/20 text-white px-4 py-2">
              Registration ID: {registrationId}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bank Account Details */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  Bank Account Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <div>
                      <p className="text-sm text-gray-600">Bank Name</p>
                      <p className="font-semibold text-gray-800">{bank_details.bank_name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(bank_details.bank_name, "Bank Name")}
                      className="h-8"
                    >
                      {copied["Bank Name"] ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <div>
                      <p className="text-sm text-gray-600">Account Name</p>
                      <p className="font-semibold text-gray-800">{bank_details.account_name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(bank_details.account_name, "Account Name")}
                      className="h-8"
                    >
                      {copied["Account Name"] ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="font-semibold text-gray-800 font-mono">{bank_details.account_number}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(bank_details.account_number, "Account Number")}
                      className="h-8"
                    >
                      {copied["Account Number"] ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <div>
                      <p className="text-sm text-gray-600">IFSC Code</p>
                      <p className="font-semibold text-gray-800 font-mono">{bank_details.ifsc_code}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(bank_details.ifsc_code, "IFSC Code")}
                      className="h-8"
                    >
                      {copied["IFSC Code"] ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-sm text-gray-600">Branch</p>
                    <p className="font-semibold text-gray-800">{bank_details.branch}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Calculation */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Banknote className="h-5 w-5 mr-2 text-emerald-600" />
                  Payment Calculation
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Registration Fee (USD)</span>
                    <span className="font-semibold">${payment_calculation.usd_amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Exchange Rate</span>
                    <span className="font-semibold">1 USD = ₹{payment_calculation.exchange_rate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Base Amount (INR)</span>
                    <span className="font-semibold">₹{payment_calculation.base_inr_amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">GST ({payment_calculation.gst_percentage}%)</span>
                    <span className="font-semibold">₹{payment_calculation.gst_amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-emerald-200 pt-4">
                    <div className="flex justify-between items-center p-4 bg-emerald-100 rounded-lg">
                      <span className="text-lg font-bold text-emerald-800">Total Amount</span>
                      <span className="text-xl font-bold text-emerald-800">₹{payment_calculation.total_inr_amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => copyToClipboard(payment_calculation.total_inr_amount.toString(), "Total Amount")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {copied["Total Amount"] ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Amount Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Total Amount
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-amber-600" />
              Payment Instructions
            </h3>
            
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                <p>Transfer <strong>₹{payment_calculation.total_inr_amount.toLocaleString()}</strong> (including 5% GST) to the above bank account</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                <p>Keep the transaction receipt/screenshot as proof of payment</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                <p>Include your <strong>Registration ID: {registrationId}</strong> in the payment reference</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                <p>Send payment proof via email or WhatsApp to our team with your Registration ID</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">5</div>
                <p>Payment confirmation will be processed within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 bg-gray-50 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-3">For Payment Support, Contact:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Abhipriy Gupta</p>
                <p className="text-gray-600">+91-9810571665</p>
                <p className="text-gray-600">+91-8700998182</p>
              </div>
              <div>
                <p className="font-medium">Mr. Parag Tyagi</p>
                <p className="text-gray-600">+91-9999489292</p>
              </div>
              <div>
                <p className="font-medium">Mr. Sanjay Arya</p>
                <p className="text-gray-600">+91-9873577029</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              I Understand - Close
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="flex-1"
            >
              Print Payment Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDetails;