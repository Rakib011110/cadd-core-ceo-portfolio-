// components/BadgeWallet.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";






type BadgeItem = {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  expires?: string;
  photoUrl?: string;
};

const badgeData: BadgeItem[] = [
  {
    id: "1",
    title: "Autodesk Certified Instructor - Standard",
    issuer: "Autodesk",
    expires: "Jan 31, 2028",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751950777/autodesk_xdgjv0.png"
  },
  {
    id: "2",
    title: "Microsoft Certified Trainer 2023-2024",
    issuer: "Microsoft",
    issueDate: "Jul 27, 2023",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751951953/Microsoft_Certified_Trainer_2023-2024_x3njqq.png"
  },
  {
    id: "3",
    title: "Microsoft Certified Trainer 2022-2023",
    issuer: "Microsoft",
    issueDate: "Jul 27, 2022",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751952018/Microsoft_Certified_Trainer_2022-2023_e3t2de.png"
  },
  {
    id: "4",
    title: "Microsoft Certified Trainer 2021-2022",
    issuer: "Microsoft",
    issueDate: "Jul 27, 2021",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751954524/Microsoft_Certified_Trainer_2021-2022_innpmk.png"
  },
  {
    id: "5",
    title: "Microsoft Office Specialist: Expert (Office 2019)",
    issuer: "Microsoft",
    issueDate: "Jun 27, 2021",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751954690/Microsoft_Office_Specialist_Associate_Office_2019_fsahcx.png"
  },
  {
    id: "6",
    title: "Microsoft Office Specialist: Microsoft Word Expert (Office 2019)",
    issuer: "Microsoft",
    issueDate: "Jun 27, 2021",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751954749/MOS_Excel_Expert6_q8z3ul.png"
  },
  {
    id: "7",
    title: "Microsoft Office Specialist: Microsoft Excel Expert (Office 2019)",
    issuer: "Microsoft",
    issueDate: "Jun 16, 2021",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751952018/Microsoft_Certified_Trainer_2022-2023_e3t2de.png"
  },
  {
    id: "8",
    title: "Microsoft Office Specialist: Associate (Office 2019)",
    issuer: "Microsoft",
    issueDate: "Jun 14, 2021",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751954798/MOS_Word_Expert1_envf0s.png"
  },
  {
    id: "9",
    title: "Microsoft Office Specialist: PowerPoint Associate (Office 2019)",
    issuer: "Microsoft",
    issueDate: "Jun 14, 2021",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751965286/MOS_PowerPoint_wyfjym.png"
  },
  {
    id: "10",
    title: "Microsoft Office Specialist: Excel Associate (Office 2019)",
    issuer: "Microsoft",
    issueDate: "May 29, 2021",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751965354/MOS_Excel_qjpzxu.png"
  },

  {
    id: "11",
    title: "Microsoft Office Specialist: Word Associate (Office 2019)",
    issuer: "Microsoft",
    issueDate: "Feb 15, 2021",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751965396/MOS_Word_1_n3awxe.png"
  },
  {
    id: "12",
    title: "Autodesk Revit Architecture Certified User",
    issuer: "Autodesk",
    issueDate: "Jul 9, 2017",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751965450/image_tyydp0.png"
  },
  {
    id: "13",
    title: "Autodesk AutoCAD Certified User",
    issuer: "Autodesk",
    issueDate: "Jun 16, 2017",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751965519/Autodesk_AutoCAD_Certified_User_jbrrhp.png"
  },
  {
    id: "14",
    title: "AutoCAD Certified Professional",
    issuer: "Autodesk",
    photoUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1751965557/Autodesk_AutoCAD_Professional_NV_ef3gyw.png"
  }
];


const BadgeWallet = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showAll, setShowAll] = useState(false);
  const [initialBadges] = useState(6); // Show 4 badges initially

  const filteredBadges = badgeData
    .filter((badge) =>
      badge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.issuer.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.issueDate || 0).getTime() - new Date(a.issueDate || 0).getTime();
      }
      return 0;
    });

  const badgesToShow = showAll ? filteredBadges : filteredBadges.slice(0, initialBadges);

  return (
    <div className="max-w-6xl mx-auto p-6 ">
 <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10  px-4">
          <div className="relative inline-block max-w-2xl mx-auto">
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-gray-300 dark:border-gray-600"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-gray-300 dark:border-gray-600"></div>

            {/* Title + Subtitle */}
            <div className="px-8 py-4">
              <h2 className="text-3xl sm:text-4xl uppercase font-bold text-gray-900 dark:text-white">
               Professional{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                  Badges
                </span>
              </h2>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                   Professional credentials that validate my expertise and commitment to continuous learning
              </p>
            </div>
          </div>
        </motion.div>



      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
      >
        <div className="w-full md:w-1/2">
          <Input
            placeholder="Search certifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-auto flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Most Recent</SelectItem>
              <SelectItem value="date">Issue Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="relative">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {badgesToShow.map((badge, index) => (
              <motion.div
                key={badge.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-10 group-hover:opacity-20 transition-opacity" />
                      <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg shadow-md">
                        {badge.photoUrl ? (
                          <img
                            src={badge.photoUrl}
                            alt={badge.title}
                            className="w-24 h-auto rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">No Image Available</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-2">{badge.title}</h3>
                      <p className="text-muted-foreground">{badge.issuer}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {badge.issueDate && (
                          <Badge variant="secondary" className="text-xs font-medium">
                            🗓️ {badge.issueDate}
                          </Badge>
                        )}
                        {badge.expires && (
                          <Badge variant="secondary" className="text-xs font-medium">
                            ⏳ Expires {badge.expires}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredBadges.length > initialBadges && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="gap-2"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show All Certifications ({filteredBadges.length})
                </>
              )}
            </Button>
          </motion.div>
        )}

        {filteredBadges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No certifications found matching your search</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BadgeWallet;