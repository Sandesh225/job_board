'use client';

import React from 'react';
import { Button } from '@/ui/Button';
import { Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../card-saas';

/**
 * SECTION 1: The "Power" CTA (Job Seeker Focus)
 * Use this for high-conversion product sales (like the AI Cover Letter).
 */
const JobSeekerCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/80 relative overflow-hidden rounded-3xl mx-4 my-10 shadow-2xl">
      {/* Animated gradient overlays */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-6 leading-tight">
          Ready to Land Your Dream Job?
        </h2>
        <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto leading-relaxed">
          Join 10,000+ job seekers who are getting more interviews with
          AI-powered cover letters.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            href="/generate"
            className="group flex items-center gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-4 rounded-lg font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 text-lg"
          >
            <Rocket className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
            Generate Your Cover Letter Now
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-primary-foreground/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
            <span className="font-semibold">$3 per letter</span>
          </div>
          <div className="h-6 w-px bg-primary-foreground/30" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
            <span className="font-semibold">60 seconds</span>
          </div>
          <div className="h-6 w-px bg-primary-foreground/30" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
            <span className="font-semibold">Money-back guarantee</span>
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
    <section className="relative bg-background overflow-hidden py-20">
      {/* Decorative background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 -z-10" />

      <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground">
              Ready to take the next step in your
              <span className="block text-primary mt-2">career?</span>
            </h2>

            <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
              Join thousands of professionals who have already landed roles they
              love. Whether you're exploring new opportunities or hiring top
              talent, we make the process simple and effective.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Primary CTA */}
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-8 py-4 text-base font-bold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
              >
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Secondary CTA */}
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary text-primary px-8 py-4 text-base font-bold hover:bg-primary/10 transition-all duration-300 hover:shadow-lg group"
              >
                <svg
                  className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform"
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

          {/* Right Side - Feature List */}
          <div className="space-y-4">
            {[
              { title: '10,000+', desc: 'Job seekers placed' },
              { title: '40%', desc: 'More interview callbacks' },
              { title: '60 sec', desc: 'To generate a letter' },
              { title: '4.9/5', desc: 'Average rating' },
            ].map((stat, idx) => (
              <Card key={idx} className="bg-card border-border hover:shadow-md transition-all duration-300 group cursor-pointer">
                <CardContent className="pt-6 pb-6 flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 text-primary font-bold text-lg group-hover:bg-primary/30 transition-colors">
                    {stat.title}
                  </div>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">{stat.desc}</p>
                </CardContent>
              </Card>
            ))}
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
    <div className="flex flex-col space-y-0 bg-background">
      <JobSeekerCTA />
      <PlatformCTA />
    </div>
  );
}