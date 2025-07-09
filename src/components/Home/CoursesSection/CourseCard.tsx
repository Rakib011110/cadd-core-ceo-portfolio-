"use client";

import React from "react";
import { Book, Clock, ArrowRight, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import CommonButton from "@/components/commonUi/CommonButton/CommonButton";

const CourseCard: React.FC<{
  title: string;
  duration: string;
  lessons: string;
  projects: string;
  photoUrl: string;
  slug: string;
  softwaresTaught: { softwareTitle: string; photoUrl: string }[];
}> = ({
  title,
  duration,
  lessons,
  projects,
  photoUrl,
  slug,
  softwaresTaught,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group h-full">
      <Link href={`/courses/${slug}`} className="block h-full">
        <Card className="p-0 flex flex-col h-full rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-colors duration-300 shadow-sm hover:shadow-lg">
          {/* Image Section */}
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={photoUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 min-h-[56px]">
              {title}
            </h3>

            <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4 text-red-500" />
                <span>{lessons}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-red-500" />
                <span>{projects}</span>
              </div>
            </div>

            <div className="flex-grow" />

            {/* Software Section */}
            {softwaresTaught?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Tools You&apos;ll Learn
                </p>
                <div className="flex flex-wrap items-center gap-2 transition-transform duration-500 ease-in-out group-hover:scale-110">
                  {softwaresTaught.slice(0, 5).map((software, idx) => (
                    <Image
                      key={idx}
                      src={software.photoUrl}
                      alt={software.softwareTitle}
                      width={600}
                      height={600}
                      className="rounded-full w-14 h-8 bg-gray-100 p-1 object-contain"
                      title={software.softwareTitle}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Button */}
            <div className="font-semibold  text-red-500 flex items-center gap-1.5 transition-all duration-300 group-hover:gap-2.5">
        

<CommonButton >
 <p className="flex items-center gap-1">
   View Course <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
 </p>
</CommonButton>

            
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
