import React from "react";

const StateSection = () => {
  return (
    <div>
      <div className="grid mb-10 max-w-7xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {/* Trained Students */}
        <div className="bg-yellow-50 p-6 rounded-lg text-center shadow-sm">
          <div className="text-yellow-500 text-4xl mb-2">💼</div>
          <h3 className="text-2xl font-bold text-gray-800">10K+</h3>
          <p className="text-gray-600">Trained Students</p>
        </div>

        {/* Professional Courses */}
        <div className="bg-gray-100 p-6 rounded-lg text-center shadow-sm">
          <div className="text-blue-600 text-4xl mb-2">📚</div>
          <h3 className="text-2xl font-bold text-gray-800">5+</h3>
          <p className="text-gray-600">Professional Courses</p>
        </div>

        {/* Corporate Trainings */}
        <div className="bg-purple-100 p-6 rounded-lg text-center shadow-sm">
          <div className="text-purple-600 text-4xl mb-2">🏢</div>
          <h3 className="text-2xl font-bold text-gray-800">50+</h3>
          <p className="text-gray-600">Corporate Trainings</p>
        </div>

        {/* Years of Experience */}
        <div className="bg-cyan-100 p-6 rounded-lg text-center shadow-sm">
          <div className="text-cyan-600 text-4xl mb-2">📆</div>
          <h3 className="text-2xl font-bold text-gray-800">12+</h3>
          <p className="text-gray-600">Years Experience</p>
        </div>
      </div>
    </div>
  );
};

export default StateSection;
