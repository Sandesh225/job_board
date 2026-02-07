"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"; // specific import for schema
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createJob } from "@/app/actions/jobActions"; // Assumed existing action
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Link2,
  Send,
  ArrowLeft,
  Loader2,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Globe,
} from "lucide-react";

// ============================================================================
// 1. Zod Schema & Types (Defined locally for portability)
// ============================================================================

const jobFormSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters"),
  company: z.string().min(2, "Company name is required"),
  jobType: z.enum(["Full-time", "Part-time", "Contract", "Internship", "Freelance"]),
  location: z.string().min(2, "Location is required"),
  experienceLevel: z.enum(["Entry Level", "Mid-Level", "Senior", "Lead", "Executive"]),
  salary: z.string().optional(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  applicationUrl: z.string().url("Please enter a valid URL (https://...)"),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

// ============================================================================
// 2. Internal UI Components (Replaces external dependencies)
// ============================================================================

const FormSection = ({ title, description, icon: Icon, children }: any) => (
  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
    <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-sm font-medium text-foreground mb-1.5">
    {children} {required && <span className="text-destructive">*</span>}
  </label>
);

const ErrorMsg = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive animate-in slide-in-from-top-1">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
};

// ============================================================================
// 3. Main Component
// ============================================================================

export default function PostJobForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      company: "",
      jobType: "Full-time",
      location: "",
      experienceLevel: "Senior",
      salary: "",
      description: "",
      applicationUrl: "",
    },
  });

  // Watch description for character count
  const descriptionLength = watch("description")?.length || 0;
  const MIN_DESCRIPTION_LENGTH = 50;
  const isDescriptionValid = descriptionLength >= MIN_DESCRIPTION_LENGTH;

  async function onSubmit(data: JobFormValues) {
    startTransition(async () => {
      try {
        const result = await createJob(data);

        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Job posted successfully!");
          // Wait a moment for toast to be readable before redirect
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/dashboard");
          router.refresh();
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 animate-in fade-in duration-500">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
            <button 
                onClick={() => router.back()} 
                className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Post a New Job</h1>
            <p className="mt-2 text-muted-foreground">
                Reach thousands of qualified candidates. Fill out the details below to get started.
            </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Core Info */}
          <FormSection
            title="Job Details"
            description="Basic information about the role and company."
            icon={Briefcase}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label required>Job Title</Label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                    {...register("title")}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="e.g. Senior Frontend Engineer"
                    />
                </div>
                <ErrorMsg message={errors.title?.message} />
              </div>

              <div className="space-y-1">
                <Label required>Company Name</Label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                    {...register("company")}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="e.g. Acme Inc."
                    />
                </div>
                <ErrorMsg message={errors.company?.message} />
              </div>
            </div>
          </FormSection>

          {/* Section 2: Logistics */}
          <FormSection
            title="Logistics & Compensation"
            description="Define the scope, location, and pay range."
            icon={Globe}
          >
             <div className="grid gap-6 md:grid-cols-2">
                
                {/* Job Type */}
                <div className="space-y-1">
                    <Label required>Job Type</Label>
                    <div className="relative">
                        <select
                            {...register("jobType")}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                </div>

                {/* Experience */}
                <div className="space-y-1">
                    <Label required>Experience Level</Label>
                    <div className="relative">
                        <select
                            {...register("experienceLevel")}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="Entry Level">Entry Level</option>
                            <option value="Mid-Level">Mid-Level</option>
                            <option value="Senior">Senior</option>
                            <option value="Lead">Lead</option>
                            <option value="Executive">Executive</option>
                        </select>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-1">
                    <Label required>Location</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                        {...register("location")}
                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="e.g. Remote, or New York, NY"
                        />
                    </div>
                    <ErrorMsg message={errors.location?.message} />
                </div>

                 {/* Salary */}
                 <div className="space-y-1">
                    <Label>Salary Range <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                        {...register("salary")}
                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="e.g. $100k - $140k"
                        />
                    </div>
                </div>

             </div>
          </FormSection>

          {/* Section 3: Description */}
          <FormSection
            title="Description"
            description="What will this person do? Be detailed."
            icon={FileText}
          >
            <div className="space-y-3">
                <div className="relative">
                    <textarea
                        {...register("description")}
                        rows={10}
                        className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                        placeholder="Describe the role, responsibilities, and requirements..."
                    />
                </div>
                
                {/* Character Counter & Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className={`flex items-center gap-1.5 font-medium ${isDescriptionValid ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                            {isDescriptionValid ? (
                                <> <CheckCircle2 className="h-3 w-3" /> Description looks good</>
                            ) : (
                                <>Minimum 50 characters required</>
                            )}
                        </span>
                        <span className="text-muted-foreground">{descriptionLength} chars</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ease-out ${isDescriptionValid ? "bg-green-500" : "bg-primary"}`}
                            style={{ width: `${Math.min((descriptionLength / MIN_DESCRIPTION_LENGTH) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                <ErrorMsg message={errors.description?.message} />
            </div>
          </FormSection>

          {/* Section 4: Application URL */}
          <FormSection
            title="How to Apply"
            description="Where should we send candidates?"
            icon={Link2}
          >
            <div className="space-y-1">
                <Label required>Application URL</Label>
                <div className="relative">
                    <Link2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                    {...register("applicationUrl")}
                    type="url"
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="https://company.com/careers/apply/123"
                    />
                </div>
                <ErrorMsg message={errors.applicationUrl?.message} />
            </div>
          </FormSection>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting Job...
                    </>
                ) : (
                    <>
                        Post Job Listing
                        <Send className="ml-2 h-4 w-4" />
                    </>
                )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}