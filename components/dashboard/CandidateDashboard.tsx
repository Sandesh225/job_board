"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/client";

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

interface Application {
  id: string;
  status: string;
  job_id: string;
  created_at: string;
  jobs: Job;
}

interface CandidateDashboardProps {
  user: any;
}

// Helper Component for Status Badges to keep main code clean
const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  let colors = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  let icon = null;

  if (s === "accepted") {
    colors =
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    icon = (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    );
  } else if (s === "rejected") {
    colors = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    icon = (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    );
  } else if (s === "pending" || s === "interviewing") {
    colors = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    icon = (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    );
  }

  return (
    <span
      className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${colors}`}
    >
      {icon && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      )}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function CandidateDashboard({ user }: CandidateDashboardProps) {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidateData = useCallback(async () => {
    try {
      // 1. Fetch user applications
      const { data: appsData } = await supabase
        .from("applications")
        .select("*, jobs(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const currentApps = appsData || [];
      setApplications(currentApps);

      // 2. Fetch jobs (Filtering out applied ones)
      let jobQuery = supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (currentApps.length > 0) {
        const appliedJobIds = currentApps.map((app) => app.job_id);
        jobQuery = jobQuery.not("id", "in", `(${appliedJobIds.join(",")})`);
      }

      const { data: jobsData } = await jobQuery;
      setJobs(jobsData || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id, supabase]);

  useEffect(() => {
    fetchCandidateData();

    // Listen for ANY change to user's applications (Insert/Update/Delete)
    const channel = supabase
      .channel(`apps_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchCandidateData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id, supabase, fetchCandidateData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium animate-pulse">
          Loading your career dashboard...
        </div>
      </div>
    );
  }

  const acceptedApps = applications.filter((app) => app.status === "accepted");
  const rejectedApps = applications.filter((app) => app.status === "rejected");
  const pendingApps = applications.filter((app) =>
    ["pending", "interviewing"].includes(app.status.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <div className="space-y-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-heading dark:text-white">
              Job Seeker Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your applications and find your next role.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors shadow-sm"
          >
            Browse All Jobs
          </Link>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Applied
            </p>
            <p className="text-2xl font-bold text-heading mt-2 dark:text-white">
              {applications.length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Accepted
            </p>
            <p className="text-2xl font-bold text-green-600 mt-2 dark:text-green-400">
              {acceptedApps.length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-2 dark:text-blue-400">
              {pendingApps.length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Rejected
            </p>
            <p className="text-2xl font-bold text-red-600 mt-2 dark:text-red-400">
              {rejectedApps.length}
            </p>
          </div>
        </div>

        {/* ACCEPTED JOBS SECTION */}
        {acceptedApps.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 dark:bg-green-900/10 dark:border-green-800">
            <h2 className="text-xl font-bold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
              🎉 Accepted Positions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {acceptedApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-heading dark:text-white">
                      {app.jobs?.title}
                    </h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {app.jobs?.company}
                  </p>
                  <Link
                    href={`/jobs/${app.job_id}`}
                    className="text-xs font-semibold text-green-600 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PENDING APPLICATIONS */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-heading dark:text-white">
            Active Applications
          </h2>
          {pendingApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pendingApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-heading dark:text-white">
                      {app.jobs?.title}
                    </h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {app.jobs?.company}
                  </p>
                  <div className="pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Applied {new Date(app.created_at).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/jobs/${app.job_id}`}
                      className="text-xs font-semibold text-primary-600 hover:underline"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">
                No active applications at the moment.
              </p>
            </div>
          )}
        </div>

        {/* RECOMMENDED JOBS */}
        {jobs.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-heading dark:text-white">
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <h3 className="font-bold text-lg dark:text-white mb-1">
                    {job.title}
                  </h3>
                  <p className="text-sm font-medium text-primary-600 mb-4">
                    {job.company}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                      {job.job_type}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                      {job.experience_level}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 mt-6">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="flex-1 text-center py-2 text-xs font-bold border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/jobs/${job.id}/apply`}
                      className="flex-1 text-center py-2 text-xs font-bold bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REJECTED (COLLAPSIBLE) */}
        {rejectedApps.length > 0 && (
          <details className="group border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <summary className="p-4 cursor-pointer font-bold bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
              Rejected Applications ({rejectedApps.length})
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {rejectedApps.map((app) => (
                <div key={app.id} className="p-3 border rounded-lg opacity-60">
                  <h4 className="font-bold text-sm">{app.jobs?.title}</h4>
                  <p className="text-xs">{app.jobs?.company}</p>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}