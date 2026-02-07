'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, MessageCircle } from 'lucide-react';
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

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300 group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-secondary/50 transition-colors duration-300 group-hover:bg-secondary/30"
      >
        <div className="flex items-start gap-3 flex-1">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary flex-shrink-0 mt-0.5 font-semibold text-xs">
            {index + 1}
          </div>
          <h3 className="font-semibold text-foreground flex-1 text-left">
            {question}
          </h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <CardContent className="border-t border-border px-6 py-4 bg-secondary/30 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex gap-4">
            <div className="w-1 bg-primary rounded-full flex-shrink-0" />
            <p className="text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function FAQSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background">
      {/* Background gradient - uses CSS variables */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 -z-10" />

      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Questions?</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about JobBoard and how to get started.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
          ))}
        </div>

        {/* CTA Section - Enhanced */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
            <CardContent className="pt-12 pb-12 relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  Still have questions?
                </h3>
                <p className="text-muted-foreground">
                  Our support team is here to help. Reach out anytime.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
                <a
                  href="mailto:support@jobboard.app"
                  className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                >
                  <Mail className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  <span>Email Support</span>
                </a>
                <a
                  href="https://chat.jobboard.app"
                  className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 hover:shadow-lg hover:scale-105 group font-semibold"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Live Chat</span>
                </a>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Average response time: 2 hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;