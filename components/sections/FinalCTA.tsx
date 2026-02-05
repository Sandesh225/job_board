import React from "react";
// Assuming Button is a custom component in your project
import { Button } from "@/ui/Button"; 
import { Rocket, ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * SECTION 1: The "Power" CTA (Job Seeker Focus)
 * Use this for high-conversion product sales (like the AI Cover Letter).
 */
const JobSeekerCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden rounded-3xl mx-4 my-10">
      {/* Grainy texture overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
          Ready to Land Your Dream Job?
        </h2>
        <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
          Join 10,000+ job seekers who are getting more interviews with
          AI-powered cover letters.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button href="/generate" variant="white" size="xl" className="group flex items-center gap-2">
            <Rocket className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
            Generate Your Cover Letter Now
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-200" />
            <span>$3 per letter</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-200" />
            <span>60 seconds</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-200" />
            <span>Money-back guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * SECTION 2: The "Platform" CTA (General/Business Focus)
 * Use this for user acquisition and account creation.
 */
const PlatformCTA = () => {
  return (
    <section className="relative bg-white dark:bg-gray-900 overflow-hidden py-16">
      {/* Decorative background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/40 via-transparent to-blue-100/40 dark:from-blue-900/20 dark:to-blue-900/20" />

      <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-md">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Ready to take the next step in your{" "}
            <span className="text-blue-600 dark:text-blue-400">career?</span>
          </h2>

          <p className="mb-10 text-lg font-light text-gray-500 dark:text-gray-400">
            Join thousands of professionals who have already landed roles they
            love. Whether you’re exploring new opportunities or hiring top
            talent, we make the process simple and effective.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Primary CTA */}
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg 
                         bg-blue-700 px-6 py-3 text-base font-medium text-white 
                         hover:bg-blue-800 focus:outline-none focus:ring-4 
                         focus:ring-blue-300 transition dark:focus:ring-blue-900"
            >
              Create Free Account
            </a>

            {/* Secondary CTA */}
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg 
                         border border-gray-300 px-6 py-3 text-base font-medium 
                         text-gray-900 hover:bg-gray-100 focus:outline-none 
                         focus:ring-4 focus:ring-gray-100 transition 
                         dark:border-gray-600 dark:text-white 
                         dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
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
};

/**
 * MAIN EXPORT
 */
export default function CTA() {
  return (
    <div className="flex flex-col space-y-12">
      {/* Depending on your page layout, you might only want one of these.
        But here they are combined into one clean file.
      */}
      <JobSeekerCTA />
      
      <div className="container mx-auto px-4">
        <hr className="border-gray-200 dark:border-gray-800" />
      </div>

      <PlatformCTA />
    </div>
  );
}