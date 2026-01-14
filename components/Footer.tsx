import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Footer wrapper with border separation and dark mode support
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 py-12">
        {/* ================= Top Section ================= */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand & Description */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              JobPortal™
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connecting talented professionals with world-class companies. Find
              jobs, hire talent, and grow your career.
            </p>
          </div>

          {/* Jobs Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase text-gray-900 dark:text-white">
              Jobs
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a href="/jobs" className="hover:underline">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="/remote-jobs" className="hover:underline">
                  Remote Jobs
                </a>
              </li>
              <li>
                <a href="/companies" className="hover:underline">
                  Companies
                </a>
              </li>
              <li>
                <a href="/post-job" className="hover:underline">
                  Post a Job
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase text-gray-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a href="/about" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:underline">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase text-gray-900 dark:text-white">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a href="/privacy" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/cookies" className="hover:underline">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ================= Divider ================= */}
        <hr className="my-8 border-gray-200 dark:border-gray-800" />

        {/* ================= Bottom Section ================= */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright */}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear}{" "}
            <a href="/" className="hover:underline font-medium">
              JobPortal™
            </a>
            . All rights reserved.
          </span>

          {/* Social Links (Text-based, clean) */}
          <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-primary-600">
              LinkedIn
            </a>
            <a href="#" className="hover:text-primary-600">
              Twitter
            </a>
            <a href="#" className="hover:text-primary-600">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
