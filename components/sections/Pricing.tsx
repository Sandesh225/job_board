'use client';

import { Check } from 'lucide-react';
import SaasButton from '../button-saas';
import { Card, CardContent, CardHeader } from '../card-saas';
import { useRouter } from 'next/navigation';

const plans = [
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    description: 'Perfect for trying out our platform',
    features: [
      'Up to 5 cover letters/month',
      'Basic AI customization',
      'PDF download',
      'Email support',
      'Basic analytics',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    description: 'Best for active job seekers',
    features: [
      'Unlimited cover letters',
      'Advanced AI customization',
      'Multiple export formats',
      'Priority email support',
      'Advanced analytics',
      'Interview preparation guide',
      'Application tracking',
      'Tone selector (5 styles)',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations and bulk users',
    features: [
      'Unlimited everything',
      'Custom AI training',
      'Dedicated support',
      'API access',
      'Team management',
      'Custom branding',
      'Priority features',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function PricingSection() {
  const router = useRouter();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background dark:bg-background">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 dark:bg-primary/20 dark:border-primary/30 mb-6">
            <span className="text-sm font-semibold text-primary">Simple Pricing</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Flexible pricing that scales with your job search. Start free, upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-6 items-stretch">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col ${
                plan.highlighted
                  ? 'border-primary shadow-xl scale-105 md:scale-100 lg:scale-105'
                  : 'border-border'
              } transition-all duration-300 hover:shadow-lg`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary/60 text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <CardHeader>
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Check className="w-5 h-5 text-success" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <SaasButton
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full justify-center"
                  onClick={() => {
                    if (plan.cta === 'Contact Sales') {
                      router.push('/contact');
                    } else {
                      router.push('/generate');
                    }
                  }}
                >
                  {plan.cta}
                </SaasButton>
              </CardContent>
            </Card>
          ))}
        </div>
</div>
    </section>
  );
}

export default PricingSection;
