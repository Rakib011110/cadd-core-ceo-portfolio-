// components/Footer.tsx
"use client";

import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left: Name and Tagline */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">Engr. Hachnayen Ahmed</h1>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
            Founder & CEO - CADD CORE
          </p>
        </div>

        {/* Center: Social Icons */}
        <div className="flex space-x-5 text-xl">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition duration-300"
            aria-label="GitHub">
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition duration-300"
            aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a
            href="mailto:your@email.com"
            className="hover:text-blue-600 transition duration-300"
            aria-label="Email">
            <FaEnvelope />
          </a>
        </div>
      </div>

      {/* Bottom: Copyright */}
      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Engr. Hachnayen Ahmed. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
