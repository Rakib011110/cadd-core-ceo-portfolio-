"use client";
import React, { useState } from "react";
import {
  Home,
  BookOpen,
  Calendar,
  FileText,
  Briefcase,
  Video,
  Settings,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";

const navigationSections = [
  {
    title: "Content Management",
    links: [
      {
        href: "/dashboard/new-blog",
        label: "Create New Blog",
        icon: FileText,
      },
      {
        href: "/dashboard/manage-blogs",
        label: "Manage Blogs",
        icon: FileText,
      },
      {
        href: "/dashboard/my-courses",
        label: "My Courses",
        icon: BookOpen,
      },
      {
        href: "/dashboard/seminar-schedule",
        label: "Seminar Schedule",
        icon: Calendar,
      },

      { href: "/dashboard/my-work", label: "My Work", icon: Briefcase },
      {
        href: "/dashboard/upload-video",
        label: "Upload Video",
        icon: Video,
      },
    ],
  },
  {
    title: "General",
    links: [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

type NavLinkProps = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
};

const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  icon: Icon,
  onClick,
}) => (
  <li>
    <a
      href={href}
      onClick={onClick}
      className="flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200">
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </a>
  </li>
);

type CollapsibleNavSectionProps = {
  title: string;
  links: NavLinkProps[];
  onClick?: () => void;
};

const CollapsibleNavSection: React.FC<CollapsibleNavSectionProps> = ({
  title,
  links,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-sm font-semibold text-gray-400 uppercase p-3 hover:bg-gray-700 rounded-lg">
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <ul className="space-y-1 mt-2">
          {links.map(
            (link: NavLinkProps, linkIdx: React.Key | null | undefined) => (
              <NavLink key={linkIdx} {...link} onClick={onClick} />
            )
          )}
        </ul>
      )}
    </div>
  );
};

import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren<object>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header for mobile */}
      <header className="md:hidden p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-md">
        <a
          href="/admin/dashboard"
          className="font-bold text-lg text-gray-800 dark:text-white">
          My Portfolio
        </a>
        <button
          className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            bg-gray-800 dark:bg-gray-900 text-white w-72 p-4 space-y-6
            fixed inset-y-0 left-0 transform md:relative md:translate-x-0
            transition-transform duration-300 ease-in-out z-30
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
          <div className="hidden md:flex items-center space-x-3 px-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">A</span>
            </div>
            <div>
              <p className="font-bold text-lg">Admin Name</p>
              <p className="text-sm text-gray-400">Portfolio Manager</p>
            </div>
          </div>

          <nav className="flex-grow">
            {navigationSections.map((section, idx) => (
              <CollapsibleNavSection
                key={idx}
                {...section}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className="flex-1 p-4 sm:p-6 lg:p-8"
          onClick={() => {
            if (sidebarOpen) setSidebarOpen(false);
          }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6">
              Dashboard
            </h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              {children ? (
                children
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome to your personal portfolio dashboard. Select an option
                  from the sidebar to get started.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
