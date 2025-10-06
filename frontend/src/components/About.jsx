import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sparkles, Globe, HandHeart, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { packageInclusions, packageExclusions } from "../mock/mockData";

const About = () => {
  const highlights = [
    {
      icon: <Sparkles className="h-8 w-8 text-emerald-500" />,
      title: "Exclusive Experience",
      description: "Limited to 200 delegates for intimate networking and personalized attention"
    },
    {
      icon: <Globe className="h-8 w-8 text-teal-500" />,
      title: "Indo-Korean Partnership", 
      description: "Bridge between Indian healthcare market and Korean innovation excellence"
    },
    {
      icon: <HandHeart className="h-8 w-8 text-emerald-500" />,
      title: "Medical Excellence",
      description: "Focus on Dermatology, Dentistry, and Aesthetic Innovation advances"
    },
    {
      icon: <Award className="h-8 w-8 text-teal-500" />,
      title: "Luxury Hospitality",
      description: "5-star accommodation, cultural immersion, and premium Korean experience"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium mb-4">
            About KICON 2025
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Where Science Meets Beauty
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            KICON: Shine & Smile 2025 is a landmark Indo-Korean convention uniting the brightest minds 
            in dermatology, dentistry, and aesthetic innovation. Experience Korea's advanced technologies 
            while building strategic partnerships for the future.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {highlights.map((highlight, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">
                  {highlight.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{highlight.title}</h3>
                <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Package Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Inclusions */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <Sparkles className="h-6 w-6 text-emerald-500 mr-3" />
                Package Inclusions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {packageInclusions.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-emerald-50 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600 text-center">
                  All Inclusive Package: USD $3,000
                </p>
                <p className="text-sm text-gray-600 text-center mt-1">Per delegate</p>
                <p className="text-xs text-orange-600 text-center mt-2 font-semibold">
                  *GST Extra as applicable
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Exclusions */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <Award className="h-6 w-6 text-orange-500 mr-3" />
                Package Exclusions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {packageExclusions.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-orange-50 rounded-xl">
                <p className="text-lg font-semibold text-orange-600 text-center">
                  Please Budget Separately
                </p>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Travel insurance is strongly recommended
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Join KICON 2025?</h3>
            <p className="text-xl mb-8 text-emerald-100">
              Secure your spot at this exclusive Indo-Korean medical convention
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <button className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-colors duration-200">
                  Register Now
                </button>
              </Link>
              <button 
                onClick={() => {
                  // Create a download link for the brochure
                  const link = document.createElement('a');
                  link.href = '/KICON_2025_Details.pdf';
                  link.download = 'KICON_2025_Details.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors duration-200"
              >
                Download Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;