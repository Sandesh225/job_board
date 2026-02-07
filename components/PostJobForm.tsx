"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createJob } from "@/app/actions/jobActions";
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
  Globe,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// ============================================================================
// 1. ALIGNED Zod Schema & Types
// ============================================================================

const jobFormSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters"),
  company: z.string().min(2, "Company name is required"),
  // UPDATED: Removed "Freelance" to match server requirements
  jobType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  location: z.string().min(2, "Location is required"),
  // UPDATED: Matched server values (using "Manager" instead of Lead/Executive)
  experienceLevel: z.enum(["Entry Level", "Mid-Level", "Senior", "Manager"]),
  salary: z.string().optional(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  applicationUrl: z.string().url("Please enter a valid URL (https://...)"),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

// ============================================================================
// 2. Internal UI Components
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

const Label = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-sm font-medium text-foreground mb-1.5">
    {children} {required && <span className="text-destructive">*</span>}
  </label>
);

const ErrorMsg = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive">
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

  const descriptionLength = watch("description")?.length || 0;
  const isDescriptionValid = descriptionLength >= 50;

  async function onSubmit(data: JobFormValues) {
    startTransition(async () => {
      try {
        const result = await createJob(data);

        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Job posted successfully!");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/dashboard");
          router.refresh();
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormSection
            title="Job Details"
            description="Basic information."
            icon={Briefcase}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label required>Job Title</Label>
                <input
                  {...register("title")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="e.g. Senior Frontend Engineer"
                />
                <ErrorMsg message={errors.title?.message} />
              </div>
              <div className="space-y-1">
                <Label required>Company Name</Label>
                <input
                  {...register("company")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="e.g. Acme Inc."
                />
                <ErrorMsg message={errors.company?.message} />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Logistics"
            description="Scope and pay."
            icon={Globe}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label required>Job Type</Label>
                <select
                  {...register("jobType")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label required>Experience Level</Label>
                <select
                  {...register("experienceLevel")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label required>Location</Label>
                <input
                  {...register("location")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Remote or City"
                />
                <ErrorMsg message={errors.location?.message} />
              </div>

              <div className="space-y-1">
                <Label>Salary Range</Label>
                <input
                  {...register("salary")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="e.g. $100k - $140k"
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Description"
            description="Role details."
            icon={FileText}
          >
            <textarea
              {...register("description")}
              rows={8}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <div className="flex justify-between text-xs mt-2">
              <span
                className={
                  isDescriptionValid
                    ? "text-green-500"
                    : "text-muted-foreground"
                }
              >
                {isDescriptionValid
                  ? "Looks good!"
                  : "Min 50 characters required"}
              </span>
              <span>{descriptionLength} chars</span>
            </div>
            <ErrorMsg message={errors.description?.message} />
          </FormSection>

          <FormSection
            title="How to Apply"
            description="Application link."
            icon={Link2}
          >
            <input
              {...register("applicationUrl")}
              type="url"
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="https://..."
            />
            <ErrorMsg message={errors.applicationUrl?.message} />
          </FormSection>

          <div className="flex items-center justify-end gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Post Job Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}