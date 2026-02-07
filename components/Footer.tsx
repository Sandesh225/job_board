"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Linkedin, Twitter, Github } from "lucide-react";
import { HiSun, HiMoon } from "react-icons/hi";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(
      window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Logic to toggle theme
  };

  if (!mounted) {
    return <div className="p-2.5 w-10 h-10"></div>;
  }

  return (
    <footer className="bg-background border-t border-border dark:border-border mt-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Section */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 mb-8">
          {/* Brand & Description */}
          <div>
            <h3 className="h5 mb-3 text-foreground">JobBoard</h3>
            <p className="text-sm text-muted-foreground">
              Connecting talented professionals with world-class companies. Find
              jobs, hire talent, and grow your career.
            </p>
          </div>

          {/* Jobs Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase text-foreground mb-3">
              Jobs
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/jobs"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-jobs"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Remote Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  href="/post-job"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase text-foreground mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase text-foreground mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-border dark:border-border mb-8" />
      </div>
    </footer>
  );
}
