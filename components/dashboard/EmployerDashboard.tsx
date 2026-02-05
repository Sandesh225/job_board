// ========================================
// 2. components/dashboard/EmployerDashboard.tsx
// ========================================
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { Briefcase, Users, FileText, Plus, Loader } from "lucide-react";
import SaasButton from "../button-saas";
import { Card, CardContent, CardHeader } from "../card-saas";
import { JSX } from "react";

interface Job {
  id: string;
  title: string;
  company: string;
  job_type: string;
  location: string;
  is_active: boolean;
  created_at: string;
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
      const { data: jobsData } = await supabase
        .from("jobs")
        .select(`*, applications(count)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (jobsData) {
        setJobs(jobsData);
        const totalApps = jobsData.reduce(
          (sum, job) => sum + (job.applications?.[0]?.count || 0),
          0,
        );
        setStats({
          totalJobs: jobsData.length,
          activeListings: jobsData.filter((job) => job.is_active).length,
          totalApplications: totalApps,
        });
      }
      setLoading(false);
    }
    fetchEmployerData();
  }, [user.id, supabase]);

  const getApplicationCount = (job: Job) => job.applications?.[0]?.count || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 pb-12 pt-20">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="h2 text-foreground">Employer Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Here is what's happening with your job posts.
            </p>
          </div>
          <SaasButton asChild variant="primary" size="lg" className="gap-2">
            <Link href="/jobs/post">
              <Plus className="w-5 h-5" />
              Post New Job
            </Link>
          </SaasButton>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Jobs Posted
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stats.totalJobs}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Listings
                </p>
                <p className="text-2xl font-bold text-heading mt-2 dark:text-white">
                  {stats.activeListings}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-heading mt-2 dark:text-white">
                  {stats.totalApplications}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-heading dark:text-white">
              Your Job Listings
            </h2>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-heading dark:text-white">
                No jobs posted
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by posting your first job listing.
              </p>
              <div className="mt-6">
                <Link
                  href="/jobs/post"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                >
                  Post a Job
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase dark:bg-gray-700/50 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Applications</th>
                    <th className="px-6 py-4">Posted</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-heading dark:text-white">
                          {job.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                          {job.job_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {job.is_active ? (
                          <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-600"></span>
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-gray-400"></span>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-heading font-bold dark:text-white">
                            {getApplicationCount(job)}
                          </span>
                          <span className="text-[10px] text-gray-500 uppercase">
                            Applicants
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="text-primary-600 hover:text-primary-700 font-semibold dark:text-primary-400"
                          >
                            View
                          </Link>
                          <Link
                            href={`/jobs/${job.id}/applicants`}
                            className="text-gray-600 hover:text-gray-900 font-semibold dark:text-gray-400 dark:hover:text-white"
                          >
                            Applicants
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
    </div>
  );
}
