'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { href: '/jobs', label: 'Browse Jobs' },
    { href: '/tracker', label: 'My Applications' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold text-sm">
              JB
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">JobBoard</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-all focus:ring-2 focus:ring-primary/50 duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-secondary/50 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <Link
                href="/login"
                className="block px-4 py-2 rounded-md text-sm font-medium text-center text-foreground hover:bg-secondary/50 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 rounded-md text-sm font-medium text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}