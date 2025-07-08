"use client";
import React, { useState, useContext, FC } from "react";
import Link from "next/link";
import { useUser } from "@/context/user.provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Moon,
  Sun,
  Menu,
  Rocket,
  Home,
  Book,
  Video,
  MessageSquare,
  User,
  LogOut,
  Settings,
  Globe, // Added for Resources icon
  FileText, // Example icon for a resource link
  HelpCircle, // Example icon for another resource link
} from "lucide-react";

import { ThemeContext } from "../commonUi/ThemeProvider";
import { logout } from "@/lib/services/AuthService";
import { useRouter } from "next/navigation";

export const Navbar: FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const { user, setUser, setIsLoading } = useUser();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md transition-all">
          <Rocket className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300 ease-out" />
          <span className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors duration-300 whitespace-nowrap">
            Engr. Hachnayen Ahmed
          </span>
        </Link>

        <div className="hidden md:flex flex-1 justify-center space-x-6 lg:space-x-8">
          <NavLink href="/" label="Home" />
          <NavLink href="/blog" label="Blog" />

          {/* Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group py-2 px-1 cursor-pointer"
                aria-label="Resources"
              >
                Resources
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-[2px] bg-primary group-hover:w-[80%] transition-all duration-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-48 rounded-lg shadow-lg border-border/50 mt-2"
            >
              <DropdownMenuItem className="focus:bg-muted/50">
                <Link href="/resources/articles" className="flex items-center w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Articles</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-muted/50">
                <Link href="/resources/tutorials" className="flex items-center w-full">
                  <Video className="mr-2 h-4 w-4" />
                  <span>Tutorials</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="focus:bg-muted/50">
                <Link href="/resources/faq" className="flex items-center w-full">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>FAQ</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NavLink href="/videos" label="Videos" />
          <NavLink href="/contact" label="Contact" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full hover:bg-muted/50">
            {theme === "light" ? (
              <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user?.email ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0 hover:bg-muted/50">
                  <Avatar className="h-9 w-9">
                    {user.profilePhoto && (
                      <AvatarImage src={user.profilePhoto} alt="Profile" />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-lg shadow-lg border-border/50">
                <DropdownMenuItem className="focus:bg-muted/50">
                  <Link href="/dashboard" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-muted/50">
                  <Link href="/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="rounded-full px-5 font-semibold bg-primary hover:bg-primary/90 shadow-sm">
                Join Event
              </Button>
            </Link>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full hover:bg-muted/50"
                aria-label="Open mobile menu">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle mobile menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[280px] sm:w-[300px] bg-background/95 backdrop-blur-lg border-r border-border/40">
              <SheetHeader className="text-left pb-6">
                <SheetTitle className="text-2xl font-bold">
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1">
                <MobileNavLink
                  icon={<Home className="h-4 w-4" />}
                  href="/"
                  label="Home"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <MobileNavLink
                  icon={<Book className="h-4 w-4" />}
                  href="/courses"
                  label="Courses"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <MobileNavLink
                  icon={<Video className="h-4 w-4" />}
                  href="/videos"
                  label="Videos"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                {/* Mobile Resources Dropdown - simplified for mobile */}
                <MobileNavLink
                  icon={<Globe className="h-4 w-4" />}
                  href="/resources"
                  label="Resources"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <MobileNavLink
                  icon={<MessageSquare className="h-4 w-4" />}
                  href="/blog"
                  label="Blog"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <MobileNavLink
                  icon={<User className="h-4 w-4" />}
                  href="/contact"
                  label="Contact"
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
              </nav>
              <div className="mt-auto pt-6 border-t border-border/40">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={toggleTheme}>
                  {theme === "light" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  Toggle Theme
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

const NavLink: FC<{ href: string; label: string }> = ({ href, label }) => (
  <Link
    href={href}
    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group py-2 px-1">
    {label}
    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-[2px] bg-primary group-hover:w-[80%] transition-all duration-300" />
  </Link>
);

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
  <Link
    href={href}
    className="flex items-center text-sm font-medium py-2 px-4 rounded-md hover:bg-muted/50 transition-colors"
    onClick={() => setIsMobileMenuOpen(false)}>
    <span className="mr-3 text-muted-foreground">{icon}</span>
    {label}
  </Link>
);

export default Navbar;