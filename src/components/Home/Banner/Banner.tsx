/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";
import { TypeAnimation } from "react-type-animation";

const App = () => {
  return (
    <>
      <style>{`
        @keyframes pulse-grow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        @keyframes bounce-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .floating-element-1 {
          animation: bounce-float 3s ease-in-out infinite;
        }
        .floating-element-2 {
          animation: bounce-float 3.5s ease-in-out infinite alternate;
        }
        .floating-element-3 {
          animation: bounce-float 2.8s ease-in-out infinite;
        }
        .decorative-shape-pulse {
          animation: pulse-grow 2s ease-in-out infinite;
        }
        .bg-ellipse {
          position: absolute;
          width: 800px;
          height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(144, 202, 249, 0.3) 0%, rgba(144, 202, 249, 0) 70%);
          filter: blur(80px);
          z-index: 0;
          top: 50%;
          right: 0%;
          transform: translate(50%, -50%);
        }
        .bg-dots {
          position: absolute;
          width: 150px;
          height: 150px;
          top: 20%;
          left: 5%;
          z-index: 0;
          background-image: radial-gradient(#d1d5db 1px, transparent 1px);
          background-size: 10px 10px;
          opacity: 0.4;
          transform: rotate(45deg);
        }
      `}</style>

      <div className="relative min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="bg-ellipse hidden lg:block"></div>
        <div className="bg-dots hidden lg:block"></div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 relative z-10">
          {/* Text Area */}
          <div className="flex-1 text-center lg:text-left py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-gray-900 dark:text-white">
              <span className="block">Engr. Hachnayen Ahmed</span>
              <TypeAnimation
                sequence={[
                  "Founder & CEO - CADD CORE",
                  2000,
                  "Senior Consultant - MAK Consultants",
                  2000,
                  "10+ Years Teaching Experience",
                  2000,
                  "BIM & AutoCAD Trainer",
                  2000,
                  "Structural Analysis Specialist",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-blue-600 dark:text-yellow-400 block text-2xl sm:text-3xl lg:text-4xl mt-2 font-semibold"
              />
            </h1>

            <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Empowering students with professional BIM modeling, structural
              analysis, AutoCAD, and design skills.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2">
              <span className="flex items-center text-gray-700 dark:text-gray-200 text-lg font-medium">
                <svg
                  className="w-6 h-6 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Learn with experts
              </span>
              <span className="flex items-center text-gray-700 dark:text-gray-200 text-lg font-medium">
                <svg
                  className="w-6 h-6 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Get certificate
              </span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="px-8 py-3 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 w-full sm:w-auto">
                Get Started
              </button>
              <button className="px-8 py-3 bg-white border border-gray-300 text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 w-full sm:w-auto flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Watch Video
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="relative flex-1 flex justify-center lg:justify-end w-full lg:w-auto mt-12 lg:mt-0">
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-[450px] h-[450px]  sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full bg-blue-600 dark:bg-blue-800 opacity-80 filter blur-3xl transform scale-105"></div>
            </div>

            <img
              src="https://res.cloudinary.com/dalpf8iip/image/upload/v1751277732/Engr._Hachnayen_Ahmed-removebg-preview_cufiya.png"
              alt="Smiling Student"
              className="relative z-10 border-4 w-72 h-96  sm:w-80 sm:h-[400px] lg:w-96 lg:h-[480px] object-cover rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src =
                  "https://placehold.co/400x500/A0B9D8/ffffff?text=Image+Not+Found";
              }}
            />

            {/* Floating Elements */}
            <div className="absolute top-8 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg flex items-center justify-center floating-element-1">
              <Image
                src="https://res.cloudinary.com/dalpf8iip/image/upload/v1751278827/autodesk_revit-logo_brandlogos.net_4hpe4_zhuapb.png"
                alt="Revit Icon"
                width={32}
                height={32}
              />
            </div>

            <div className="absolute top-1/4 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg flex items-center justify-center floating-element-2">
              <Image
                src="https://res.cloudinary.com/dalpf8iip/image/upload/v1751278647/autocad-seeklogo_kqapfh.png"
                alt="AutoCAD Icon"
                width={32}
                height={32}
              />
            </div>

            <div className="absolute  bottom-0 right-0 z-10 transform translate-x-1/3 -translate-y-1/8 backdrop-blur-md  text-white p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center  -rotate-3 hover:rotate-0 transition duration-300 text-sm md:text-base floating-element-3">
              <p className="font-semibold mb-2">Our daily new students</p>
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900"
                  src="https://placehold.co/32x32/FF6347/ffffff?text=S1"
                  alt="Student 1"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900"
                  src="https://placehold.co/32x32/4682B4/ffffff?text=S2"
                  alt="Student 2"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900"
                  src="https://placehold.co/32x32/DAA520/ffffff?text=S3"
                  alt="Student 3"
                />
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-800 text-xs font-medium text-white ring-2 ring-white dark:ring-gray-900">
                  +5K
                </span>
              </div>
            </div>

            <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-100 dark:bg-yellow-800 p-3 rounded-full shadow-xl flex items-center justify-center floating-element-2">
              <svg
                className="w-6 h-6 text-yellow-600 dark:text-yellow-200"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zm-6 8a5 5 0 0110 0v2a1 1 0 11-2 0v-2a3 3 0 00-6 0v2a1 1 0 11-2 0v-2z"></path>
              </svg>
            </div>

            <div className="absolute top-[10%] left-[60%] w-3 h-3 bg-blue-300 rounded-full decorative-shape-pulse"></div>
            <div className="absolute bottom-[20%] right-[60%] w-4 h-4 bg-pink-300 rounded-lg transform rotate-45 decorative-shape-pulse"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
