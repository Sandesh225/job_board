"use client";

import React from "react";
import { 
  FileCheck, 
  Eye, 
  Star, 
  Briefcase, 
  CheckCircle2, 
  XCircle,
  Clock,
  TrendingUp
} from "lucide-react";

interface StatusTrackerProps {
  status: string;
  appliedDate: string;
  viewedDate?: string | null;
}

export default function ApplicationStatusTracker({
  status,
  appliedDate,
  viewedDate,
}: StatusTrackerProps) {
  /**
   * Ordered application lifecycle
   * (Rejected is handled as a special terminal state)
   */
  const statuses = [
    { 
      key: "pending", 
      label: "Applied", 
      icon: FileCheck,
      color: "blue",
      bgColor: "bg-blue-500",
      ringColor: "ring-blue-500/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    { 
      key: "viewed", 
      label: "Viewed", 
      icon: Eye,
      color: "purple",
      bgColor: "bg-purple-500",
      ringColor: "ring-purple-500/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    { 
      key: "shortlisted", 
      label: "Shortlisted", 
      icon: Star,
      color: "amber",
      bgColor: "bg-amber-500",
      ringColor: "ring-amber-500/20",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    { 
      key: "interviewing", 
      label: "Interview", 
      icon: Briefcase,
      color: "indigo",
      bgColor: "bg-indigo-500",
      ringColor: "ring-indigo-500/20",
      textColor: "text-indigo-600 dark:text-indigo-400"
    },
    { 
      key: "accepted", 
      label: "Accepted", 
      icon: CheckCircle2,
      color: "green",
      bgColor: "bg-green-500",
      ringColor: "ring-green-500/20",
      textColor: "text-green-600 dark:text-green-400"
    },
    { 
      key: "rejected", 
      label: "Rejected", 
      icon: XCircle,
      color: "red",
      bgColor: "bg-red-500",
      ringColor: "ring-red-500/20",
      textColor: "text-red-600 dark:text-red-400"
    },
  ];

  /** Resolve current progress index safely */
  const currentIndex = Math.max(
    0,
    statuses.findIndex((s) => s.key === status)
  );

  const isRejected = status === "rejected";

  /** Progress width (avoid division by zero) */
  const progressWidth = (currentIndex / Math.max(statuses.length - 1, 1)) * 100;

  return (
    <div
      className="relative rounded-2xl border border-border bg-gradient-to-br from-background to-secondary/30 backdrop-blur-sm p-6 sm:p-8 shadow-lg overflow-hidden"
      aria-live="polite"
    >
      {/* Decorative background gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -z-10" />
      
      {/* ================= Title ================= */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Application Progress
          </h3>
          <p className="text-sm text-muted-foreground">
            Track your application journey
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Applied {new Date(appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* ================= Progress Tracker ================= */}
      <div className="relative mb-8">
        {/* Base line */}
        <div className="absolute top-6 left-0 h-1 w-full rounded-full bg-secondary/50" />

        {/* Active progress line with gradient */}
        <div
          className={`absolute top-6 left-0 h-1 rounded-full transition-all duration-700 ease-out
            ${isRejected 
              ? "bg-gradient-to-r from-blue-500 to-red-500" 
              : "bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
            }`}
          style={{ width: `${progressWidth}%` }}
        />

        {/* Animated glow on progress line */}
        <div
          className={`absolute top-6 left-0 h-1 rounded-full transition-all duration-700 blur-sm
            ${isRejected 
              ? "bg-gradient-to-r from-blue-500/50 to-red-500/50" 
              : "bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-green-500/50"
            }`}
          style={{ width: `${progressWidth}%` }}
        />

        {/* ================= Status Nodes ================= */}
        <div className="relative flex justify-between">
          {statuses.map((s, idx) => {
            /**
             * Rejection logic:
             * - Normal flow hides "rejected"
             * - Rejected flow only shows Applied → Rejected
             */
            if (!isRejected && s.key === "rejected") return null;
            if (isRejected && !["pending", "rejected"].includes(s.key))
              return null;

            const isActive = idx <= currentIndex;
            const isCurrent = s.key === status;
            const StatusIcon = s.icon;

            return (
              <div
                key={s.key}
                className="flex flex-col items-center text-center relative group"
              >
                {/* Status Circle */}
                <div
                  className={`relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full
                    transition-all duration-500
                    ${
                      isCurrent
                        ? `scale-110 ${s.bgColor} ring-4 ${s.ringColor} shadow-lg shadow-${s.color}-500/25`
                        : isActive
                        ? `${s.bgColor} shadow-md`
                        : "bg-secondary border-2 border-border"
                    }
                    ${isCurrent ? "animate-pulse" : ""}
                    group-hover:scale-105`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <StatusIcon 
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors
                      ${isActive ? "text-white" : "text-muted-foreground"}
                    `}
                  />
                  
                  {/* Pulse ring for current status */}
                  {isCurrent && (
                    <div className={`absolute inset-0 rounded-full ${s.bgColor} animate-ping opacity-20`} />
                  )}
                </div>

                {/* Status Label */}
                <span
                  className={`mt-3 text-xs sm:text-sm font-semibold transition-colors
                    ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                >
                  {s.label}
                </span>

                {/* Meta Info */}
                {isCurrent && (
                  <span className={`mt-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full
                    ${s.key === "pending" 
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                      : `bg-${s.color}-500/10 ${s.textColor}`
                    }`}
                  >
                    {s.key === "pending"
                      ? new Date(appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : "Current"}
                  </span>
                )}

                {/* Connecting line indicator */}
                {isActive && idx < currentIndex && !isRejected && (
                  <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent to-transparent opacity-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= Status Message ================= */}
      <div className={`rounded-xl p-4 sm:p-5 border transition-all duration-300
        ${status === "accepted" 
          ? "bg-green-500/10 border-green-500/30" 
          : status === "rejected"
          ? "bg-red-500/10 border-red-500/30"
          : status === "interviewing"
          ? "bg-indigo-500/10 border-indigo-500/30"
          : "bg-secondary/50 border-border"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
            ${status === "accepted" 
              ? "bg-green-500/20" 
              : status === "rejected"
              ? "bg-red-500/20"
              : status === "interviewing"
              ? "bg-indigo-500/20"
              : "bg-primary/20"
            }`}
          >
            {status === "pending" && <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            {status === "viewed" && <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
            {status === "shortlisted" && <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            {status === "interviewing" && <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
            {status === "accepted" && <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />}
            {status === "rejected" && <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
          </div>
          
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {status === "pending" && "⏳ Your application has been submitted"}
              {status === "viewed" && "👀 Employer has viewed your application"}
              {status === "shortlisted" && "⭐ You've been shortlisted!"}
              {status === "interviewing" && "💼 Interview in progress or scheduled"}
              {status === "accepted" && "🎉 Congratulations! You got the job"}
              {status === "rejected" &&
                "😔 Unfortunately, you weren't selected this time"}
            </p>

            {/* Last updated info */}
            {viewedDate && status !== "pending" && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Last updated: {new Date(viewedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}