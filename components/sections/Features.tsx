'use client';

import { Sparkles, Zap, TrendingUp, Clock, Shield, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../card-saas';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Cover Letters',
    description: 'Generate professional cover letters in 60 seconds using advanced AI. Tailored to each job application.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'No more hours spent writing. Get AI-generated content ready to customize in seconds.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: TrendingUp,
    title: 'Higher Conversion',
    description: 'Job seekers using our platform report 40% more interview callbacks.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Spend more time applying, less time writing. Apply to more jobs faster.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: Shield,
    title: 'ATS-Optimized',
    description: 'Our letters are designed to pass Applicant Tracking Systems while standing out to recruiters.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track application progress, interview rates, and optimize your job search strategy.',
    color: 'from-primary to-primary/60',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background dark:bg-background">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 dark:bg-primary/20 dark:border-primary/30 mb-6">
            <span className="text-sm font-semibold text-primary">Why Choose Us</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance mb-4">
            Powerful Features for Job Seekers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to land your dream job faster and more efficiently.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
