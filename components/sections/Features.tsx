'use client';

import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Shield,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../card-saas';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Cover Letters',
    description:
      'Generate professional cover letters in 60 seconds using advanced AI. Tailored to each job application.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'No more hours spent writing. Get AI-generated content ready to customize in seconds.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: TrendingUp,
    title: 'Higher Conversion',
    description:
      'Job seekers using our platform report 40% more interview callbacks.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: Clock,
    title: 'Save Time',
    description:
      'Spend more time applying, less time writing. Apply to more jobs faster.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: Shield,
    title: 'ATS-Optimized',
    description:
      'Our letters are designed to pass Applicant Tracking Systems while standing out to recruiters.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Track application progress, interview rates, and optimize your job search strategy.',
    color: 'from-primary to-primary/60',
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background"
    >
      {/* Background gradient - uses CSS variables */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 -z-10" />

      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance mb-4">
            Powerful Features for Job Seekers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to land your dream job faster and more
            efficiently.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group bg-card border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <CardHeader className="relative z-10">
                  {/* Icon Background */}
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-primary/40 transition-all duration-300 rounded-full" />
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
            <CardContent className="pt-8 pb-8">
              <p className="text-lg text-foreground font-semibold mb-2">
                Ready to get started?
              </p>
              <p className="text-muted-foreground mb-6">
                Generate your first cover letter in 60 seconds
              </p>
              <a
                href="/generate"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
              >
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                Start Generating Now
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;