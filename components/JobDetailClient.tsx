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

type ApplicationStatus = "accepted" | "rejected" | "pending";

interface StatusConfig {
  bg: string;
  text: string;
  icon: React.ReactNode;
  message: string;
}

// ============================================================================
// Constants
// ============================================================================

const STATUS_CONFIGS: Record<ApplicationStatus, StatusConfig> = {
  accepted: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-800 dark:text-green-300",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    message: "Congratulations! Your application has been accepted.",
  },
  rejected: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-800 dark:text-red-300",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    message: "Unfortunately, your application was not successful this time.",
  },
  pending: {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-800 dark:text-blue-300",
    icon: (
      <svg
        className="h-5 w-5 animate-spin"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    message: "Your application is under review.",
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
    <div className={`rounded-lg border p-4 ${config.bg} ${config.text}`}>
      <div className="flex items-center gap-3">
        {config.icon}
        <div>
          <p className="font-semibold">
            Application Status: {capitalizeFirst(status)}
          </p>
          <p className="text-sm opacity-90">{config.message}</p>
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
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {job.title}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span className="font-medium">{job.company}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
          {job.job_type}
        </span>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
          {job.experience_level}
        </span>
        {job.salary && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            {job.salary}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
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
        <Link
          href={`/jobs/${jobId}/applicants`}
          className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          View Applicants
        </Link>
        <Link
          href={`/jobs/${jobId}/edit`}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          Edit Job
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userRole === "job-seeker" && (
        <button
          onClick={onSave}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 sm:w-auto"
        >
          <svg
            className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          {isSaved ? "Saved" : "Save Job"}
        </button>
      )}

      <div className="flex flex-wrap gap-3">
        {hasApplied ? (
          <button
            disabled
            className="rounded-lg bg-gray-400 px-6 py-3 font-semibold text-white cursor-not-allowed"
          >
            ✓ Already Applied
          </button>
        ) : (
          <button
            onClick={onApply}
            className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Apply Now
          </button>
        )}

        <a
          href={applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          Apply on Company Site →
        </a>
      </div>
    </div>
  );
};

interface JobDetailsProps {
  job: Job;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  const details = [
    { label: "Job Type", value: job.job_type },
    { label: "Experience Level", value: job.experience_level },
    { label: "Location", value: job.location },
    ...(job.salary ? [{ label: "Salary Range", value: job.salary }] : []),
    { label: "Posted", value: formatDate(job.created_at) },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Job Details
      </h2>
      <dl className="space-y-4">
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt className="mb-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
              {label}
            </dt>
            <dd className="text-base text-gray-900 dark:text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link
            href="/jobs"
            className="hover:text-primary-600 dark:hover:text-primary-400"
          >
            Jobs
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{job.title}</span>
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
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <JobHeader job={job} />

              <div className="mt-6">
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
            </div>

            {/* Job Description */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Job Description
              </h2>
              <div className="prose prose-gray max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {job.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Job Details */}
          <div className="space-y-6">
            <JobDetails job={job} />

            {/* Back Link */}
            <Link
              href="/jobs"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              ← Back to all jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}