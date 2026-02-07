'use client';

import { XCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../card-saas';

const comparisons = [
  {
    problem: 'Hours spent on each letter',
    solution: 'Generated in 60 seconds',
  },
  {
    problem: 'Generic, non-personalized content',
    solution: 'Fully tailored to each job',
  },
  {
    problem: 'Struggle with formatting',
    solution: 'ATS-optimized automatically',
  },
  {
    problem: 'No tracking of applications',
    solution: 'Complete analytics dashboard',
  },
  {
    problem: 'Lost among hundreds of applicants',
    solution: '40% more interview callbacks',
  },
  {
    problem: 'Uncertainty about quality',
    solution: 'AI-reviewed by professionals',
  },
];

export function ProblemSolutionSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-semibold text-primary">
              The Problem
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance mb-4">
            Your Job Search Challenges,
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              Solved
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We fixed everything that makes job hunting frustrating and
            time-consuming.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Without Us
              </h3>
              <ul className="space-y-4">
                {comparisons.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item.problem}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-success/20 bg-success/5">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-xl font-bold text-foreground mb-6">
                With JobBoard
              </h3>
              <ul className="space-y-4">
                {comparisons.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item.solution}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="pt-12 pb-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold mb-2">87%</p>
                <p className="text-primary-foreground/90">
                  Time saved on applications
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">40%</p>
                <p className="text-primary-foreground/90">
                  More interviews scheduled
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">2.5x</p>
                <p className="text-primary-foreground/90">
                  Faster job placement
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">$2.4K</p>
                <p className="text-primary-foreground/90">
                  Average salary increase
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ProblemSolutionSection;