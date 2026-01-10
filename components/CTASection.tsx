import React from 'react';

export default function CTASection() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="max-w-screen-md">
          {/* Refactored Heading */}
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Ready to take the next step in your <span className="text-primary-600">career?</span>
          </h2>
          
          {/* Refactored Content */}
          <p className="mb-8 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Join thousands of professionals who have found their dream roles through our platform. 
            Whether you're looking for your next challenge or hiring your next star teammate, 
            we provide the tools to make it happen.
          </p>

          {/* Buttons using your Pink Primary Color */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 transition-colors"
            >
              Create Free Account
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-colors"
            >
              <svg className="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
              </svg>
              Schedule a Demo
            </a>  
          </div>
        </div>
      </div>
    </section>
  );
}