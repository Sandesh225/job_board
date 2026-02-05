'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '../card-saas';

const testimonials = [
  {
    name: 'Sarah Chen',
    title: 'Product Designer',
    company: 'TechCorp',
    image: 'SC',
    rating: 5,
    quote:
      'I used to spend 2-3 hours per cover letter. With JobBoard, I apply to 5+ positions daily with personalized letters. Landed my dream role in just 2 weeks!',
    stat: 'Interviewed at 12 companies',
  },
  {
    name: 'Marcus Johnson',
    title: 'Senior Developer',
    company: 'CloudScale Inc',
    image: 'MJ',
    rating: 5,
    quote:
      'The AI cover letters are incredibly well-written and personalized. The dashboard helped me track everything. Best investment for my job search.',
    stat: '3 offers in 30 days',
  },
  {
    name: 'Emily Rodriguez',
    title: 'Data Analyst',
    company: 'Analytics Pro',
    image: 'ER',
    rating: 5,
    quote:
      'I was nervous about AI-generated content, but the quality is outstanding. Every letter felt authentic and specific to the role I was applying for.',
    stat: '+25% salary increase',
  },
  {
    name: 'David Park',
    title: 'UX Researcher',
    company: 'Design Studios',
    image: 'DP',
    rating: 5,
    quote:
      'This saved me so much time during my job search. The tone selector was perfect for tailoring my voice to different company cultures.',
    stat: 'Accepted in 18 days',
  },
  {
    name: 'Lisa Ahmed',
    title: 'Marketing Manager',
    company: 'Growth Inc',
    image: 'LA',
    rating: 5,
    quote:
      'The application tracking feature helped me manage all my applications. I never missed a follow-up and stayed organized throughout my search.',
    stat: '8 interviews scheduled',
  },
  {
    name: 'James Wilson',
    title: 'Finance Analyst',
    company: 'Capital Markets',
    image: 'JW',
    rating: 5,
    quote:
      'Professional, polished, and personalized. These cover letters opened doors I didn\'t think were possible. Highly recommend.',
    stat: 'Promoted within 6 months',
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background dark:bg-background">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 dark:bg-primary/20 dark:border-primary/30 mb-6">
            <span className="text-sm font-semibold text-primary">Success Stories</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance mb-4">
            Trusted by 10,000+ Job Seekers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how professionals are landing their dream jobs faster.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6 pb-6 flex flex-col h-full">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground mb-6 flex-1 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Stat Badge */}
                <div className="bg-primary/10 rounded-lg px-3 py-2 mb-4 text-center">
                  <p className="text-sm font-semibold text-primary">{testimonial.stat}</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.title} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid gap-8 md:grid-cols-3 text-center">
          <div>
            <p className="text-3xl font-bold text-foreground mb-2">4.9/5</p>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground mb-2">10,000+</p>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground mb-2">94%</p>
            <p className="text-muted-foreground">Recommend to Friends</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
