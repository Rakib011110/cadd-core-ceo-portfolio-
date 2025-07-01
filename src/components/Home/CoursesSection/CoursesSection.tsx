import React, { useState } from "react";
import CourseCard from "./CourseCard";
import { courses } from "@/lib/data/coursesData";

const categories = ["All", "Civil", "Architectural", "Bim"];

const CourseTabs = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredCourses = courses.filter((course) =>
    course.category.includes(activeTab)
  );

  return (
    <div className=" max-w-7xl mx-auto mt-10 ">
      {/* 🔥 Section Heading */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl uppercase font-bold text-gray-900 dark:text-white">
          Most Popular Courses
        </h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Choose from hundreds of courses from specialist organizations
        </p>
      </div>

      {/* 🔖 Tabs */}
      <div className="flex flex-wrap justify-center gap-9 mb-8 backdrop-blur-lg bg-blue-100 p-3 ">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-md   text-sm font-semibold border transition-all duration-300
              ${
                activeTab === cat
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}>
            {cat} Courses
          </button>
        ))}
      </div>

      {/* 📚 Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, idx) => (
          <CourseCard key={idx} {...course} />
        ))}
      </div>
    </div>
  );
};

export default CourseTabs;
