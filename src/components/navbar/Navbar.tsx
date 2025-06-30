"use client";
import React, { useState, useContext, FC } from "react";

// ShadCN UI components for enhanced UI/UX
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

// Lucide-react icons for clear visual cues
import {
  Moon,
  Sun,
  Menu,
  Bell,
  Rocket,
  X,
  Home,
  Book,
  Video,
  Info,
} from "lucide-react"; // Added Home, Book, Video, Info for more relevant mobile menu icons
import { ThemeContext } from "../commonUi/ThemeProvider"; // Assuming this context is correctly defined elsewhere for theme management
import Link from "next/link";

// --- Navbar Component ---
// This component provides a responsive and aesthetically pleasing navigation bar
// for the website, incorporating branding, navigation links, and user controls
// like theme toggling and a profile dropdown.
export const Navbar: FC = () => {
  // Access theme state and toggle function from ThemeContext
  const { theme, toggleTheme } = useContext(ThemeContext);
  // State to control the visibility of the mobile navigation sheet
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Application Logo and Name (Engr. Hachnayen Ahmed) */}
        {/* Enhanced with a more pronounced hover effect and clear typography */}
        <Link
          href="/"
          className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md">
          <Rocket className="mr-2 h-7 w-7 text-primary group-hover:rotate-12 transition-transform duration-300 ease-out" />
          <span className="text-xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
            Engr. Hachnayen Ahmed
          </span>
        </Link>

        {/* Desktop Navigation Links - Centered and visually distinct */}
        <div className="hidden md:flex flex-1 justify-center space-x-8 lg:space-x-12">
          <NavLink href="#" label="Home" />
          <NavLink href="#" label="Courses" />
          <NavLink href="#" label="Videos" />
          <NavLink href="#" label="Blog" />
          <NavLink href="#" label="About" />
          <NavLink href="#" label="Contact" />
        </div>

        {/* Right-aligned Control Buttons and User Profile */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full hover:bg-muted" // Added rounded-full and hover bg for a softer look
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-colors rotate-0 dark:rotate-90 scale-100 dark:scale-0" /> // Rotate effect for theme change
            ) : (
              <Moon className="absolute h-5 w-5 text-gray-700 dark:text-gray-300 transition-colors rotate-90 dark:rotate-0 scale-0 dark:scale-100" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications Button - Made it a ghost button for consistency */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="rounded-full hover:bg-muted">
            <Bell className="h-5 w-5 text-muted-foreground hover:text-primary-foreground transition-colors" />
          </Button>

          {/* User Avatar with Dropdown Menu for Profile/Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer border border-border transition-transform hover:scale-105 active:scale-95 duration-200 shadow-sm">
                {/* Dynamically display user's initials or image */}
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  JP {/* Placeholder for user initials */}
                </AvatarFallback>
                {/* <img src="/path-to-user-image.jpg" alt="User Avatar" className="rounded-full w-full h-full object-cover" /> */}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 shadow-lg rounded-lg">
              <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md transition-colors">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md transition-colors">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive rounded-md transition-colors">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle Button (Hamburger icon) - Visible only on small screens */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full hover:bg-muted"
                aria-label="Open mobile menu">
                <Menu className="h-6 w-6 text-foreground" />
                <span className="sr-only">Toggle mobile menu</span>
              </Button>
            </SheetTrigger>
            {/* Mobile Navigation Sheet Content - Slide-in from left */}
            <SheetContent
              side="left"
              className="w-64 sm:w-80 bg-background flex flex-col">
              <SheetHeader className="pb-4 border-b border-border">
                <SheetTitle className="text-2xl font-bold text-foreground">
                  Navigation
                </SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  Explore your learning journey.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 py-8 flex-1">
                <MobileNavLink
                  icon={<Home className="h-5 w-5 mr-3" />}
                  href="#"
                  label="Home"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <MobileNavLink
                  icon={<Book className="h-5 w-5 mr-3" />}
                  href="#"
                  label="Courses"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <MobileNavLink
                  icon={<Video className="h-5 w-5 mr-3" />}
                  href="#"
                  label="Videos"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <MobileNavLink
                  icon={<Info className="h-5 w-5 mr-3" />}
                  href="#"
                  label="Blog"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <MobileNavLink
                  icon={<Info className="h-5 w-5 mr-3" />}
                  href="#"
                  label="About Engr. Hachnayen Ahmed"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <MobileNavLink
                  icon={<Info className="h-5 w-5 mr-3" />}
                  href="#"
                  label="Contact"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
              </nav>
              {/* Mobile Theme Toggle within Sheet */}
              <div className="mt-auto pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base text-foreground hover:bg-muted"
                  onClick={toggleTheme}>
                  {theme === "light" ? (
                    <Sun className="mr-3 h-5 w-5" />
                  ) : (
                    <Moon className="mr-3 h-5 w-5" />
                  )}
                  Toggle Theme
                </Button>
              </div>
              <SheetClose asChild>
                {/* Custom close button for the sheet - styled for better visibility */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full hover:bg-muted"
                  aria-label="Close menu">
                  <X className="h-5 w-5 text-foreground" />
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

// Helper component for desktop navigation links
const NavLink: FC<{ href: string; label: string }> = ({ href, label }) => (
  <a
    href={href}
    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary-foreground relative group py-2" // Added relative and group for underline effect
  >
    {label}
    {/* Animated underline effect */}
    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
  </a>
);

// Helper component for mobile navigation links within the Sheet
interface MobileNavLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileNavLink: FC<MobileNavLinkProps> = ({
  href,
  label,
  icon,
  setIsMobileMenuOpen,
}) => (
  <a
    href={href}
    className="flex items-center text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted"
    onClick={() => setIsMobileMenuOpen(false)} // Close sheet on link click
  >
    {icon}
    {label}
  </a>
);

export default Navbar;
