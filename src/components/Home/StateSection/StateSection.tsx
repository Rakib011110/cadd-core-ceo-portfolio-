"use client";
import React from "react";
import CountUp from "react-countup";

const StateSection = () => {
  const stats = [
    {
      icon: "💼",
      number: 10000,
      suffix: "+",
      label: "Trained Students",
      bg: "bg-yellow-50",
      iconColor: "text-yellow-500",
    },
    {
      icon: "📚",
      number: 5,
      suffix: "+",
      label: "Professional Courses",
      bg: "bg-gray-100",
      iconColor: "text-blue-600",
    },
    {
      icon: "🏢",
      number: 50,
      suffix: "+",
      label: "Corporate Trainings",
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: "📆",
      number: 12,
      suffix: "+",
      label: "Years Experience",
      bg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
  ];

  return (
    <div className="">
      <div className="grid mt-10 mb-10 max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`${item.bg} p-6 rounded-lg text-center border dark:border-blue-700 shadow-sm dark:bg-gray-900`}
          >
            <div className={`${item.iconColor} text-4xl mb-2`}>{item.icon}</div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              <CountUp end={item.number} duration={2.5} separator="," />
              {item.suffix}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StateSection;
