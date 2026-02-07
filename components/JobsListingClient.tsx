"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/input-saas";
import { Card, CardContent } from "@/components/card-saas";

interface Job {
  id: string;
  title: string;
  company: string;
  job_type: string;
  location: string;
  experience_level: string;
  salary: string | null;
  description: string;
  created_at: string;
}

interface JobsListingClientProps {
  initialJobs: Job[];
}

export default function JobsListingClient({
  initialJobs,
}: JobsListingClientProps) {
  const [jobs] = useState<Job[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "All" || job.job_type === filterType;
      const matchesLevel =
        filterLevel === "All" || job.experience_level === filterLevel;
      return matchesSearch && matchesType && matchesLevel;
    });
  }, [jobs, searchTerm, filterType, filterLevel]);

  const timeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInDays = Math.floor(
      (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse {jobs.length} available positions
          </p>
        </div>

        {/* Filters Card */}
        <Card className="bg-card border-border shadow-lg mb-8">
          <CardContent className="pt-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div className="md:col-span-1">
                <Input
                  type="text"
                  id="search"
                  label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Job title, company, location..."
                  icon={<Search className="w-4 h-4" />}
                />
              </div>

              {/* Job Type Filter */}
              <div className="space-y-2">
                <label
                  htmlFor="jobType"
                  className="block text-sm font-semibold text-foreground"
                >
                  Job Type
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <select
                    id="jobType"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-transparent outline-none border-none text-foreground appearance-none cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Experience Level Filter */}
              <div className="space-y-2">
                <label
                  htmlFor="experienceLevel"
                  className="block text-sm font-semibold text-foreground"
                >
                  Experience Level
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-3">
                  <Sparkles className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <select
                    id="experienceLevel"
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="w-full bg-transparent outline-none border-none text-foreground appearance-none cursor-pointer"
                  >
                    <option value="All">All Levels</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead/Manager">Lead/Manager</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {filteredJobs.length}
                </span>{" "}
                of {jobs.length} jobs
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <Card className="bg-card border-border shadow-lg">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No jobs found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block group"
              >
                <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {job.title}
                          </h2>
                          <p className="text-lg font-medium text-muted-foreground">
                            {job.company}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            <Briefcase className="w-3.5 h-3.5" />
                            {job.job_type}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            {job.experience_level}
                          </span>
                          {job.salary && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                              <DollarSign className="w-3.5 h-3.5" />
                              {job.salary}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {timeAgo(job.created_at)}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {job.description}
                        </p>
                      </div>

                      <div className="flex-shrink-0 group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
