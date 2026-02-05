'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '../card-saas';

const faqs = [
  {
    question: 'How does the AI cover letter generation work?',
    answer:
      'Our AI analyzes the job description you provide and extracts key requirements, company details, and role specifics. It then generates a personalized, professional cover letter that matches your background with the role requirements. The entire process takes about 60 seconds.',
  },
  {
    question: 'Can I customize the generated cover letter?',
    answer:
      'Absolutely! The generated letter is just a starting point. You can edit every section, add personal touches, adjust the tone, or completely rewrite any part. We provide an easy-to-use editor with formatting options.',
  },
  {
    question: 'Are the letters ATS-optimized?',
    answer:
      'Yes, all our generated letters are automatically formatted and optimized to pass Applicant Tracking Systems. We follow best practices for formatting, keyword placement, and structure to maximize your chances of getting through automated screening.',
  },
  {
    question: 'What formats can I download the letter in?',
    answer:
      'You can download cover letters as PDF, Word (.docx), or plain text. You can also copy the content directly to clipboard for pasting into online forms or email.',
  },
  {
    question: 'Is my personal information secure?',
    answer:
      'Yes, we take security seriously. All data is encrypted in transit and at rest. We never share your information with third parties, and you can delete your data anytime. We comply with GDPR, CCPA, and other privacy regulations.',
  },
  {
    question: 'How many cover letters can I generate per month?',
    answer:
      'It depends on your plan. The Starter plan includes up to 5 letters/month. Professional plan offers unlimited letters. You can upgrade anytime without losing previous letters.',
  },
  {
    question: 'Can I use this for other types of applications?',
    answer:
      'While optimized for cover letters, users report success adapting the tool for motivation letters, university applications, and other similar documents. The AI is flexible enough to handle different writing styles and formats.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and for enterprise customers, bank transfers. All payments are processed securely through Stripe.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! The Professional plan includes a 7-day free trial with full access to unlimited letter generation. No credit card required to start the trial.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, you can cancel anytime with no penalties. If you cancel within 30 days, you\'re eligible for a full refund. Your account and letters remain accessible until the end of your billing period.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <h3 className="font-semibold text-foreground flex-1">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <CardContent className="border-t border-border px-6 py-4 bg-secondary/10">
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </CardContent>
      )}
    </Card>
  );
}

export function FAQSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 dark:bg-primary/20 dark:border-primary/30 mb-6">
            <span className="text-sm font-semibold text-primary">Questions?</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about JobBoard.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 dark:from-primary/20 dark:to-primary/10 dark:border-primary/30">
            <CardContent className="pt-12 pb-12">
              <h3 className="text-2xl font-bold text-foreground mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help. Reach out anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@jobboard.app"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  Email Support
                </a>
                <a
                  href="https://chat.jobboard.app"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
                >
                  Live Chat
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
