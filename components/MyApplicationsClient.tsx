"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  FileText,
  Calendar,
  TrendingUp,
  MapPin,
  DollarSign,
  ExternalLink,
  Sparkles,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/card-saas";
import { Input } from "@/components/input-saas";
import { Button } from "@/components/button-saas";

interface Application {
  id: string;
  job_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  jobs: {
    title: string;
    company: string;
    location: string;
    job_type: string;
    experience_level: string;
    salary: string | null;
  };
}

interface MyApplicationsClientProps {
  applications: Application[];
}

const getStatusConfig = (status: string) => {
  const configs: Record<string, any> = {
    accepted: {
      bg: "bg-green-500/10",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-500/20",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    rejected: {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500/20",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
    interviewing: {
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/20",
      icon: <Briefcase className="w-3.5 h-3.5" />,
    },
    shortlisted: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    viewed: {
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/20",
      icon: <Eye className="w-3.5 h-3.5" />,
    },
    pending: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
  };

  return (
    configs[status?.toLowerCase() as keyof typeof configs] || {
      bg: "bg-secondary",
      text: "text-muted-foreground",
      border: "border-border",
      icon: <Clock className="w-3.5 h-3.5" />,
    }
  );
};

const calculateStats = (applications: Application[]) => {
  const totalApplications = applications.length;
  const interviewingCount = applications.filter(
    (a) => a.status === "interviewing",
  ).length;
  const responseRate =
    totalApplications > 0
      ? Math.round(
          (applications.filter((a) => a.status !== "pending").length /
            totalApplications) *
            100,
        )
      : 0;

  return { totalApplications, interviewingCount, responseRate };
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
}) => (
  <Card className="bg-card border-border group hover:shadow-lg transition-all duration-300 overflow-hidden relative">
    <div
      className={`absolute top-0 right-0 w-32 h-32 ${bgColor} rounded-full blur-3xl group-hover:opacity-100 transition-opacity duration-500 opacity-50`}
    />
    <CardContent className="pt-6 pb-6 relative z-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center ring-4 ring-primary/5 group-hover:ring-primary/10 transition-all">
          {Icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ApplicationCard = ({
  application,
  index,
}: {
  application: Application;
  index: number;
}) => {
  const statusConfig = getStatusConfig(application.status);

  return (
    <Card
      className="bg-card border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-bold text-foreground">
                {application.jobs.title}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full uppercase border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
              >
                {statusConfig.icon}
                {application.status}
              </span>
            </div>

            <p className="text-lg font-medium text-muted-foreground">
              {application.jobs.company}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                <Briefcase className="w-3.5 h-3.5" />
                {application.jobs.job_type}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                {application.jobs.experience_level}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-foreground border border-border">
                <MapPin className="w-3.5 h-3.5" />
                {application.jobs.location}
              </span>
              {application.jobs.salary && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                  <DollarSign className="w-3.5 h-3.5" />
                  {application.jobs.salary}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Applied{" "}
              {new Date(application.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() =>
              (window.location.href = `/jobs/${application.job_id}`)
            }
          >
            View Job
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function MyApplicationsClient({
  applications,
}: MyApplicationsClientProps) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.jobs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobs.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || app.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, filterStatus]);

  const stats = useMemo(() => calculateStats(applications), [applications]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                My Applications
              </h1>
              <p className="text-lg text-muted-foreground">
                Track the status of your job applications
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => (window.location.href = "/jobs")}
              className="group"
            >
              <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Browse Jobs
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Applications"
              value={stats.totalApplications}
              bgColor="bg-primary/5"
              icon={<FileText className="w-7 h-7 text-primary" />}
            />
            <StatsCard
              title="Interviews"
              value={stats.interviewingCount}
              bgColor="bg-primary/5"
              icon={<Calendar className="w-7 h-7 text-primary" />}
            />
            <StatsCard
              title="Response Rate"
              value={`${stats.responseRate}%`}
              bgColor="bg-primary/5"
              icon={<TrendingUp className="w-7 h-7 text-primary" />}
            />
          </div>

          {/* Search and Filters */}
          <Card className="bg-card border-border shadow-lg">
            <CardContent className="pt-6 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Search Input */}
                <Input
                  type="text"
                  id="search"
                  label="Search Applications"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by job title or company..."
                  icon={<Search className="w-4 h-4" />}
                />

                {/* Status Filter */}
                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    Filter by Status
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-3">
                    <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <select
                      id="status"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-transparent outline-none border-none text-foreground appearance-none cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="viewed">Viewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-bold text-foreground">
                    {filteredApplications.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">{applications.length}</span>{" "}
                  applications
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card className="bg-card border-border shadow-lg">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No applications found
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {searchTerm
                  ? "Try adjusting your search or filter criteria"
                  : "Start applying to jobs to see them here"}
              </p>
              {!searchTerm && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => (window.location.href = "/jobs")}
                >
                  <Search className="w-5 h-5" />
                  Browse Jobs
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application, index) => (
              <ApplicationCard
                key={application.id}
                application={application}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}