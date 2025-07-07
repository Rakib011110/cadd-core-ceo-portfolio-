// components/Footer.tsx
"use client";

import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left - Name and Tagline */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Engr. Hachnayen Ahmed
          </h2>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
            Building modern full-stack web experiences.
          </p>
        </div>

        {/* Right - Social Icons */}
        <div className="flex space-x-6 text-xl">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition">
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition">
            <FaLinkedin />
          </a>
          <a
            href="mailto:your@email.com"
            className="hover:text-blue-600 transition">
            <FaEnvelope />
          </a>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        © {new Date().getFullYear()} Engr. Hachnayen Ahmed. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
