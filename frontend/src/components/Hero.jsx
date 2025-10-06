import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar, MapPin, Users, Plane } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          {/* Flags */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center space-x-3">
              <img 
                src="https://flagcdn.com/w40/in.png" 
                alt="India Flag" 
                className="w-8 h-6 rounded-sm shadow-lg"
              />
              <span className="text-white font-semibold">India</span>
            </div>
            <div className="w-12 h-0.5 bg-white/50"></div>
            <div className="flex items-center space-x-3">
              <img 
                src="https://flagcdn.com/w40/kr.png" 
                alt="Korea Flag" 
                className="w-8 h-6 rounded-sm shadow-lg"
              />
              <span className="text-white font-semibold">Korea</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            KICON 2025
            <span className="block text-3xl md:text-4xl text-emerald-400 font-light mt-2">
              Shine & Smile
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            An Exclusive Indo-Korean Convention where <span className="text-emerald-400 font-semibold">Science Meets Beauty</span>,
            and <span className="text-teal-400 font-semibold">Collaboration Shapes the Future</span>
          </p>

          {/* Key Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
              <Calendar className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold">November 24-26</p>
              <p className="text-gray-300 text-sm">2025</p>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
              <MapPin className="h-8 w-8 text-teal-400 mx-auto mb-3" />
              <p className="text-white font-semibold">Incheon, Korea</p>
              <p className="text-gray-300 text-sm">Inspire Resort</p>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
              <Users className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold">Limited to 200</p>
              <p className="text-gray-300 text-sm">Exclusive Seats</p>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
              <Plane className="h-8 w-8 text-teal-400 mx-auto mb-3" />
              <p className="text-white font-semibold">All Inclusive</p>
              <p className="text-gray-300 text-sm">USD $3,000</p>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl transform transition-all duration-200 hover:scale-105 hover:shadow-emerald-500/25"
              >
                Register Now - Limited Seats
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={async () => {
                try {
                  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
                  const link = document.createElement('a');
                  link.href = `${BACKEND_URL}/api/brochure/download`;
                  link.download = 'KICON_2025_Brochure.html';
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } catch (error) {
                  console.error('Error downloading brochure:', error);
                  // Fallback to view in new tab
                  window.open(`${process.env.REACT_APP_BACKEND_URL}/api/brochure/view`, '_blank');
                }
              }}
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
            >
              Download Brochure
            </Button>
          </div>

          {/* Organizers */}
          <div className="mt-16 text-center">
            <p className="text-gray-300 mb-4">Organized by</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8">
              <span className="text-white font-semibold text-lg">AryaD Consulting & Projects Pvt Ltd</span>
              <span className="text-gray-400 hidden sm:block">×</span>
              <span className="text-white font-semibold text-lg">U&I International Korea</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;