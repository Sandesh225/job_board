"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

export function Header() {
  const supabase = createClient();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));

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
    const root = document.documentElement;
    const newTheme = isDark ? "light" : "dark";
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("flowbite-theme-mode", newTheme);
    setIsDark(!isDark);
  };

  const userRole = user?.user_metadata?.role;
  const fullName = user?.user_metadata?.full_name;
  const displayName = fullName
    ? fullName.split(" ")[0]
    : user?.email?.split("@")[0];

  if (!mounted) {
    return (
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white px-4 py-2.5 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl h-10" />
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white px-4 py-2.5 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-xl font-bold text-white">J</span>
          </div>
          <span className="text-xl font-semibold dark:text-white">
            Job<span className="text-primary-600">Board</span>
          </span>
        </Link>

        <div className="flex items-center lg:order-2">
          <button
            onClick={toggleTheme}
            type="button"
            className="mr-2 rounded-lg p-2.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            aria-label="Toggle theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Profile Greeting Section */}
              <div className="hidden items-center gap-2 md:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-primary-600 dark:bg-gray-800">
                  {displayName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium dark:text-gray-200">
                  Hi, {displayName || "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ml-1 inline-flex items-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } w-full items-center justify-between lg:flex lg:w-auto lg:order-1`}
          aria-hidden={!isMobileMenuOpen}
        >
          <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
            <li>
              <Link
                href={user ? "/dashboard" : "/"}
                className="block py-2 text-primary-600 dark:text-white lg:p-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {user ? "Dashboard" : "Home"}
              </Link>
            </li>
            <li>
              <Link
                href="/jobs"
                className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find Jobs
              </Link>
            </li>

            {userRole === "employer" && (
              <>
                <li>
                  <Link
                    href="/jobs/post"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/my-jobs"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Jobs
                  </Link>
                </li>
              </>
            )}

            {userRole === "job-seeker" && (
              <>
                <li>
                  <Link
                    href="/dashboard/applications"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Applications
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/saved-jobs"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Saved Jobs
                  </Link>
                </li>
              </>
            )}

            {!user && (
              <>
                <li>
                  <Link
                    href="/about"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}