"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/client';

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm font-medium">
          <Link href="/jobs" className="text-primary-600 hover:text-primary-700 transition-colors">Jobs</Link>
          <span className="text-gray-400">/</span>
          <Link href={`/jobs/${job.id}`} className="text-primary-600 hover:text-primary-700 transition-colors truncate max-w-[150px] sm:max-w-none">
            {job.title}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500 dark:text-gray-400">Apply</span>
        </nav>

        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Apply for {job.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{job.company}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-xs font-semibold">
                {job.job_type}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold">
                {job.location}
              </span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Candidate Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Jane Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="jane@company.com"
                />
              </div>
            </div>

            {/* Phone & Resume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label htmlFor="resumeUrl" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Resume Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="resumeUrl"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="https://resume.com/yourname"
                />
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="coverLetter" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs font-medium ${formData.coverLetter.length < MIN_COVER_LETTER_LENGTH ? 'text-orange-500' : 'text-green-500'}`}>
                  {formData.coverLetter.length} / {MIN_COVER_LETTER_LENGTH} chars min
                </span>
              </div>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                placeholder="Share your experience and why you're interested in this role..."
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Link
                href={`/jobs/${job.id}`}
                className="flex-1 px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isPending || formData.coverLetter.length < MIN_COVER_LETTER_LENGTH}
                className="flex-[2] px-6 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Submitting...
                  </>
                ) : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}