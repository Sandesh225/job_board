"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
}

interface CandidateDashboardProps {
  user: any;
}

export default function CandidateDashboard({ user }: CandidateDashboardProps) {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidateData() {
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      const { data: applicationsData } = await supabase
        .from('applications')
        .select('*, jobs(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsData) setJobs(jobsData);
      if (applicationsData) setApplications(applicationsData);
      setLoading(false);
    }

    fetchCandidateData();
  }, [user.id, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-heading">Loading your dashboard...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-heading">Job Seeker Dashboard</h1>
        <Link
          href="/jobs"
          className="text-white bg-brand border border-transparent hover:bg-brand-strong shadow-xs font-medium rounded-base text-sm px-5 py-2.5"
        >
          Browse All Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-default-medium rounded-base shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-body">Applications Sent</p>
              <p className="text-2xl font-bold text-heading mt-2">{applications.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-default-medium rounded-base shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-body">Interviews</p>
              <p className="text-2xl font-bold text-heading mt-2">
                {applications.filter(app => app.status === 'accepted').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-default-medium rounded-base shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-body">Profile Views</p>
              <p className="text-2xl font-bold text-heading mt-2">0</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {applications.length > 0 && (
        <div className="bg-white border border-default-medium rounded-base shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-bold text-heading mb-4">Application Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="border border-default-medium rounded-base p-4 hover:shadow-md transition-shadow dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-heading">{application.jobs?.title || 'Job Title'}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                    {application.status || 'pending'}
                  </span>
                </div>
                <p className="text-sm text-body mb-1">{application.jobs?.company || 'Company'}</p>
                <p className="text-xs text-body">{application.jobs?.location || 'Location'}</p>
                <p className="text-xs text-body mt-2">
                  Applied: {new Date(application.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-default-medium rounded-base shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-bold text-heading mb-4">Recommended Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-default-medium rounded-base p-5 hover:shadow-md transition-shadow dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-heading text-lg">{job.title}</h3>
              </div>
              <p className="text-sm font-medium text-body mb-2">{job.company}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                  {job.job_type}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                  {job.experience_level}
                </span>
              </div>
              <p className="text-sm text-body mb-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </p>
              {job.salary && (
                <p className="text-sm text-body mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.salary}
                </p>
              )}
              <a
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-white bg-brand border border-transparent hover:bg-brand-strong shadow-xs font-medium rounded-base text-sm px-5 py-2.5"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-heading">No jobs available</h3>
            <p className="mt-1 text-sm text-body">Check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
}