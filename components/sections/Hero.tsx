'use client';

import { ArrowRight, Zap, TrendingUp } from 'lucide-react';
import SaasButton from '../button-saas';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen bg-background dark:bg-background overflow-hidden pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-primary/5 dark:from-primary/5 dark:via-transparent dark:to-primary/10" />
      
      {/* Grid pattern background */}
      <div className="absolute inset-0 -z-10 [background-image:linear-gradient(rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.05)_1px,transparent_1px)] dark:[background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="mx-auto max-w-screen-xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div className="flex items-center gap-2 w-fit">
              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 dark:bg-primary/20 dark:border-primary/30">
                <span className="text-sm font-semibold text-primary">New Feature</span>
              </div>
              <span className="text-sm text-muted-foreground">AI-powered cover letters</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance text-foreground dark:text-foreground leading-tight">
                Land Your 
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Dream Job</span>
              </h1>
              <p className="text-xl text-muted-foreground text-balance max-w-lg leading-relaxed">
                Professional job board with AI-generated cover letters. Get more interviews, faster. Join thousands of successful job seekers.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <SaasButton
                variant="primary"
                size="lg"
                onClick={() => router.push('/generate')}
                className="group gap-2"
              >
                Generate Cover Letter
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </SaasButton>
              <SaasButton
                variant="outline"
                size="lg"
                onClick={() => router.push('/#features')}
                className="gap-2"
              >
                Learn More
              </SaasButton>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-foreground">10,000+</p>
                <p className="text-sm text-muted-foreground">Job seekers landed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4.9/5</p>
                <p className="text-sm text-muted-foreground">Average rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">$3</p>
                <p className="text-sm text-muted-foreground">Per cover letter</p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative h-[500px] sm:h-[600px] hidden lg:flex items-center justify-center">
            {/* Decorative cards */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Card 1 */}
              <div className="absolute w-64 h-80 bg-card rounded-2xl shadow-xl border border-border p-6 -rotate-12 -top-12 -left-12 transform hover:rotate-0 transition-transform duration-300">
                <div className="h-2 w-12 bg-primary rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-4/5" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
                <div className="mt-8 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">AI Generated</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="absolute w-64 h-80 bg-card rounded-2xl shadow-xl border border-border p-6 rotate-6 -bottom-12 -right-12 transform hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Job Match</h3>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Match Score</span>
                    <span className="text-sm font-bold text-success">94%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
