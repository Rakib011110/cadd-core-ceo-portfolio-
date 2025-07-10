import React, { useState } from "react";
import CourseCard from "./CourseCard";
import { courses } from "@/lib/data/coursesData";
import CommonButton from "@/components/commonUi/CommonButton/CommonButton";

const categories = ["All", "Civil", "Architectural", "Bim"];

const CourseTabs = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredCourses = courses.filter((course) =>
    course.category.includes(activeTab)
  );

  return ( 
    <div className=" max-w-6xl mx-auto mt-10 ">
      {/* 🔥 Section Heading */}
      <div className="text-center mb-14 mt-14 px-4">
        <div className="relative inline-block max-w-2xl mx-auto">
          {/* Decorative Corners */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-gray-300 dark:border-gray-600"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-gray-300 dark:border-gray-600"></div>

          {/* Title + Subtitle */}
          <div className="px-8 py-4">
            <h2 className="text-3xl sm:text-4xl uppercase font-bold text-gray-900 dark:text-white">
              Most{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Popular
              </span>{" "}
              Courses
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Choose from hundreds of courses from specialist organizations
            </p>
          </div>
        </div>
      </div>

      {/* 🔖 Tabs */}
      <div className="flex flex-wrap justify-center gap-9 mb-8 backdrop-blur-lg dark:bg-gray-950 dark:border-2 dark:border-blue-950 bg-blue-100 p-3 ">
        {categories.map((cat) => (
        <CommonButton     key={cat}>

  <p
        
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-md   text-sm font-semibold border transition-all duration-300
              ${
                activeTab === cat
                  ? ""
                  : ""
              }`}>
            {cat} Courses
          </p>

        </CommonButton>
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
