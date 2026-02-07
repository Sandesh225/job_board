"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { Menu, X, Moon, Sun } from "lucide-react";

export function Header() {
  const supabase = createClient();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    const isDarkMode =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }

    // Get initial user state
    const initAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
    };
    initAuth();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth event:", event);

      // Update user state immediately
      setUser(session?.user ?? null);

      // Handle different auth events
      if (event === "SIGNED_IN") {
        console.log("✅ User signed in:", session?.user?.email);

        const userName =
          session?.user?.user_metadata?.full_name?.split(" ")[0] ||
          session?.user?.email?.split("@")[0] ||
          "User";

        // Small delay to ensure state is updated
        setTimeout(() => {
          toast.success(`Welcome back, ${userName}!`);
        }, 200);

        router.refresh();
      } else if (event === "SIGNED_OUT") {
        console.log("👋 User signed out");
        router.refresh();
      } else if (event === "TOKEN_REFRESHED") {
        console.log("🔄 Token refreshed");
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error("Failed to log out. Please try again.");
        setIsLoggingOut(false);
        return;
      }

      toast.success("Logged out successfully");

      // Small delay before redirect
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const userRole = user?.user_metadata?.role;
  const fullName = user?.user_metadata?.full_name;
  const displayName = fullName
    ? fullName.split(" ")[0]
    : user?.email?.split("@")[0];

  // Navigation links based on user state and role
  const getNavLinks = () => {
    if (!user) {
      return [
        { href: "/jobs", label: "Find Jobs" },
        { href: "/about", label: "About Us" },
        { href: "/pricing", label: "Pricing" },
      ];
    }

    const baseLinks = [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/jobs", label: "Find Jobs" },
    ];

    if (userRole === "employer") {
      return [
        ...baseLinks,
        { href: "/jobs/post", label: "Post a Job" },
        { href: "/dashboard/my-jobs", label: "My Jobs" },
      ];
    }

    if (userRole === "job-seeker") {
      return [
        ...baseLinks,
        { href: "/dashboard/applications", label: "My Applications" },
        { href: "/dashboard/saved-jobs", label: "Saved Jobs" },
      ];
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16" />
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold text-sm">
              JB
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              JobBoard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-all focus:ring-2 focus:ring-primary/50 duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* User Profile - Desktop */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-primary-foreground">
                    {displayName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Hi, {displayName || "User"}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-secondary/50 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Profile - Mobile */}
            {user && (
              <div className="flex items-center gap-2 px-4 py-2 mb-2 rounded-lg bg-secondary/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-primary-foreground">
                  {displayName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-foreground">
                  Hi, {displayName || "User"}
                </span>
              </div>
            )}

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Buttons - Mobile */}
            {user ? (
              <div className="pt-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2 rounded-md text-sm font-medium text-center bg-red-600 text-white hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 rounded-md text-sm font-medium text-center text-foreground hover:bg-secondary/50 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 rounded-md text-sm font-medium text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}