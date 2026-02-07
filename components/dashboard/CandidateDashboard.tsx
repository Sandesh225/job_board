"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/client";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  MapPin,
  Sparkles,
  Search,
  TrendingUp,
  Calendar,
  ExternalLink,
  ChevronDown,
  PartyPopper,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/card-saas";

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

// ============================================================================
// Utility Functions & Constants
// ============================================================================

const getStatusConfig = (status: string) => {
  const configs: Record<string, any> = {
    accepted: {
      colors: "bg-primary/20 text-primary border-primary/30",
      icon: CheckCircle2,
      bgColor: "bg-primary/5",
    },
    rejected: {
      colors: "bg-destructive/20 text-destructive border-destructive/30",
      icon: XCircle,
      bgColor: "bg-destructive/5",
    },
    pending: {
      colors: "bg-primary/20 text-primary border-primary/30",
      icon: Clock,
      bgColor: "bg-primary/5",
    },
    interviewing: {
      colors: "bg-primary/20 text-primary border-primary/30",
      icon: Briefcase,
      bgColor: "bg-primary/5",
    },
  };

  const s = status.toLowerCase();
  return configs[s] || configs.pending;
};

// ============================================================================
// Sub-components
// ============================================================================

const StatusBadge = ({ status }: { status: string }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border ${config.colors}`}>
      <Icon className="w-3.5 h-3.5" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}) => (
  <Card className="bg-card border-border group hover:shadow-lg transition-all duration-300 overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-24 h-24 ${bgColor} rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`} />
    <CardContent className="pt-6 pb-6 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
          {Icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </CardContent>
  </Card>
);

const AcceptedJobCard = ({ app }: { app: Application }) => (
  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 hover:shadow-lg transition-all duration-300 group">
    <CardContent className="pt-6 pb-6">
      <div className="flex justify-between items-start mb-3 gap-2">
        <h3 className="font-bold text-foreground text-sm">{app.jobs?.title}</h3>
        <StatusBadge status={app.status} />
      </div>
      <p className="text-sm text-muted-foreground mb-4">{app.jobs?.company}</p>
      <Link
        href={`/jobs/${app.job_id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2 transition-all"
      >
        View Details
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </CardContent>
  </Card>
);

const PendingAppCard = ({ app }: { app: Application }) => (
  <Card className="bg-card border-border hover:shadow-lg transition-all duration-300">
    <CardContent className="pt-6 pb-6">
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="font-bold text-foreground text-sm">{app.jobs?.title}</h3>
        <StatusBadge status={app.status} />
      </div>
      <p className="text-sm text-muted-foreground mb-4">{app.jobs?.company}</p>
      <div className="pt-4 border-t border-border flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(app.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
        <Link
          href={`/jobs/${app.job_id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
        >
          View
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </CardContent>
  </Card>
);

const RecommendedJobCard = ({ job }: { job: Job }) => (
  <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 group">
    <CardContent className="pt-6 pb-6 space-y-4">
      <div>
        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
          {job.title}
        </h3>
        <p className="text-sm font-medium text-primary">{job.company}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
          <Briefcase className="w-3 h-3" />
          {job.job_type}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-foreground border border-border">
          <Sparkles className="w-3 h-3" />
          {job.experience_level}
        </span>
        {job.location && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-foreground border border-border">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 text-center py-2 text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-lg transition-all"
        >
          Details
        </Link>
        <Link
          href={`/jobs/${job.id}/apply`}
          className="flex-1 text-center py-2 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Apply
        </Link>
      </div>
    </CardContent>
  </Card>
);

// ============================================================================
// Main Dashboard
// ============================================================================

export default function CandidateDashboard({ user }: CandidateDashboardProps) {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidateData = useCallback(async () => {
    try {
      const { data: appsData } = await supabase
        .from("applications")
        .select("*, jobs(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const currentApps = appsData || [];
      setApplications(currentApps);

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <div className="text-lg font-medium text-muted-foreground">
            Loading your dashboard...
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 sm:py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
              Your Career Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage applications and discover opportunities
            </p>
          </div>
          <Link
            href="/jobs"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-fit"
          >
            <Search className="w-5 h-5" />
            Browse Jobs
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Applied"
            value={applications.length}
            icon={<FileCheck className="w-5 h-5" />}
            bgColor="bg-primary/5"
          />
          <StatsCard
            title="Accepted"
            value={acceptedApps.length}
            icon={<CheckCircle2 className="w-5 h-5" />}
            bgColor="bg-primary/5"
          />
          <StatsCard
            title="Pending"
            value={pendingApps.length}
            icon={<Clock className="w-5 h-5" />}
            bgColor="bg-primary/5"
          />
          <StatsCard
            title="Rejected"
            value={rejectedApps.length}
            icon={<XCircle className="w-5 h-5" />}
            bgColor="bg-destructive/5"
          />
        </div>

        {/* Accepted Jobs */}
        {acceptedApps.length > 0 && (
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20">
                <PartyPopper className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Accepted Positions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {acceptedApps.map((app) => (
                <AcceptedJobCard key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}

        {/* Pending Apps */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Active Applications
            </h2>
          </div>

          {pendingApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pendingApps.map((app) => (
                <PendingAppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-16 text-center">
                <Clock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No active applications yet
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommended Jobs */}
        {jobs.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Recommended for You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <RecommendedJobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Rejected (Collapsible) */}
        {rejectedApps.length > 0 && (
          <details className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all">
            <summary className="p-6 cursor-pointer font-bold flex justify-between items-center hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-destructive" />
                <span className="text-foreground">
                  Rejected Applications ({rejectedApps.length})
                </span>
              </div>
              <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-border">
              {rejectedApps.map((app) => (
                <div key={app.id} className="p-4 border border-border rounded-lg opacity-60">
                  <h4 className="font-bold text-sm text-foreground">{app.jobs?.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {app.jobs?.company}
                  </p>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}