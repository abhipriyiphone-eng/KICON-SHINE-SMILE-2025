import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/static/gallery`);
        const result = await response.json();
        
        if (result.success) {
          const imageUrls = result.data.map(item => item.url);
          setGalleryImages(imageUrls);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        // Fallback to Korean medical device images if API fails
        setGalleryImages([
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/4172tad4_1.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/huaffgtt_2.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/3ik974zx_3.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/a4f0i3we_4.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/nq4sasfb_5.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/xfkrzle3_6.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/y8d9ykz6_7.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/gval6jrf_8.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/9tygukcs_11.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/gjhi3qcj_12.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/hk59ucf0_13.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/ousq7oic_15.jpg",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/b8m9u2xc_16.avif",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/w02uxl54_9.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/rr5gltoq_10.png",
          "https://customer-assets.emergentagent.com/job_korea-mice-event/artifacts/wqwbef4q_17.png"
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const openModal = (index) => {
    setSelectedImage(galleryImages[index]);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + galleryImages.length) % galleryImages.length
      : (currentIndex + 1) % galleryImages.length;
    
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium mb-4">
            Event Gallery
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Experience Korea's Beauty
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore the world of advanced dental equipment, cutting-edge skincare devices, 
            and professional medical environments at KICON 2025 Indo-Korean medical convention.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading gallery images...</p>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && galleryImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {galleryImages.map((image, index) => (
            <Card 
              key={index}
              className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              onClick={() => openModal(index)}
            >
              <div className="relative overflow-hidden aspect-square">
                <img 
                  src={image} 
                  alt={`KICON Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                    <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        )}

        {/* Empty State */}
        {!loading && galleryImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No gallery images available.</p>
          </div>
        )}

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors duration-200 z-10"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors duration-200 z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors duration-200 z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image */}
              <img 
                src={selectedImage} 
                alt="Gallery Preview"
                className="w-full h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Create Your Own Memories at KICON 2025
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Join us for an unforgettable journey of learning, networking, and cultural immersion
            </p>
            <Link to="/register">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Register for KICON 2025
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;