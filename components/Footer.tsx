import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white rounded-lg shadow-sm border-t border-gray-200 m-4 dark:bg-gray-900 dark:border-gray-800">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
      

      
        
        {/* Copyright & Secondary Links */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {currentYear} <a href="/" className="hover:underline">JobPortal™</a>. All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0 text-gray-500 dark:text-gray-400 text-xs">
             <a href="#" className="hover:underline">Privacy Policy</a>
             <a href="#" className="hover:underline">Terms of Service</a>
             <a href="#" className="hover:underline">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}