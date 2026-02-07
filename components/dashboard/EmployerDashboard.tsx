'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/client';
import {
  Briefcase,
  CheckCircle2,
  Users,
  Plus,
  Eye,
  FileText,
  TrendingUp,
  Calendar,
  MapPin,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/card-saas';

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
        .from('jobs')
        .select(`*, applications(count)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsData) {
        setJobs(jobsData);
        const totalApps = jobsData.reduce(
          (sum, job) => sum + (job.applications?.[0]?.count || 0),
          0
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <div className="text-lg font-medium text-muted-foreground">
            Loading your dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Employer Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back! Here's what's happening with your job posts.
            </p>
          </div>
          <Link
            href="/jobs/post"
            className="group inline-flex items-center gap-2 justify-center rounded-xl bg-gradient-to-r from-primary to-primary/90 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Post New Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Jobs Card */}
          <Card className="bg-card border-border group hover:shadow-lg transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            <CardContent className="pt-6 pb-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center ring-4 ring-primary/5 group-hover:ring-primary/10 transition-all duration-300">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-primary/40 group-hover:text-primary/60 transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Jobs Posted
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.totalJobs}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Active Listings Card */}
          <Card className="bg-card border-border group hover:shadow-lg transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            <CardContent className="pt-6 pb-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center ring-4 ring-primary/5 group-hover:ring-primary/10 transition-all duration-300">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Live
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Listings
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.activeListings}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Applications Card */}
          <Card className="bg-card border-border group hover:shadow-lg transition-all duration-300 overflow-hidden relative sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            <CardContent className="pt-6 pb-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center ring-4 ring-primary/5 group-hover:ring-primary/10 transition-all duration-300">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <FileText className="w-5 h-5 text-primary/40 group-hover:text-primary/60 transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.totalApplications}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings Section */}
        <Card className="bg-card border-border shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-secondary/20">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Your Job Listings
              </h2>
              {jobs.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
                </span>
              )}
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Briefcase className="w-10 h-10 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No jobs posted yet
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Get started by posting your first job listing and start receiving applications from qualified candidates.
              </p>
              <Link
                href="/jobs/post"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Job Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Posted
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="group hover:bg-secondary/30 transition-all duration-200"
                    >
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {job.title}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {job.job_type}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {job.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-border">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                            <span className="text-lg font-bold text-primary">
                              {getApplicationCount(job)}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            applicants
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(job.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-200 hover:scale-105"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                          <Link
                            href={`/jobs/${job.id}/applicants`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200 hover:scale-105 border border-primary/20"
                          >
                            <Users className="w-4 h-4" />
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
        </Card>
      </div>
    </div>
  );
}