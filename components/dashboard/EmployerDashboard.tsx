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
  is_active: boolean;
  applications?: { count: number }[];
}

interface EmployerDashboardProps {
  user: any;
}

export default function EmployerDashboard({ user }: EmployerDashboardProps) {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeListings: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployerData() {
      // Fetch jobs with application counts
      const { data: jobsData } = await supabase
        .from('jobs')
        .select(`
          *,
          applications(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsData) {
        setJobs(jobsData);
        
        // Calculate total applications
        const totalApps = jobsData.reduce((sum, job) => {
          return sum + (job.applications?.[0]?.count || 0);
        }, 0);

        setStats({
          totalJobs: jobsData.length,
          activeListings: jobsData.filter(job => job.is_active).length,
          totalApplications: totalApps,
        });
      }
      setLoading(false);
    }

    fetchEmployerData();
  }, [user.id, supabase]);

  const getApplicationCount = (job: Job) => {
    return job.applications?.[0]?.count || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-heading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-heading">Employer Dashboard</h1>
        <Link
          href="/jobs/post"
          className="text-white bg-brand border border-transparent hover:bg-brand-strong shadow-xs font-medium rounded-base text-sm px-5 py-2.5"
        >
          Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-default-medium rounded-base shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-body">Total Jobs Posted</p>
              <p className="text-2xl font-bold text-heading mt-2">{stats.totalJobs}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-default-medium rounded-base shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-body">Active Listings</p>
              <p className="text-2xl font-bold text-heading mt-2">{stats.activeListings}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-default-medium rounded-base shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-body">Total Applications</p>
              <p className="text-2xl font-bold text-heading mt-2">{stats.totalApplications}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-default-medium rounded-base shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-bold text-heading mb-4">Your Job Listings</h2>
        
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-heading">No jobs posted</h3>
            <p className="mt-1 text-sm text-body">Get started by posting your first job listing.</p>
            <div className="mt-6">
              <Link
                href="/jobs/post"
                className="text-white bg-brand border border-transparent hover:bg-brand-strong shadow-xs font-medium rounded-base text-sm px-5 py-2.5 inline-block"
              >
                Post a Job
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-secondary-medium text-heading text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Job Title</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Applications</th>
                  <th className="px-6 py-3">Posted</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-medium text-heading">{job.title}</td>
                    <td className="px-6 py-4 text-body">{job.company}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        {job.job_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-body">{job.location}</td>
                    <td className="px-6 py-4">
                      {job.is_active ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-heading font-semibold">{getApplicationCount(job)}</span>
                        <span className="text-body text-xs">applicants</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="text-primary-600 hover:underline font-medium"
                        >
                          View
                        </Link>
                        <Link
                          href={`/jobs/${job.id}/edit`}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:underline font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}