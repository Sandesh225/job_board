// components/ApplicationStatusTracker.tsx
"use client";

import React from "react";

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
    { key: "pending", label: "Applied", icon: "📝" },
    { key: "viewed", label: "Viewed", icon: "👀" },
    { key: "shortlisted", label: "Shortlisted", icon: "⭐" },
    { key: "interviewing", label: "Interview", icon: "💼" },
    { key: "accepted", label: "Accepted", icon: "✅" },
    { key: "rejected", label: "Rejected", icon: "❌" },
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
      className="rounded-lg border border-gray-200 bg-white p-6
                 dark:border-gray-700 dark:bg-gray-800"
      aria-live="polite"
    >
      {/* ================= Title ================= */}
      <h3 className="mb-5 text-sm font-semibold text-gray-900 dark:text-white">
        Application Progress
      </h3>

      {/* ================= Progress Tracker ================= */}
      <div className="relative">
        {/* Base line */}
        <div className="absolute top-5 left-0 h-0.5 w-full bg-gray-200 dark:bg-gray-700" />

        {/* Active progress line */}
        <div
          className={`absolute top-5 left-0 h-0.5 transition-all duration-500
            ${isRejected ? "bg-red-500" : "bg-green-500"}`}
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

            return (
              <div
                key={s.key}
                className="flex flex-col items-center text-center"
              >
                {/* Status Circle */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-lg
                    transition-all duration-300
                    ${
                      isCurrent
                        ? "scale-110 bg-primary-600 ring-4 ring-primary-100 dark:ring-primary-900"
                        : isActive
                        ? isRejected && s.key === "rejected"
                          ? "bg-red-500"
                          : "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {s.icon}
                </div>

                {/* Status Label */}
                <span
                  className={`mt-2 text-xs font-medium
                    ${
                      isActive
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400"
                    }`}
                >
                  {s.label}
                </span>

                {/* Meta Info */}
                {isCurrent && (
                  <span className="mt-1 text-[10px] text-gray-500">
                    {s.key === "pending"
                      ? new Date(appliedDate).toLocaleDateString()
                      : "Current"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= Status Message ================= */}
      <div className="mt-6 rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {status === "pending" && "⏳ Your application has been submitted"}
          {status === "viewed" && "👀 Employer has viewed your application"}
          {status === "shortlisted" && "⭐ You’ve been shortlisted!"}
          {status === "interviewing" && "💼 Interview in progress or scheduled"}
          {status === "accepted" && "🎉 Congratulations! You got the job"}
          {status === "rejected" &&
            "😔 Unfortunately, you weren’t selected this time"}
        </p>

        {/* Last updated info */}
        {viewedDate && status !== "pending" && (
          <p className="mt-1 text-xs text-gray-500">
            Last updated: {new Date(viewedDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
