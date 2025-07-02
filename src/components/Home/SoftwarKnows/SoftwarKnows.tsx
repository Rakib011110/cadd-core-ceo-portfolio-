import Image from "next/image";
import React from "react";

// --- SVG Icons for Logos ---
// // Using SVG components for better performance, scalability, and styling control.
// const AutocadIcon = () => (
//   <svg
//     role="img"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-12 w-12 text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
//     <title>AutoCAD</title>
//     <path
//       fill="currentColor"
//       d="M12 2.625.755 12.338V12.75h2.43v8.625h17.63v-8.625h2.43v-.412L12 2.625Zm0 1.34L22.02 12H1.98L12 3.965ZM3.938 13.5v7.125h-1.5V13.5h1.5Zm16.125 0v7.125h-1.5V13.5h1.5ZM6.313 6.094l-1.407 1.406L12 14.625l7.094-7.125-1.406-1.406L12 11.812 6.312 6.094Z"
//     />
//   </svg>
// );

// const RevitIcon = () => (
//   <svg
//     role="img"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-12 w-12 text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
//     <title>Revit</title>
//     <path
//       fill="currentColor"
//       d="M4.17 2H2v13.5h2.17V2zm6.91 0H4.17v13.5h6.91c4.81 0 6.91-2.25 6.91-6.75S15.89 2 11.08 2M4.17 22h2.17V17H2v5h2.17zm6.91 0h6.91c4.81 0 6.91-2.25 6.91-6.75s-2.1-6.75-6.91-6.75h-6.91v13.5zM11.08 3.5h5.36c3.48 0 5.36 1.8 5.36 5.25s-1.88 5.25-5.36 5.25h-5.36V3.5z"
//     />
//   </svg>
// );

// const EtabsIcon = () => (
//   <svg
//     role="img"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-12 w-12 text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
//     <title>Etabs</title>
//     <path
//       fill="currentColor"
//       d="M22,12c0,5.523-4.477,10-10,10S2,17.523,2,12S6.477,2,12,2S22,6.477,22,12z M4,12c0,4.418,3.582,8,8,8s8-3.582,8-8 s-3.582-8-8-8S4,7.582,4,12z M15,7h-5v2h5v2h-5v2h5v2h-7V7h7z"
//     />
//   </svg>
// );

// const SafeIcon = () => (
//   <svg
//     role="img"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-12 w-12 text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
//     <title>SAFE</title>
//     <path
//       fill="currentColor"
//       d="M17.43,3.02C15.39,3.02,14.2,3.9,14.2,5.33a2.2,2.2,0,0,0,1.2,2L12.5,12.5v.11h5.89v-2.2H14.5l2.4-5.33A2.2,2.2,0,0,0,18.1,3.9a2.2,2.2,0,0,0-1.2-2L17.43,3.02M6.57,8.81C4.54,8.81,3.34,9.69,3.34,11.12a2.2,2.2,0,0,0,1.2,2L1.64,18.28v.11H7.53v-2.2H3.74l2.4-5.33A2.2,2.2,0,0,0,7.34,9.69a2.2,2.2,0,0,0-1.2-2L6.57,8.81M18.39,11.47v.11H24v-2.2H18.39Z"
//     />
//   </svg>
// );

// const StaadProIcon = () => (
//   <svg
//     role="img"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-12 w-12 text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
//     <title>STAAD.Pro</title>
//     <path
//       fill="currentColor"
//       d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 19.5h-3V4.5h3v15zm6 0h-3V4.5h3v15z"
//     />
//   </svg>
// );

// const TeklaIcon = () => (
//   <svg
//     role="img"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-12 w-12 text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
//     <title>Tekla Structures</title>
//     <path
//       fill="currentColor"
//       d="M12 0L0 12l12 12 12-12L12 0zm0 2.828L19.172 10H4.828L12 2.828zM4 12l8 8V12H4zm8 8l8-8h-8v8z"
//     />
//   </svg>
// );

// --- Component Data ---
const technologies = [
  {
    name: "AutoCAD",
    photoUrl:
      "https://res.cloudinary.com/dalpf8iip/image/upload/v1751278647/autocad-seeklogo_kqapfh.png",
  },
  {
    name: "Revit",
    photoUrl:
      "https://res.cloudinary.com/dalpf8iip/image/upload/v1751278647/autocad-seeklogo_kqapfh.png",
  },
  {
    name: "Etabs",
    photoUrl:
      "https://res.cloudinary.com/dalpf8iip/image/upload/v1751278827/autodesk_revit-logo_brandlogos.net_4hpe4_zhuapb.png",
  },
  {
    name: "SAFE",
    photoUrl:
      "https://res.cloudinary.com/dalpf8iip/image/upload/v1751278827/autodesk_revit-logo_brandlogos.net_4hpe4_zhuapb.png",
  },
  {
    name: "STAAD.Pro",
    photoUrl:
      "https://res.cloudinary.com/dalpf8iip/image/upload/v1751278827/autodesk_revit-logo_brandlogos.net_4hpe4_zhuapb.png",
  },
  {
    name: "Tekla Structures",
    photoUrl:
      "https://res.cloudinary.com/dalpf8iip/image/upload/v1751278827/autodesk_revit-logo_brandlogos.net_4hpe4_zhuapb.png",
  },
];

// --- Main Component ---
export default function TechnologySection() {
  return (
    <div className="bg-white mt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Technologies We Work With
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            We utilize industry-leading software to deliver precision and
            excellence in every project.
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3 md:grid-cols-6">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="group bg-gray-50 p-6 rounded-xl border border-gray-200/80 hover:bg-white hover:shadow-2xl hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 ease-in-out">
                <div className="flex justify-center items-center h-20">
                  <Image
                    src={tech.photoUrl}
                    alt={tech.name}
                    width={80}
                    height={80}
                  />
                </div>
                <p className="mt-4 font-semibold text-sm text-gray-600 group-hover:text-gray-900">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
