import React from "react";

export default function Hero() {
  return (
    // Main hero wrapper with proper spacing and dark-mode support
    <section className="bg-white dark:bg-gray-900 pt-28">
      <div className="mx-auto max-w-screen-xl px-4 text-center lg:px-12">
        {/* ================= Recruitment Alert Badge ================= */}
        <a
          href="/jobs"
          role="alert"
          className="inline-flex items-center gap-3 mb-8 rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700 
                     hover:bg-gray-200 transition dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          <span className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
            New
          </span>
          <span className="font-medium">
            500+ remote tech jobs added this week
          </span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 
                 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 
                 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>

        {/* ================= Main Heading ================= */}
        <h1
          className="mb-6 text-4xl font-extrabold leading-tight tracking-tight 
                       text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
        >
          Find Your Dream Job in{" "}
          <span className="text-primary-600">Tech & Design</span>
        </h1>

        {/* ================= Supporting Description ================= */}
        <p
          className="mx-auto mb-10 max-w-3xl text-lg text-gray-500 
                      dark:text-gray-400"
        >
          Connecting top developers, designers, and product managers with
          world-class companies. Your next career move starts here.
        </p>

        {/* ================= Job Search Input (UX Boost) ================= */}
        <div className="mx-auto mb-10 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search jobs (e.g. React, UI/UX, Remote)"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 
                       text-sm focus:border-primary-600 focus:ring-primary-600
                       dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <a
            href="/jobs"
            className="rounded-lg bg-primary-700 px-6 py-3 text-sm font-medium 
                       text-white hover:bg-primary-800 transition"
          >
            Search
          </a>
        </div>

        {/* ================= Call To Actions ================= */}
        <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/jobs"
            className="inline-flex items-center justify-center rounded-lg 
                       bg-primary-700 px-6 py-3 text-base font-medium text-white 
                       hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 
                       transition dark:focus:ring-primary-900"
          >
            Browse All Jobs
            <svg
              className="ml-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 
                   1.414l-6 6a1 1 0 01-1.414-1.414L14.586 
                   11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 
                   010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>

          <a
            href="/post-job"
            className="rounded-lg border border-gray-300 px-6 py-3 
                       text-base font-medium text-gray-900 hover:bg-gray-100 
                       transition dark:border-gray-700 dark:text-white 
                       dark:hover:bg-gray-700"
          >
            Post a Job (Free)
          </a>
        </div>

        {/* ================= Trusted Companies ================= */}
        <div className="mx-auto max-w-screen-lg text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Trusted by world-class companies
          </span>

          <div
            className="mt-8 flex flex-wrap justify-center gap-8 
                          text-gray-500 opacity-60 grayscale 
                          hover:grayscale-0 transition"
          >
            <span className="text-xl font-bold">GOOGLE</span>
            <span className="text-xl font-bold">STRIPE</span>
            <span className="text-xl font-bold">AIRBNB</span>
            <span className="text-xl font-bold">VERCEL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
