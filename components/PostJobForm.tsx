"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { jobFormSchema, JobFormValues } from "@/lib/validators";
import { createJob } from "@/app/actions/jobActions";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import SaasButton from "@/components/button-saas";
import { Card, CardContent, CardHeader } from "@/components/card-saas";
import { labelClass, inputClass, errorClass } from "@/components/styles"; // Declare or import the missing variables

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
          router.push("/dashboard"); // Redirect to dashboard on success
          router.refresh();
        } else {
          toast.error(response.error || "Failed to post job");
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 pt-20 pb-12">
      <section className="mx-auto max-w-3xl">
        <div className="mb-10 pb-8">
          <h1 className="h2 text-foreground">Create Job Listing</h1>
          <p className="text-muted-foreground text-base mt-3">
            Provide the details for your open position to start receiving
            applications.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <h3 className="h5 text-foreground">Basic Information</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-semibold text-foreground"
                  >
                    Job Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    id="title"
                    className="input-base input-focus w-full"
                    placeholder="e.g. Senior Product Designer"
                  />
                  {errors.title && (
                    <p className="mt-1.5 text-xs text-destructive font-medium">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block mb-2 text-sm font-semibold text-foreground"
                  >
                    Company Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register("company")}
                    type="text"
                    id="company"
                    className="input-base input-focus w-full"
                    placeholder="e.g. Acme Corp"
                  />
                  {errors.company && (
                    <p className="mt-1.5 text-xs text-destructive font-medium">
                      {errors.company.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classification & Details Card */}
          <Card>
            <CardHeader>
              <h3 className="h5 text-foreground">Job Details</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="jobType"
                    className="block mb-2 text-sm font-semibold text-foreground"
                  >
                    Job Type <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register("jobType")}
                    id="jobType"
                    className="input-base input-focus w-full"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="experienceLevel"
                    className="block mb-2 text-sm font-semibold text-foreground"
                  >
                    Experience Level <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register("experienceLevel")}
                    id="experienceLevel"
                    className="input-base input-focus w-full"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead/Manager">Lead/Manager</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="location"
                    className="block mb-2 text-sm font-semibold text-foreground"
                  >
                    Location <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register("location")}
                    type="text"
                    id="location"
                    className="input-base input-focus w-full"
                    placeholder="e.g. Remote / New York"
                  />
                  {errors.location && (
                    <p className="mt-1.5 text-xs text-destructive font-medium">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="salary"
                    className="block mb-2 text-sm font-semibold text-foreground"
                  >
                    Salary Range (Optional)
                  </label>
                  <input
                    {...register("salary")}
                    type="text"
                    id="salary"
                    className="input-base input-focus w-full"
                    placeholder="e.g. $120k - $150k"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card>
            <CardHeader>
              <h3 className="h5 text-foreground">Job Description</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-semibold text-foreground"
                >
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  {...register("description")}
                  id="description"
                  rows={8}
                  className="w-full px-4 py-3 rounded-md border border-input bg-input text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Outline the responsibilities, requirements, and benefits..."
                />
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    Markdown supported for formatting.
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {watch("description")?.length || 0} characters
                  </p>
                </div>
                {errors.description && (
                  <p className="mt-1.5 text-xs text-destructive font-medium">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Link Card */}
          <Card>
            <CardHeader>
              <h3 className="h5 text-foreground">Application Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="applicationUrl"
                  className="block mb-2 text-sm font-semibold text-foreground"
                >
                  Application Link <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("applicationUrl")}
                  type="url"
                  id="applicationUrl"
                  className="input-base input-focus w-full"
                  placeholder="https://company.com/jobs/apply"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Where should candidates go to apply for this position?
                </p>
                {errors.applicationUrl && (
                  <p className="mt-1.5 text-xs text-destructive font-medium">
                    {errors.applicationUrl.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
            <SaasButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={isPending}
              className="gap-2 flex-1 justify-center"
            >
              {isPending && <Loader className="w-4 h-4 animate-spin" />}
              {isPending ? "Publishing..." : "Publish Vacancy"}
            </SaasButton>

            <SaasButton
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 justify-center"
              onClick={() => router.back()}
            >
              Cancel
            </SaasButton>
          </div>
        </form>
      </section>
    </div>
  );
}
