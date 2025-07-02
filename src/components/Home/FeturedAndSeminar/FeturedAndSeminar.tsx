"use client";

import { ArrowRight, Clock, MapPin, ShoppingCart } from "lucide-react";

interface Seminar {
  topic: string;
  place: string;
  date: string;
  time: string;
  type: "Free" | "Paid";
  price?: number;
  link: string;
}

interface Product {
  name: string;
  price: number;
  description: string;
  imagePlaceholder: string;
  link: string;
}

// --- MOCK DATA ---
const seminarsData: Seminar[] = [
  {
    topic: "RCC Building Structural Analysis Design & Detailing Mastercourse",
    place: "ONLINE",
    date: "2025-07-04",
    time: "9:00 PM",
    type: "Paid",
    price: 5000,
    link: "#",
  },
  {
    topic: "Professional AutoCAD Mastercourse (Civil & Arch)",
    place: "ONLINE",
    date: "2025-07-10",
    time: "8:00 PM",
    type: "Free",
    link: "#",
  },
  {
    topic: "Professional Architectural BIM Modeling Mastercourse",
    place: "ONLINE",
    date: "2025-07-18",
    time: "9:00 PM",
    type: "Paid",
    price: 7500,
    link: "#",
  },
];

const productsData: Product[] = [
  {
    name: "BIM Modeling Using Revit Mastercourse",
    price: 30000,
    description:
      "A comprehensive course covering everything from basic to advanced structural analysis and design using Revit.",
    imagePlaceholder: "🏗️",
    link: "#",
  },
  {
    name: "Professional AutoCAD Mastercourse",
    price: 3000,
    description:
      "Master AutoCAD for civil and architectural drafting. Learn 2D drawings and 3D modeling from scratch.",
    imagePlaceholder: "📐",
    link: "#",
  },
  {
    name: "RCC Building Structural Analysis, Design and Detailing Mastercourse",
    price: 3000,
    description:
      "An in-depth course on RCC building design, covering analysis, design principles, and detailing techniques.",
    imagePlaceholder: "📖",
    link: "#",
  },
];

// --- HELPER FUNCTIONS ---
const formatSeminarDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = date.getDate().toString().padStart(2, "0");
  return { month, day };
};

export default function FeturedAndSeminar() {
  return (
    <div className=" bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 mt-10 sm:px-6 lg:px-8">
        <div className="text-center   mb-10  mt-10">
          <h1>
            <p className="text-3xl font-bold text-gray-900 uppercase">
              Featured Seminars & Products
            </p>
            <p className="text-lg text-gray-600">
              {" "}
              - Stay updated with our latest offerings
            </p>
          </h1>
        </div>

        {/* New Seminars & Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
          {/* Upcoming Seminars Column */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b-2 border-blue-500 pb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Upcoming Seminars
              </h2>
              <a
                href="#"
                className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                VIEW ALL →
              </a>
            </div>
            <div className="space-y-4">
              {seminarsData.map((seminar, index) => {
                const { month, day } = formatSeminarDate(seminar.date);
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-center">
                      <p className="text-sm font-bold text-red-600">{month}</p>
                      <p className="text-3xl font-extrabold text-gray-800">
                        {day}
                      </p>
                    </div>

                    <div className="flex-1 border-l-2 pl-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {seminar.topic}
                      </h3>

                      <div className="flex items-center text-md text-gray-500 mb-3">
                        <MapPin size={14} className="mr-2" /> {seminar.place}
                        <Clock size={14} className="ml-4 mr-2" /> {seminar.time}
                      </div>
                      <div className="flex items-center justify-between">
                        {seminar.type === "Free" ? (
                          <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                            FREE
                          </span>
                        ) : (
                          <span className="text-xs font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                            ৳{seminar.price}
                          </span>
                        )}
                        <a
                          href={seminar.link}
                          className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800">
                          Register Now <ArrowRight size={16} className="ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Products Column */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-700 pb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Featured Products
              </h2>
              <a
                href="#"
                className="text-sm font-semibold text-gray-600 hover:text-gray-800">
                VIEW ALL →
              </a>
            </div>
            <div className="space-y-4">
              {productsData.map((product, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-3xl">
                    {product.imagePlaceholder}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 my-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-extrabold text-blue-600">
                        ৳{product.price}
                      </p>
                      <a
                        href={product.link}
                        className="flex items-center text-sm font-bold text-gray-700 hover:text-blue-600">
                        View Details <ShoppingCart size={16} className="ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        /* ... Animation CSS from previous step ... */
      `}</style>
    </div>
  );
}
