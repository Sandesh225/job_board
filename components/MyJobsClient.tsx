'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  CheckCircle2,
  Users,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  Calendar,
  MapPin,
  Search,
  Filter,
  FileText,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/card-saas';

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

type FilterStatus = 'all' | 'active' | 'inactive';

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getApplicationCount = (job: Job): number => {
  return job.applications?.[0]?.count || 0;
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  iconBg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
}) => {
  return (
    <Card className="bg-card border-border group hover:shadow-lg transition-all duration-300 overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgColor} rounded-full blur-3xl group-hover:opacity-100 transition-opacity duration-500 opacity-50`} />
      <CardContent className="pt-6 pb-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          <div className={`h-14 w-14 rounded-xl ${iconBg} flex items-center justify-center ring-4 ring-primary/5 group-hover:ring-primary/10 transition-all`}>
            {Icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SearchFilters = ({
  searchTerm,
  filterStatus,
  filteredCount,
  totalCount,
  onSearchChange,
  onFilterChange,
}: {
  searchTerm: string;
  filterStatus: FilterStatus;
  filteredCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: FilterStatus) => void;
}) => {
  return (
    <Card className="bg-card border-border shadow-lg">
      <CardContent className="pt-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="search"
              className="block text-sm font-semibold text-foreground flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
              Search Jobs
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by title or company..."
                className="w-full px-4 py-3 pl-11 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-foreground flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-muted-foreground" />
              Filter by Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filteredCount}</span> of{' '}
            <span className="font-semibold">{totalCount}</span> jobs
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const JobCard = ({ job, index }: { job: Job; index: number }) => {
  const applicationCount = getApplicationCount(job);

  return (
    <Card
      className="bg-card border-border hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-bold text-foreground">
                {job.title}
              </h3>
              {job.is_active ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full uppercase bg-primary/10 text-primary border border-primary/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full uppercase bg-muted text-muted-foreground border border-border">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  Inactive
                </span>
              )}
            </div>

            <p className="text-lg font-medium text-muted-foreground">
              {job.company}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                <Briefcase className="w-3.5 h-3.5" />
                {job.job_type}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                {job.experience_level}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-foreground border border-border">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              {job.salary && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                  <DollarSign className="w-3.5 h-3.5" />
                  {job.salary}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Posted {formatDate(job.created_at)}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-semibold text-foreground">{applicationCount}</span>
                <span>Application{applicationCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/jobs/${job.id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-xl font-semibold transition-all duration-200 hover:scale-105 whitespace-nowrap"
            >
              <Eye className="w-4 h-4" />
              View
            </Link>
            <Link
              href={`/jobs/${job.id}/edit`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = ({ hasSearch }: { hasSearch: boolean }) => {
  return (
    <Card className="bg-card border-border shadow-lg">
      <CardContent className="py-16 text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          {hasSearch ? (
            <Search className="w-10 h-10 text-primary/60" />
          ) : (
            <Briefcase className="w-10 h-10 text-primary/60" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No jobs found
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {hasSearch
            ? 'Try adjusting your search or filter criteria'
            : 'Get started by posting your first job listing'}
        </p>
        {!hasSearch && (
          <Link
            href="/jobs/post"
            className="inline-flex items-center gap-2 px-6 py-3 text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Post Your First Job
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default function MyJobsClient({ jobs }: MyJobsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && job.is_active) ||
        (filterStatus === 'inactive' && !job.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, filterStatus]);

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

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilterChange = useCallback((value: FilterStatus) => {
    setFilterStatus(value);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                My Job Listings
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage and track your posted positions
              </p>
            </div>
            <Link
              href="/jobs/post"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Post New Job
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Jobs"
              value={stats.total}
              bgColor="bg-primary/5"
              iconBg="bg-primary/20"
              icon={<Briefcase className="w-7 h-7 text-primary" />}
            />

            <StatsCard
              title="Active Listings"
              value={stats.active}
              bgColor="bg-primary/5"
              iconBg="bg-primary/20"
              icon={<CheckCircle2 className="w-7 h-7 text-primary" />}
            />

            <StatsCard
              title="Total Applications"
              value={stats.applications}
              bgColor="bg-primary/5"
              iconBg="bg-primary/20"
              icon={<Users className="w-7 h-7 text-primary" />}
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
          <div className="space-y-6">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}