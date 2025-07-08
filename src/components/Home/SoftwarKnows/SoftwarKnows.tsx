/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  hover: {
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const technologies = [
  {
    name: "AutoCAD",
    photoUrl:
      "https://res.cloudinary.com/dalpf8iip/image/upload/v1751278647/autocad-seeklogo_kqapfh.png",
  },
  {
    name: "Revit",
    photoUrl:
      "https://res.cloudinary.com/dalpf8iip/image/upload/v1751278827/autodesk_revit-logo_brandlogos.net_4hpe4_zhuapb.png",
  },
  {
    name: "Etabs",
    photoUrl: "https://hlc.so/wp-content/uploads/2023/10/etabs.png",
  },
  {
    name: "SAFE",
    photoUrl:
      "https://computerindonesia.com/wp-content/uploads/2024/03/SAFE-Logo.png",
  },
  {
    name: "STAAD.Pro",
    photoUrl:
      "https://images.softwaresuggest.com/software_logo/staadpro-20231006122851.png",
  },
  {
    name: "Tekla Structures",
    photoUrl:
      "https://www.digisoft-za.co.za/wp-content/uploads/2025/05/Tekla-logo-01.png",
  },
];

export default function TechnologySection() {
  return (
    <div className="bg-white dark:bg-gray-900 py-8 sm:py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14  px-4">
          <div className="relative inline-block max-w-2xl mx-auto">
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-gray-300 dark:border-gray-600"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-gray-300 dark:border-gray-600"></div>

            {/* Title + Subtitle */}
            <div className="px-8 py-4">
              <h2 className="text-3xl sm:text-4xl uppercase font-bold text-gray-900 dark:text-white">
                Technologies{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                  We Work With
                </span>
              </h2>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                We utilize industry-leading software to deliver precision and
                excellence in every project.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-3 md:grid-cols-6">
            {technologies.map((tech) => (
              <motion.div
                key={tech.name}
                variants={item as any}
                whileHover="hover"
                className="group">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200/80 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-400 transition-all duration-300 ease-in-out h-full flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex justify-center items-center h-20 w-20">
                    <Image
                      src={tech.photoUrl}
                      alt={tech.name}
                      width={80}
                      height={80}
                      className="object-contain filter group-hover:brightness-110 transition-all duration-300"
                    />
                  </motion.div>
                  <p className="mt-4 font-semibold text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    {tech.name}
                  </p>
                  <div className="mt-2 h-1 w-8 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
