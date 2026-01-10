"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Job {
  id: string;
  title: string;
  company: string;
  job_type: string;
  location: string;
  experience_level: string;
  salary: string | null;
  created_at: string;
  is_active: boolean;
  applications?: { count: number }[];
}

interface MyJobsClientProps {
  jobs: Job[];
}

type FilterStatus = "all" | "active" | "inactive";

// ============================================================================
// Utility Functions
// ============================================================================

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getApplicationCount = (job: Job): number => {
  return job.applications?.[0]?.count || 0;
};

// ============================================================================
// Sub-components
// ============================================================================

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconColor,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div
          className={`h-12 w-12 rounded-full ${bgColor} flex items-center justify-center`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

interface SearchFiltersProps {
  searchTerm: string;
  filterStatus: FilterStatus;
  filteredCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: FilterStatus) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  filterStatus,
  filteredCount,
  totalCount,
  onSearchChange,
  onFilterChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="search"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Search Jobs
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or company..."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Filter by Status
          </label>
          <select
            id="status"
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Jobs</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredCount}
          </span>{" "}
          of {totalCount} jobs
        </p>
      </div>
    </div>
  );
};

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const applicationCount = getApplicationCount(job);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {job.title}
            </h3>
            {job.is_active ? (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Active
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Inactive
              </span>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {job.company}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
              {job.job_type}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {job.experience_level}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {job.location}
            </span>
            {job.salary && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {job.salary}
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Posted {formatDate(job.created_at)}
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1.5"
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
              {applicationCount} Application{applicationCount !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <Link
            href={`/jobs/${job.id}`}
            className="px-4 py-2 text-primary-600 hover:text-primary-700 border border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg font-medium transition-colors"
          >
            View
          </Link>
          <Link
            href={`/jobs/${job.id}/edit`}
            className="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ hasSearch: boolean }> = ({ hasSearch }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        No jobs found
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {hasSearch
          ? "Try adjusting your search"
          : "Get started by posting your first job"}
      </p>
      {!hasSearch && (
        <div className="mt-6">
          <Link
            href="/jobs/post"
            className="inline-flex items-center px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
          >
            Post a Job
          </Link>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export default function MyJobsClient({ jobs }: MyJobsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Memoized filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && job.is_active) ||
        (filterStatus === "inactive" && !job.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, filterStatus]);

  // Memoized statistics
  const stats = useMemo(() => {
    const activeJobs = jobs.filter((j) => j.is_active).length;
    const totalApplications = jobs.reduce(
      (sum, job) => sum + getApplicationCount(job),
      0
    );

    return {
      total: jobs.length,
      active: activeJobs,
      applications: totalApplications,
    };
  }, [jobs]);

  // Event handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilterChange = useCallback((value: FilterStatus) => {
    setFilterStatus(value);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Job Listings
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage and track your posted positions
              </p>
            </div>
            <Link
              href="/jobs/post"
              className="inline-flex items-center justify-center px-6 py-3 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg font-semibold transition-all shadow"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Post New Job
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Jobs"
              value={stats.total}
              bgColor="bg-primary-100 dark:bg-primary-900"
              iconColor="text-primary-600"
              icon={
                <svg
                  className="w-6 h-6"
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
              }
            />

            <StatsCard
              title="Active Listings"
              value={stats.active}
              bgColor="bg-green-100 dark:bg-green-900"
              iconColor="text-green-600"
              icon={
                <svg
                  className="w-6 h-6"
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
              }
            />

            <StatsCard
              title="Total Applications"
              value={stats.applications}
              bgColor="bg-blue-100 dark:bg-blue-900"
              iconColor="text-blue-600"
              icon={
                <svg
                  className="w-6 h-6"
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
              }
            />
          </div>

          {/* Search and Filters */}
          <SearchFilters
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            filteredCount={filteredJobs.length}
            totalCount={jobs.length}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <EmptyState hasSearch={searchTerm.length > 0} />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}