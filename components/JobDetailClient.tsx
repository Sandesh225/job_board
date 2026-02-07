"use client";

import React, {
  useState,
  useTransition,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Calendar,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/card-saas";
import { Input } from "@/components/input-saas";
import { Button } from "@/components/button-saas";

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
  user_id: string;
}

interface User {
  id: string;
  user_metadata?: {
    role?: string;
  };
}

interface JobDetailClientProps {
  job: Job;
  user: User | null;
  hasApplied: boolean;
  applicationStatus?: ApplicationStatus;
}

type ApplicationStatus = "accepted" | "rejected" | "pending" | "interviewing";

interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  icon: React.ReactNode;
  message: string;
}

// ============================================================================
// Constants
// ============================================================================

const STATUS_CONFIGS: Record<ApplicationStatus, StatusConfig> = {
  accepted: {
    bg: "bg-green-500/10",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-500/20",
    icon: <CheckCircle2 className="h-5 w-5" />,
    message: "Congratulations! Your application has been accepted.",
  },
  rejected: {
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/20",
    icon: <XCircle className="h-5 w-5" />,
    message: "Unfortunately, your application was not successful this time.",
  },
  pending: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
    icon: <Clock className="h-5 w-5" />,
    message: "Your application is under review.",
  },
  interviewing: {
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/20",
    icon: <Briefcase className="h-5 w-5" />,
    message: "You've been selected for an interview!",
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const posted = new Date(dateString);
  const diffInMs = now.getTime() - posted.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// ============================================================================
// Sub-components
// ============================================================================

interface StatusBannerProps {
  status: ApplicationStatus;
}

const StatusBanner: React.FC<StatusBannerProps> = ({ status }) => {
  const config = STATUS_CONFIGS[status];

  return (
    <div className={`rounded-xl border p-4 ${config.bg} ${config.border}`}>
      <div className="flex items-center gap-3">
        <div className={config.text}>
          {config.icon}
        </div>
        <div>
          <p className={`font-semibold ${config.text}`}>
            Application Status: {capitalizeFirst(status)}
          </p>
          <p className={`text-sm ${config.text} opacity-90`}>{config.message}</p>
        </div>
      </div>
    </div>
  );
};

interface JobHeaderProps {
  job: Job;
}

const JobHeader: React.FC<JobHeaderProps> = ({ job }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-foreground">
          {job.title}
        </h1>
        <div className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-foreground">{job.company}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
          <Briefcase className="w-4 h-4" />
          {job.job_type}
        </span>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          {job.experience_level}
        </span>
        {job.salary && (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            <DollarSign className="w-4 h-4" />
            {job.salary}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Posted {formatTimeAgo(job.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

interface JobActionsProps {
  isOwner: boolean;
  hasApplied: boolean;
  isSaved: boolean;
  isPending: boolean;
  userRole?: string;
  jobId: string;
  applicationUrl: string;
  onApply: () => void;
  onSave: () => void;
}

const JobActions: React.FC<JobActionsProps> = ({
  isOwner,
  hasApplied,
  isSaved,
  isPending,
  userRole,
  jobId,
  applicationUrl,
  onApply,
  onSave,
}) => {
  if (isOwner) {
    return (
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={() => window.location.href = `/jobs/${jobId}/applicants`}
        >
          View Applicants
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.location.href = `/jobs/${jobId}/edit`}
        >
          Edit Job
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userRole === "job-seeker" && (
        <Button
          variant="outline"
          size="lg"
          onClick={onSave}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
          {isSaved ? "Saved" : "Save Job"}
        </Button>
      )}

      <div className="flex flex-wrap gap-3">
        {hasApplied ? (
          <Button
            variant="outline"
            size="lg"
            disabled
          >
            <CheckCircle2 className="h-5 w-5" />
            Already Applied
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={onApply}
          >
            Apply Now
          </Button>
        )}

        <Button
          variant="outline"
          size="lg"
          onClick={() => window.open(applicationUrl, '_blank')}
        >
          Apply on Company Site
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface JobDetailsProps {
  job: Job;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  const details = [
    { label: "Job Type", value: job.job_type, icon: <Briefcase className="w-4 h-4" /> },
    { label: "Experience Level", value: job.experience_level, icon: <Briefcase className="w-4 h-4" /> },
    { label: "Location", value: job.location, icon: <MapPin className="w-4 h-4" /> },
    ...(job.salary ? [{ label: "Salary Range", value: job.salary, icon: <DollarSign className="w-4 h-4" /> }] : []),
    { label: "Posted", value: formatDate(job.created_at), icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6 pb-6">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Job Details
        </h2>
        <dl className="space-y-5">
          {details.map(({ label, value, icon }) => (
            <div key={label}>
              <dt className="mb-2 text-sm font-semibold text-muted-foreground flex items-center gap-2">
                {icon}
                {label}
              </dt>
              <dd className="text-base font-medium text-foreground ml-6">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export default function JobDetailClient({
  job,
  user,
  hasApplied: initialHasApplied,
  applicationStatus: initialStatus,
}: JobDetailClientProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [isPending, startTransition] = useTransition();
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [applicationStatus, setApplicationStatus] = useState<
    ApplicationStatus | undefined
  >(initialStatus);
  const [isSaved, setIsSaved] = useState(false);

  const userRole = user?.user_metadata?.role;
  const isOwner = user?.id === job.user_id;
  const isJobSeeker = userRole === "job-seeker";

  // ============================================================================
  // Real-time Subscription
  // ============================================================================

  useEffect(() => {
    if (!user || !hasApplied) return;

    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      channel = supabase
        .channel(`application_status_${job.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "applications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            if (payload.new.job_id === job.id) {
              const newStatus = payload.new.status as ApplicationStatus;
              setApplicationStatus(newStatus);
              toast.info(
                `Application status updated to: ${capitalizeFirst(newStatus)}`
              );
            }
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, hasApplied, job.id, supabase]);

  // ============================================================================
  // Check if job is saved
  // ============================================================================

  useEffect(() => {
    if (!user || !isJobSeeker) return;

    const checkSavedStatus = async () => {
      const { data } = await supabase
        .from("saved_jobs")
        .select("id")
        .eq("job_id", job.id)
        .eq("user_id", user.id)
        .single();

      setIsSaved(!!data);
    };

    checkSavedStatus();
  }, [user, isJobSeeker, job.id, supabase]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleApply = useCallback(() => {
    if (!user) {
      toast.error("Please log in to apply for jobs");
      router.push("/login");
      return;
    }

    if (!isJobSeeker) {
      toast.error("Only job seekers can apply for positions");
      return;
    }

    router.push(`/jobs/${job.id}/apply`);
  }, [user, isJobSeeker, job.id, router]);

  const handleSaveJob = useCallback(() => {
    if (!user) {
      toast.error("Please log in to save jobs");
      router.push("/login");
      return;
    }

    startTransition(async () => {
      try {
        if (isSaved) {
          const { error } = await supabase
            .from("saved_jobs")
            .delete()
            .eq("job_id", job.id)
            .eq("user_id", user.id);

          if (error) throw error;

          setIsSaved(false);
          toast.success("Job removed from saved list");
        } else {
          const { error } = await supabase.from("saved_jobs").insert({
            job_id: job.id,
            user_id: user.id,
          });

          if (error) throw error;

          setIsSaved(true);
          toast.success("Job saved successfully!");
        }
      } catch (error) {
        console.error("Error saving job:", error);
        toast.error("Failed to save job. Please try again.");
      }
    });
  }, [user, isSaved, job.id, router, supabase]);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link
            href="/jobs"
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Jobs
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">{job.title}</span>
        </nav>

        {/* Application Status Banner */}
        {!isOwner && applicationStatus && hasApplied && (
          <div className="mb-6">
            <StatusBanner status={applicationStatus} />
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Job Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardContent className="pt-8 pb-8">
                <JobHeader job={job} />

                <div className="mt-8 pt-8 border-t border-border">
                  <JobActions
                    isOwner={isOwner}
                    hasApplied={hasApplied}
                    isSaved={isSaved}
                    isPending={isPending}
                    userRole={userRole}
                    jobId={job.id}
                    applicationUrl={job.application_url}
                    onApply={handleApply}
                    onSave={handleSaveJob}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="bg-card border-border">
              <CardContent className="pt-8 pb-8">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Job Description
                </h2>
                <div className="prose prose-gray max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Job Details */}
          <div className="space-y-6">
            <JobDetails job={job} />

            {/* Back Link */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.push('/jobs')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}