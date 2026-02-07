// components/ApplicationStatusTracker.tsx
"use client";

import React from "react";
import { CheckCircle, Clock, AlertCircle, Briefcase, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "./card-saas";

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
  const statuses = [
    { key: "pending", label: "Applied", icon: Clock },
    { key: "viewed", label: "Viewed", icon: CheckCircle },
    { key: "shortlisted", label: "Shortlisted", icon: CheckCircle },
    { key: "interviewing", label: "Interview", icon: Briefcase },
    { key: "accepted", label: "Accepted", icon: CheckCircle },
    { key: "rejected", label: "Rejected", icon: X },
  ];

  const currentIndex = Math.max(
    0,
    statuses.findIndex((s) => s.key === status),
  );

  const isRejected = status === "rejected";
  const progressWidth = (currentIndex / Math.max(statuses.length - 1, 1)) * 100;

  return (
    <Card aria-live="polite">
      <CardHeader>
        <h3 className="h5 text-foreground">Application Progress</h3>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Progress Tracker */}
        <div className="relative">
          <div className="absolute top-5 left-0 h-0.5 w-full bg-border" />
          <div
            className={`absolute top-5 left-0 h-0.5 transition-all duration-500
              ${isRejected ? "bg-destructive" : "bg-success"}`}
            style={{ width: `${progressWidth}%` }}
          />

          <div className="relative flex justify-between">
            {statuses.map((s, idx) => {
              if (!isRejected && s.key === "rejected") return null;
              if (isRejected && !["pending", "rejected"].includes(s.key))
                return null;

              const isActive = idx <= currentIndex;
              const isCurrent = s.key === status;
              const Icon = s.icon;

              return (
                <div
                  key={s.key}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300
                      ${
                        isCurrent
                          ? `scale-110 ${isRejected ? "bg-destructive" : "bg-primary"} ring-4 ring-primary/20`
                          : isActive
                            ? isRejected && s.key === "rejected"
                              ? "bg-destructive"
                              : "bg-success"
                            : "bg-muted"
                      }`}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <Icon
                      className={`w-5 h-5 ${isCurrent ? "text-primary-foreground" : "text-foreground"}`}
                    />
                  </div>

                  <span
                    className={`mt-2 text-xs font-medium
                      ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {s.label}
                  </span>

                  {isCurrent && (
                    <span className="mt-1 text-[10px] text-muted-foreground">
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

        {/* Status Message */}
        <div className="rounded-lg bg-secondary p-4">
          <p className="text-sm text-foreground font-medium">
            {status === "pending" && "Your application has been submitted"}
            {status === "viewed" && "Employer has viewed your application"}
            {status === "shortlisted" && "You've been shortlisted!"}
            {status === "interviewing" && "Interview in progress or scheduled"}
            {status === "accepted" && "Congratulations! You got the job"}
            {status === "rejected" &&
              "Unfortunately, you weren't selected this time"}
          </p>

          {viewedDate && status !== "pending" && (
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated: {new Date(viewedDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
