// utils/aboutContent.ts
import {
  TrendingUp,
  Users,
  Code,
  Lightbulb,
  Target,
  Briefcase,
} from "lucide-react";

export const aboutSections = [
  {
    side: "left",
    title: "Our Journey",
    icon: <TrendingUp className="w-8 h-8 mr-4 text-sky-400" />,
    description:
      "We started as a small initiative with a big vision. Through dedication and innovation, we have reached where we are today, focusing on Civil, AutoCAD, and professional design training.",
    imageUrl: "https://media.istockphoto.com/id/2154486391/photo/diverse-group-of-civil-engineer-and-client-working-on-architect-prudent.jpg?s=612x612&w=0&k=20&c=8NSOlLf6bkNq-JuZLybsxfOKxH9y25jKT6QV3rcxXCo=",
    imagePosition: "top",
  },
  {
    side: "left",
    title: "Our Team",
    icon: <Users className="w-8 h-8 mr-4 text-sky-400" />,
    description:
      "Behind our success is a passionate team of talented individuals including CAD experts, civil engineers, and creative instructors dedicated to real-world technical skills.",
  },
  {
    side: "left",
    title: "Tools & Technologies",
    icon: <Code className="w-8 h-8 mr-4 text-sky-400" />,
    tags: [
      "AutoCAD",
      "Revit",
      "Etabs",
      "SAFE",
      "STAAD.Pro",
      "Tekla Structures",
    ],
  },
  
  {
    side: "right",
    title: "Future Vision",
    icon: <Target className="w-8 h-8 mr-4 text-sky-400" />,
    description:
      "Our aim is to expand globally by exploring emerging technologies like AI, BIM, and sustainable design solutions to deliver smarter infrastructure.",
  },
  {
    side: "right",
    title: "Engineering & Innovation",
    icon: <Lightbulb className="w-8 h-8 mr-4 text-sky-400" />,
    description:
      "We are committed to improving lives through engineering solutions in civil, architecture, and structural design. Innovation is at the core of our consultancy.",
    imageUrl: "https://media.istockphoto.com/id/2154486391/photo/diverse-group-of-civil-engineer-and-client-working-on-architect-prudent.jpg?s=612x612&w=0&k=20&c=8NSOlLf6bkNq-JuZLybsxfOKxH9y25jKT6QV3rcxXCo=",
    imagePosition: "bottom",
  },
  {
    side: "right",
    title: "Project Highlights",
    icon: <Briefcase className="w-8 h-8 mr-4 text-sky-400" />,
    isVideo: true,
  },
];
