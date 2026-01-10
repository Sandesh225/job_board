"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { logout } from '@/app/actions/auth';


export function Header() {
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // --- Mount & Theme Sync ---
  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));

    // Initial auth state
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // --- Theme Toggle ---
  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = isDark ? "light" : "dark";

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Flowbite-compatible key
    localStorage.setItem("flowbite-theme-mode", newTheme);
    setIsDark(!isDark);
  };

  const userRole = user?.user_metadata?.role;

  // --- Prevent hydration flicker ---
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

        {/* LOGO */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-xl font-bold text-white">J</span>
          </div>
          <span className="text-xl font-semibold dark:text-white">
            Job<span className="text-primary-600">Board</span>
          </span>
        </Link>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center lg:order-2">

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            type="button"
            className="mr-2 rounded-lg p-2.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* AUTH BUTTONS */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm dark:text-white md:block">
                {user.email}
              </span>
              <button
                onClick={() => logout()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="mr-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
            >
              Log in
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ml-1 inline-flex items-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden"
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

        {/* NAV LINKS */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } w-full items-center justify-between lg:flex lg:w-auto lg:order-1`}
        >
          <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
            
            {/* If user is logged in, show Dashboard link instead of Home */}
            <li>
              <Link
                href={user ? "/dashboard" : "/"}
                className="block py-2 text-primary-600 dark:text-white lg:p-0"
              >
                {user ? "Dashboard" : "Home"}
              </Link>
            </li>

            <li>
              <Link
                href="/jobs"
                className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
              >
                Find Jobs
              </Link>
            </li>

            {/* EMPLOYER-SPECIFIC LINKS */}
            {userRole === "employer" && (
              <>
                <li>
                  <Link
                    href="/jobs/post"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/my-jobs"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                  >
                    My Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/analytics"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                  >
                    Analytics
                  </Link>
                </li>
              </>
            )}

            {/* JOB-SEEKER-SPECIFIC LINKS */}
            {userRole === "job-seeker" && (
              <>
                <li>
                  <Link
                    href="/dashboard/applications"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                  >
                    My Applications
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/saved-jobs"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                  >
                    Saved Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/profile"
                    className="block py-2 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-white lg:p-0"
                  >
                    My Profile
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