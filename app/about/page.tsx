"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Users, Target, Rocket, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Login</span>
          </Link>
          <div className="font-bold text-xl tracking-tight">
            Job<span className="text-primary">Board</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        {/* Hero Section */}
        <section className="text-center space-y-4 mb-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            We’re on a mission to <br />
            <span className="text-primary">humanize job hunting.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            JobBoard started with a simple idea: job seeking shouldn't feel like a full-time job. 
            We build tools that empower talent and simplify hiring.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To create a world where every professional finds their perfect match effortlessly, 
              powered by transparent data and ethical AI.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community First</h3>
            <p className="text-muted-foreground leading-relaxed">
              We believe in the power of people. Our platform is built on feedback from 
              thousands of job seekers just like you.
            </p>
          </div>
        </section>

        {/* The Core Values */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold">What we stand for</h2>
          </div>

          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Trust & Privacy</h4>
                <p className="text-muted-foreground">Your data is yours. We encrypt everything and never sell your personal information to third parties.</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Speed & Efficiency</h4>
                <p className="text-muted-foreground">We optimize every click. Apply to roles in seconds, not minutes, with our streamlined interface.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-24 p-12 rounded-[3rem] bg-primary text-primary-foreground text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to find your next role?</h2>
          <p className="opacity-90 max-w-md mx-auto">
            Join 10,000+ professionals who have already simplified their career journey.
          </p>
          <Link 
            href="/register" 
            className="inline-block bg-background text-foreground px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Get Started Now
          </Link>
        </section>
      </main>

      <footer className="py-12 border-t border-border text-center text-sm text-muted-foreground">
        © 2026 JobBoard AI Inc. All rights reserved.
      </footer>
    </div>
  );
}