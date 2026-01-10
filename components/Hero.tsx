import React from 'react';

export default function Hero() {
  return (
    <section className="bg-white dark:bg-gray-900 pt-24">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        {/* Recruitment Alert Badge */}
        <a 
          href="/jobs" 
          className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" 
          role="alert"
        >
          <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">New</span> 
          <span className="text-sm font-medium">Over 500+ remote tech jobs added this week!</span> 
          <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
          </svg>
        </a>

        {/* Main Heading Refactored for Job Board */}
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Find Your Dream Job in <span className="text-primary-600">Tech & Design</span>
        </h1>

        {/* Supporting Text */}
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          Connecting the world’s best talent with top-tier companies. Whether you’re a developer, designer, or product manager, your next career move starts here.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <a href="/jobs" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
            Browse All Jobs
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </a>
          <a href="/post-job" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
            Post a Job (Free)
          </a>  
        </div>

        {/* Trusted By / Featured Companies Section */}
        <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
          <span className="font-semibold text-gray-400 uppercase tracking-widest text-xs">Trusted by world-class companies</span>
          <div className="flex flex-wrap justify-center items-center mt-8 text-gray-500 sm:justify-between opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
             {/* Using simple text placeholders for company logos */}
             <span className="text-xl font-bold px-4">GOOGLE</span>
             <span className="text-xl font-bold px-4">STRIPE</span>
             <span className="text-xl font-bold px-4">AIRBNB</span>
             <span className="text-xl font-bold px-4">VERCEL</span>
          </div>
        </div> 
      </div>
    </section>
  );
}