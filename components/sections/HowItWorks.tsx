'use client';

import { FileText, Wand2, Download, Send } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../card-saas';

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Upload Job Details',
    description: 'Paste the job description or upload a link. Our AI analyzes the role and requirements.',
    features: ['Auto-parsing', 'Multi-format support', 'Link detection'],
  },
  {
    number: '02',
    icon: Wand2,
    title: 'AI Generates Letter',
    description: 'Get a professional, customized cover letter in seconds. Perfect match for the role.',
    features: ['60-second generation', 'ATS-optimized', 'Professional tone'],
  },
  {
    number: '03',
    icon: Download,
    title: 'Customize & Review',
    description: 'Make tweaks to match your style. Download as PDF or copy to clipboard.',
    features: ['Easy editing', 'Multiple formats', 'One-click copy'],
  },
  {
    number: '04',
    icon: Send,
    title: 'Submit Application',
    description: 'Send your application with confidence. Track all your submissions in one dashboard.',
    features: ['Application tracking', 'Status updates', 'Analytics'],
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-semibold text-primary">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance mb-4">
            Four Simple Steps to Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From job posting to application - everything streamlined and
            automated.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection line - desktop only */}
                {index < steps.length - 1 && (
                  <div className="absolute top-20 left-1/2 w-full h-1 bg-gradient-to-r from-primary/20 to-transparent hidden lg:block -translate-x-1/2" />
                )}

                <Card className="h-full relative z-10">
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-6 bg-gradient-to-r from-primary to-primary/60 text-primary-foreground text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center">
                    {step.number}
                  </div>

                  <CardHeader>
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{step.description}</p>
                    <ul className="space-y-2">
                      {step.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Testimonial */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-8 pb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-foreground font-semibold mb-2">
                  "This saved me hours every week!"
                </p>
                <p className="text-muted-foreground mb-4">
                  Used to spend 2-3 hours on each cover letter. Now I can apply
                  to 5+ jobs per day with personalized letters. Landed my dream
                  job in 2 weeks.
                </p>
                <p className="font-semibold text-foreground">Sarah M.</p>
                <p className="text-sm text-muted-foreground">
                  Senior Product Manager at TechCorp
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-6 border border-border">
                <div className="text-4xl font-bold text-primary mb-2">10x</div>
                <p className="text-muted-foreground">
                  Faster application process on average
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default HowItWorksSection;