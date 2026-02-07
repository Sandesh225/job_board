"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Trash2, 
  ExternalLink, 
  Clock,
  BookmarkX
} from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // Optional: npm install date-fns

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  job_type: string;
  created_at: string;
}

interface SavedJob {
  id: string; // The ID of the saved_jobs row
  job: Job;   // The joined job data
}

interface SavedJobsClientProps {
  initialSavedJobs: SavedJob[];
}

export default function SavedJobsClient({ initialSavedJobs }: SavedJobsClientProps) {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(initialSavedJobs);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleRemove = async (savedJobId: string) => {
    setIsLoading(savedJobId);
    
    try {
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("id", savedJobId);

      if (error) throw error;

      // Optimistic update
      setSavedJobs((prev) => prev.filter((item) => item.id !== savedJobId));
      toast.success("Job removed from saved list");
      router.refresh(); // Refresh server data in background
    } catch (error) {
      console.error("Error removing job:", error);
      toast.error("Failed to remove job");
    } finally {
      setIsLoading(null);
    }
  };

  if (savedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 border border-dashed border-border rounded-xl bg-card/50">
        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
          <BookmarkX className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Saved Jobs Yet</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          You haven't saved any jobs yet. Browse our job listings to find your next career opportunity.
        </p>
        <Link 
          href="/jobs"
          className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedJobs.map(({ id, job }) => (
        <div 
          key={id} 
          className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20"
        >
          <div className="p-6 flex-grow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-muted-foreground font-medium text-sm">
                  {job.company}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-primary font-bold text-sm">
                {job.company.charAt(0)}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 shrink-0 opacity-70" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4 mr-2 shrink-0 opacity-70" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4 mr-2 shrink-0 opacity-70" />
                <span className="capitalize">{job.job_type.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2 shrink-0 opacity-70" />
                {/* Fallback if date-fns isn't installed: new Date(job.created_at).toLocaleDateString() */}
                <span>Posted {formatDistanceToNow(new Date(job.created_at))} ago</span>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="p-4 bg-secondary/30 border-t border-border flex items-center justify-between gap-3">
            <button
              onClick={() => handleRemove(id)}
              disabled={isLoading === id}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all disabled:opacity-50"
              title="Remove from saved"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Remove</span>
            </button>
            
            <Link
              href={`/jobs/${job.id}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all shadow-sm"
            >
              <span>View Details</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}