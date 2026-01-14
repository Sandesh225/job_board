import React from "react";

export default function CTASection() {
  return (
    // Section wrapper with visual separation from previous content
    <section className="relative bg-white dark:bg-gray-900 overflow-hidden">
      {/* Decorative background accent (subtle gradient glow) */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-100/40 via-transparent to-primary-100/40 dark:from-primary-900/20 dark:to-primary-900/20" />

      {/* Main content container */}
      <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-screen-md">
          {/* ================= Heading ================= */}
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Ready to take the next step in your{" "}
            <span className="text-primary-600">career?</span>
          </h2>

          {/* ================= Supporting Text ================= */}
          <p className="mb-10 text-lg font-light text-gray-500 dark:text-gray-400">
            Join thousands of professionals who have already landed roles they
            love. Whether you’re exploring new opportunities or hiring top
            talent, we make the process simple and effective.
          </p>

          {/* ================= CTA Buttons ================= */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Primary CTA — High emphasis */}
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg 
                         bg-primary-700 px-6 py-3 text-base font-medium text-white 
                         hover:bg-primary-800 focus:outline-none focus:ring-4 
                         focus:ring-primary-300 transition dark:focus:ring-primary-900"
            >
              Create Free Account
            </a>

            {/* Secondary CTA — Lower emphasis */}
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg 
                         border border-gray-300 px-6 py-3 text-base font-medium 
                         text-gray-900 hover:bg-gray-100 focus:outline-none 
                         focus:ring-4 focus:ring-gray-100 transition 
                         dark:border-gray-600 dark:text-white 
                         dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              {/* Icon for visual clarity */}
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              Schedule a Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
