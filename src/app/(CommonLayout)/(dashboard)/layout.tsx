"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  User,
  LogOut,
  Bell,
  BarChart3,
  Shield,
  Sun,
  Moon,
} from "lucide-react";

const navigationSections = [
  {
    title: "Dashboard",
    links: [
      { href: "/dashboard", label: "Overview", icon: Home },
      { href: "#", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Content Management",
    links: [
      {
        href: "/dashboard/new-blog",
        label: "Create New Blog",
        icon: FileText,
        badge: "New",
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
      {
        href: "/dashboard/add-new-badge",
        label: "Add New Badge",
        icon: Shield,
      },
      { href: "/dashboard/my-work", label: "My Work", icon: Briefcase },
    ],
  },
  {
    title: "Media Management",
    links: [
      {
        href: "/dashboard/add-videos",
        label: "Upload Video",
        icon: Video,
      },
      {
        href: "/dashboard/manage-video",
        label: "Manage Videos",
        icon: Video,
      },
    ],
  },
  {
    title: "Settings",
    links: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ],
  },
];

type NavLinkProps = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
  onClick?: () => void;
};

const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  icon: Icon,
  badge,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105"
            : "text-gray-300 hover:bg-gray-700/50 hover:text-white hover:transform hover:scale-102"
        }`}
      >
        <div className="flex items-center relative z-10">
          <Icon className={`w-5 h-5 mr-3 transition-all duration-300 ${
            isActive ? "text-white" : "text-gray-400 group-hover:text-white"
          }`} />
          <span className="font-medium text-sm">{label}</span>
        </div>
        {badge && (
          <span className="px-2 py-1 text-xs bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full shadow-sm animate-pulse">
            {badge}
          </span>
        )}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-50" />
        )}
      </Link>
    </li>
  );
};

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
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-xs font-bold text-gray-400 uppercase tracking-wider p-3 hover:bg-gray-700/30 rounded-lg transition-all duration-300 group"
      >
        <span className="group-hover:text-gray-300">{title}</span>
        <div className="transition-transform duration-300">
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <ul className="space-y-1 mt-2 pl-2">
          {links.map((link: NavLinkProps, linkIdx: React.Key | null | undefined) => (
            <NavLink key={linkIdx} {...link} onClick={onClick} />
          ))}
        </ul>
      </div>
    </div>
  );
};

import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren<object>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Close sidebar when clicking outside on mobile
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <Link
              href="/dashboard"
              className="font-bold text-lg text-gray-800 dark:text-white"
            >
              Portfolio
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            bg-gradient-to-b from-gray-900 to-gray-800 text-white w-80 
            fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0
            transition-transform duration-300 ease-in-out z-50
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            shadow-2xl border-r border-gray-700
          `}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold">A</span>
              </div>
              <div>
                <p className="font-bold text-lg">Admin Panel</p>
                <p className="text-sm text-gray-400">Portfolio Manager</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-grow p-4 overflow-y-auto">
            <div className="space-y-2">
              {navigationSections.map((section, idx) => (
                <CollapsibleNavSection
                  key={idx}
                  {...section}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
              <button 
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0">
          {/* Desktop Header */}
         

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 lg:p-8 min-h-[calc(100vh-12rem)]">
                {children ? (
                  children
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Home className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      Welcome to your Portfolio Dashboard
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                      Select an option from the sidebar to get started managing your content, courses, and media.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
