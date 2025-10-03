import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Phone, MapPin, Clock, Users } from "lucide-react";
import { contactInfo } from "../mock/mockData";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium mb-4">
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Contact Information
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about KICON 2025? Our team is ready to assist you with registration, 
            travel arrangements, and any other inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Details */}
          <div className="space-y-8">
            {/* Office Address */}
            <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                  <MapPin className="h-6 w-6 text-emerald-600 mr-3" />
                  Office Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {contactInfo.office.address}
                </p>
              </CardContent>
            </Card>

            {/* Contact Persons */}
            <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                  <Phone className="h-6 w-6 text-blue-600 mr-3" />
                  Contact Representatives
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {contactInfo.contacts.map((contact, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">{contact.name}</h4>
                      <div className="space-y-1">
                        {contact.phones.map((phone, phoneIndex) => (
                          <a 
                            key={phoneIndex}
                            href={`tel:${phone}`} 
                            className="block text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="space-y-8">
            {/* Business Hours */}
            <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                  <Clock className="h-6 w-6 text-orange-600 mr-3" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Monday - Friday</span>
                    <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Saturday</span>
                    <span className="text-gray-600">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Sunday</span>
                    <span className="text-gray-600">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                  <Users className="h-6 w-6 text-purple-600 mr-3" />
                  Registration Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <p className="text-red-700 font-semibold">Limited Seats Available</p>
                    <p className="text-red-600 text-sm">Only 200 delegates will be accepted</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                    <p className="text-emerald-700 font-semibold">Early Registration Discount</p>
                    <p className="text-emerald-600 text-sm">Register before October 17, 2025</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-blue-700 font-semibold">Visa Processing Included</p>
                    <p className="text-blue-600 text-sm">We handle all Korean visa formalities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Register?</h3>
            <p className="text-xl mb-8 text-emerald-100">
              Contact our team today or proceed with online registration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-colors duration-200">
                Start Registration
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors duration-200">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;