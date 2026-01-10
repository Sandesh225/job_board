"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  description: string;
  application_url: string;
  created_at: string;
  user_id: string;
}

interface JobDetailClientProps {
  job: Job;
  user: any;
  hasApplied: boolean;
}

export default function JobDetailClient({ job, user, hasApplied: initialHasApplied }: JobDetailClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [isSaved, setIsSaved] = useState(false);

  const userRole = user?.user_metadata?.role;
  const isOwner = user?.id === job.user_id;

  const handleApply = () => {
    if (!user) {
      toast.error('Please log in to apply for jobs');
      router.push('/login');
      return;
    }

    if (userRole !== 'job-seeker') {
      toast.error('Only job seekers can apply for positions');
      return;
    }

    startTransition(async () => {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          user_id: user.id,
          status: 'pending'
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('You have already applied for this job');
        } else {
          toast.error('Failed to submit application');
        }
      } else {
        toast.success('Application submitted successfully!');
        setHasApplied(true);
      }
    });
  };

  const handleSaveJob = () => {
    if (!user) {
      toast.error('Please log in to save jobs');
      router.push('/login');
      return;
    }

    startTransition(async () => {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('job_id', job.id)
          .eq('user_id', user.id);

        if (!error) {
          setIsSaved(false);
          toast.success('Job removed from saved list');
        }
      } else {
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            job_id: job.id,
            user_id: user.id
          });

        if (!error) {
          setIsSaved(true);
          toast.success('Job saved successfully!');
        }
      }
    });
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm">
          <Link href="/jobs" className="text-primary-600 hover:underline">
            Jobs
          </Link>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <span className="text-gray-600 dark:text-gray-400">{job.title}</span>
        </nav>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
          
          {/* Header Section */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {job.title}
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                  {job.company}
                </p>
                
                {/* Job Meta */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                    {job.job_type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {job.experience_level}
                  </span>
                  {job.salary && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {job.salary}
                    </span>
                  )}
                </div>

                {/* Location and Posted */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Posted {timeAgo(job.created_at)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 ml-4">
                {!isOwner && userRole === 'job-seeker' && (
                  <button
                    onClick={handleSaveJob}
                    disabled={isPending}
                    className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    title={isSaved ? "Remove from saved" : "Save job"}
                  >
                    <svg className={`w-5 h-5 ${isSaved ? 'fill-primary-600' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Apply Button */}
            {!isOwner && (
              <div className="flex gap-3">
                {hasApplied ? (
                  <div className="flex items-center px-6 py-3 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 font-medium">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Applied
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={isPending}
                    className="px-8 py-3 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? 'Applying...' : 'Apply Now'}
                  </button>
                )}
                
                <a
                  href={job.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  Apply on Company Site
                </a>
              </div>
            )}

            {isOwner && (
              <div className="flex gap-3">
                <Link
                  href={`/jobs/${job.id}/edit`}
                  className="px-6 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
                >
                  Edit Job
                </Link>
                <button
                  className="px-6 py-3 text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  View Analytics
                </button>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Job Description
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </p>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="p-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Job Details
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Job Type</dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-white">{job.job_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Experience Level</dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-white">{job.experience_level}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-white">{job.location}</dd>
              </div>
              {job.salary && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Salary Range</dt>
                  <dd className="text-base font-semibold text-gray-900 dark:text-white">{job.salary}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Posted</dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-white">
                  {new Date(job.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center text-sm text-primary-600 hover:underline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all jobs
          </Link>
        </div>
      </div>
    </div>
  );
}