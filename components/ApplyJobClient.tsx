"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/client';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  FileText, 
  Link2, 
  Send,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/input-saas';
import { Textarea } from '@/ui/textarea'
import { Button } from '@/components/button-saas';

interface Job {
  id: string;
  title: string;
  company: string;
  job_type: string;
  location: string;
  experience_level: string;
  salary: string | null;
}

interface ApplyJobClientProps {
  job: Job;
  user: any;
}

export default function ApplyJobClient({ job, user }: ApplyJobClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState({
    fullName: user.user_metadata?.full_name || '',
    email: user.email || '',
    phone: '',
    coverLetter: '',
    resumeUrl: '',
  });

  const MIN_COVER_LETTER_LENGTH = 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation check
    if (formData.coverLetter.length < MIN_COVER_LETTER_LENGTH) {
      toast.error(`Cover letter must be at least ${MIN_COVER_LETTER_LENGTH} characters.`);
      return;
    }

    startTransition(async () => {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          user_id: user.id,
          status: 'pending',
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          cover_letter: formData.coverLetter,
          resume_url: formData.resumeUrl,
        });

      if (error) {
        // Postgres error code for unique violation (user already applied)
        if (error.code === '23505') {
          toast.error('You have already submitted an application for this position.');
        } else {
          console.error('Submission error:', error);
          toast.error('Something went wrong. Please try again later.');
        }
      } else {
        toast.success('Application received! Redirecting...');
        // Refresh the page/router to update server components elsewhere
        router.refresh();
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    });
  };

  const isCoverLetterValid = formData.coverLetter.length >= MIN_COVER_LETTER_LENGTH;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center space-x-2 text-sm">
          <Link 
            href="/jobs" 
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Jobs
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Link 
            href={`/jobs/${job.id}`} 
            className="text-muted-foreground hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-none"
          >
            {job.title}
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Apply</span>
        </nav>

        {/* Job Header Card */}
        <div className="relative bg-gradient-to-br from-card to-secondary/50 backdrop-blur-sm border border-border rounded-2xl shadow-lg p-6 sm:p-8 mb-8 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -z-10" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary">
                <Briefcase className="w-3.5 h-3.5" />
                Job Application
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text ">
                {job.title}
              </h1>
              <p className="text-lg text-muted-foreground font-medium">{job.company}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-xl text-sm font-semibold">
                <Briefcase className="w-4 h-4" />
                {job.job_type}
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary border border-border rounded-xl text-sm font-semibold text-foreground">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
            </div>
          </div>
        </div>

        {/* Application Form Card */}
        <div className="bg-gradient-to-br from-card to-secondary/30 backdrop-blur-sm border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-border bg-secondary/20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Candidate Information</h2>
                <p className="text-sm text-muted-foreground">Complete all fields to submit your application</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Personal Information Grid */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <div className="w-6 h-0.5 bg-primary rounded-full" />
                Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  icon={<User className="w-4 h-4" />}
                  placeholder="Jane Doe"
                />

                {/* Email */}
                <Input
                  type="email"
                  id="email"
                  name="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  icon={<Mail className="w-4 h-4" />}
                  placeholder="jane@company.com"
                />
              </div>

              {/* Contact & Resume Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  icon={<Phone className="w-4 h-4" />}
                  placeholder="+1 (555) 000-0000"
                />

                <Input
                  type="url"
                  id="resumeUrl"
                  name="resumeUrl"
                  label="Resume Link"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  required
                  icon={<Link2 className="w-4 h-4" />}
                  placeholder="https://resume.com/yourname"
                />
              </div>
            </div>

            {/* Cover Letter Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <div className="w-6 h-0.5 bg-primary rounded-full" />
                Cover Letter
              </h3>

              <Textarea
                id="coverLetter"
                name="coverLetter"
                label="Why are you a great fit?"
                value={formData.coverLetter}
                onChange={handleChange}
                required
                rows={10}
                icon={<FileText className="w-4 h-4" />}
                placeholder="Share your experience, skills, and why you're interested in this role. Tell us what makes you the perfect candidate..."
                showCount
                maxCount={MIN_COVER_LETTER_LENGTH}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => router.push(`/jobs/${job.id}`)}
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-[2]"
                isLoading={isPending}
                disabled={isPending || !isCoverLetterValid}
              >
                <Send className="w-5 h-5" />
                {isPending ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            By submitting this application, you agree to share your information with the employer.
          </p>
        </div>
      </div>
    </div>
  );
}