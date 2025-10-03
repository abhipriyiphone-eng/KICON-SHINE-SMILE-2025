import React from "react";
import { Separator } from "./ui/separator";
import { Phone, MapPin, Globe } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">KICON 2025</h3>
                <p className="text-gray-400 text-sm">Shine & Smile</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              An exclusive Indo-Korean convention bridging the future of dermatology, 
              dentistry, and aesthetic innovation.
            </p>
            <div className="flex space-x-2">
              <span className="text-2xl">🇮🇳</span>
              <span className="text-gray-400">×</span>
              <span className="text-2xl">🇰🇷</span>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">Event Details</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-teal-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">November 24-26, 2025</p>
                  <p className="text-gray-400 text-sm">3-Day Convention</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-teal-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Inspire Entertainment Resort</p>
                  <p className="text-gray-400 text-sm">Incheon, South Korea</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">Quick Links</h4>
            <div className="space-y-3">
              {[
                "About KICON",
                "Event Schedule",
                "Registration", 
                "Venue Information",
                "Gallery",
                "Contact Us"
              ].map((link, index) => (
                <a 
                  key={index}
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-teal-400 mt-0.5" />
                <div className="space-y-1">
                  <a href="tel:+91-9810571665" className="block text-gray-300 hover:text-white transition-colors">
                    +91-9810571665
                  </a>
                  <a href="tel:+91-9999489292" className="block text-gray-300 hover:text-white transition-colors">
                    +91-9999489292
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-teal-400 mt-0.5" />
                <div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    DSC- 317 Southcourt Mall<br />
                    District Center Saket<br />
                    New Delhi-110017
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-gray-700" />

        {/* Organizers Section */}
        <div className="text-center mb-8">
          <h4 className="text-lg font-semibold mb-4 text-emerald-400">Organized By</h4>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8">
            <span className="text-white font-semibold">AryaD Consulting & Projects Pvt Ltd</span>
            <span className="text-gray-400 hidden md:block">×</span>
            <span className="text-white font-semibold">U&I International Korea</span>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-400 text-sm">
            © {currentYear} KICON: Shine & Smile. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-400 text-sm">
              Where Science Meets Beauty, and Collaboration Shapes the Future
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;