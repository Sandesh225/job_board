"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { jobFormSchema, JobFormValues } from "@/lib/validators";
import { createJob } from "@/app/actions/jobActions";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/card-saas";

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

  async function onSubmit(data: JobFormValues) {
    startTransition(async () => {
      try {
        const response = await createJob(data);
        if (response.success) {
          toast.success("Job posted successfully!");
          router.push("/dashboard");
          router.refresh();
        } else {
          toast.error(response.error || "Failed to post job");
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
      }
    });
  }

  const descriptionLength = watch("description")?.length || 0;
  const MIN_DESCRIPTION_LENGTH = 50;
  const isDescriptionValid = descriptionLength >= MIN_DESCRIPTION_LENGTH;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-semibold text-primary mb-6">
            <Briefcase className="w-4 h-4" />
            New Job Posting
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
            Create Job Listing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Provide the details for your open position to start receiving
            applications from qualified candidates.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Basic Information */}
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Basic Information
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Essential details about the position
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Job Title */}
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    Job Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    id="title"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.title
                        ? "border-destructive focus:ring-destructive/50"
                        : "border-border focus:ring-primary/50"
                    } bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:border-primary outline-none transition-all`}
                    placeholder="e.g. Senior Product Designer"
                  />
                  {errors.title && (
                    <p className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="company"
                    className="block text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    Company Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register("company")}
                    type="text"
                    id="company"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.company
                        ? "border-destructive focus:ring-destructive/50"
                        : "border-border focus:ring-primary/50"
                    } bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:border-primary outline-none transition-all`}
                    placeholder="e.g. Acme Corp"
                  />
                  {errors.company && (
                    <p className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.company.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Job Classification */}
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Job Classification
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Type and experience requirements
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Job Type */}
                <div className="space-y-2">
                  <label
                    htmlFor="jobType"
                    className="block text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Job Type <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register("jobType")}
                    id="jobType"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <label
                    htmlFor="experienceLevel"
                    className="block text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                    Experience Level <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register("experienceLevel")}
                    id="experienceLevel"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead/Manager">Lead/Manager</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Location & Compensation */}
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Location & Compensation
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Where and how much
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Location */}
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Location <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register("location")}
                    type="text"
                    id="location"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.location
                        ? "border-destructive focus:ring-destructive/50"
                        : "border-border focus:ring-primary/50"
                    } bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:border-primary outline-none transition-all`}
                    placeholder="e.g. Remote / New York, NY"
                  />
                  {errors.location && (
                    <p className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Salary */}
                <div className="space-y-2">
                  <label
                    htmlFor="salary"
                    className="block text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    Salary Range{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    {...register("salary")}
                    type="text"
                    id="salary"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    placeholder="e.g. $120k - $150k"
                  />
                  <p className="text-xs text-muted-foreground">
                    Examples: "$50k-80k/year", "$25-35/hour", "Competitive"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Job Description */}
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Job Description
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Detailed information about the role
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 space-y-3">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-foreground flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Description <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {isDescriptionValid ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isDescriptionValid
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    {descriptionLength} / {MIN_DESCRIPTION_LENGTH} chars
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isDescriptionValid ? "bg-primary" : "bg-destructive"
                  }`}
                  style={{
                    width: `${Math.min(
                      (descriptionLength / MIN_DESCRIPTION_LENGTH) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>

              <textarea
                {...register("description")}
                id="description"
                rows={10}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.description
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-border focus:ring-primary/50"
                } bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:border-primary outline-none transition-all resize-none`}
                placeholder="Outline the responsibilities, requirements, qualifications, and benefits of this position..."
              />

              <div className="flex justify-between items-center px-1">
                <p className="text-xs text-muted-foreground italic">
                  💡 Markdown supported for formatting
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {descriptionLength} characters
                </p>
              </div>

              {errors.description && (
                <p className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Section 5: Application Link */}
          <Card className="bg-primary/5 border-primary/20 overflow-hidden">
            <CardHeader className="border-b border-primary/20 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/30">
                  <Link2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Application Link
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Where candidates should apply
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 space-y-2">
              <label
                htmlFor="applicationUrl"
                className="block text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <Link2 className="w-4 h-4 text-muted-foreground" />
                Application URL <span className="text-destructive">*</span>
              </label>
              <input
                {...register("applicationUrl")}
                type="url"
                id="applicationUrl"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.applicationUrl
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-primary/30 focus:ring-primary/50"
                } bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:border-primary outline-none transition-all`}
                placeholder="https://company.com/jobs/apply"
              />
              <p className="text-xs text-muted-foreground px-1">
                Where should candidates go to apply for this position?
              </p>
              {errors.applicationUrl && (
                <p className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.applicationUrl.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-xl font-bold transition-all duration-200 hover:scale-[1.02]"
            >
              <ArrowLeft className="w-5 h-5" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-10 py-3.5 text-primary-foreground bg-primary hover:bg-primary/90 disabled:from-muted disabled:to-muted disabled:cursor-not-allowed disabled:shadow-none rounded-xl font-bold transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing listing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publish Job Listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
