import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, Calendar, MapPin } from "lucide-react";
import { scheduleData } from "../mock/mockData";

const Schedule = () => {
  return (
    <section id="schedule" className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-teal-100 text-teal-800 px-4 py-2 text-sm font-medium mb-4">
            Event Schedule
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            4-Day Intensive Program
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A carefully curated journey from welcome to farewell, packed with learning, 
            networking, and cultural experiences in beautiful Korea.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {scheduleData.map((day, dayIndex) => (
            <div key={dayIndex} className="mb-12 last:mb-0">
              {/* Day Header */}
              <div className="flex items-center mb-8">
                <div className="flex items-center space-x-4 bg-white rounded-2xl shadow-lg px-8 py-4">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{day.date}</h3>
                    <p className="text-emerald-600 font-semibold">{day.title}</p>
                  </div>
                </div>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {day.events.map((event, eventIndex) => (
                  <Card 
                    key={eventIndex} 
                    className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-white overflow-hidden"
                  >
                    <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 pb-4">
                      <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-semibold">{event.time}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-200">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600 leading-relaxed">{event.description}</p>
                      <div className="mt-4 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Venue Information */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-slate-800 to-gray-900 text-white border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <MapPin className="h-12 w-12 text-emerald-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">Inspire Entertainment Resort</h3>
                <p className="text-xl text-gray-200 mb-2">Incheon, South Korea</p>
                <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  A luxurious, premier wellness and hospitality destination offering world-class 
                  amenities and the perfect backdrop for our prestigious medical convention.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Reminder */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-2xl shadow-xl px-8 py-6">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-lg font-semibold text-gray-800">
              Limited to 200 delegates only - Register now to secure your spot!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;