"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { jobFormSchema, JobFormValues } from "@/lib/validators";
import { createJob } from "@/app/actions/jobActions";
import { useRouter } from "next/navigation";

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

  // Consistent Styling
  const inputClass =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-shadow shadow-sm";
  const labelClass =
    "block mb-2 text-sm font-semibold text-gray-900 dark:text-white";
  const errorClass =
    "mt-1.5 text-xs text-red-600 font-medium dark:text-red-400";

  return (
    /* FIX: Added pt-24 to clear the fixed header.
       FIX: max-w-4xl for a comfortable reading measure on large screens.
    */
    <div className="mx-auto max-w-screen-xl px-4 pt-2 pb-2">
      <section className="mx-auto max-w-3xl">
        <div className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Job Listing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base mt-2">
            Provide the details for your open position to start receiving
            applications.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="col-span-1">
              <label htmlFor="title" className={labelClass}>
                Job Title
              </label>
              <input
                {...register("title")}
                type="text"
                id="title"
                className={inputClass}
                placeholder="e.g. Senior Product Designer"
              />
              {errors.title && (
                <p className={errorClass}>{errors.title.message}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="company" className={labelClass}>
                Company Name
              </label>
              <input
                {...register("company")}
                type="text"
                id="company"
                className={inputClass}
                placeholder="e.g. Acme Corp"
              />
              {errors.company && (
                <p className={errorClass}>{errors.company.message}</p>
              )}
            </div>
          </div>

          {/* Section 2: Classification */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="jobType" className={labelClass}>
                Job Type
              </label>
              <select
                {...register("jobType")}
                id="jobType"
                className={inputClass}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label htmlFor="experienceLevel" className={labelClass}>
                Experience Level
              </label>
              <select
                {...register("experienceLevel")}
                id="experienceLevel"
                className={inputClass}
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead/Manager">Lead/Manager</option>
              </select>
            </div>
          </div>

          {/* Section 3: Compensation & Location */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <input
                {...register("location")}
                type="text"
                id="location"
                className={inputClass}
                placeholder="e.g. Remote / New York"
              />
              {errors.location && (
                <p className={errorClass}>{errors.location.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="salary" className={labelClass}>
                Salary Range (Optional)
              </label>
              <input
                {...register("salary")}
                type="text"
                id="salary"
                className={inputClass}
                placeholder="e.g. $120k - $150k"
              />
            </div>
          </div>

          {/* Section 4: Details */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Job Description
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={8}
              className={`${inputClass} resize-none font-sans`}
              placeholder="Outline the responsibilities, requirements, and benefits..."
            ></textarea>
            <div className="flex justify-between mt-2 px-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                Markdown supported for formatting.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                {watch("description")?.length || 0} characters
              </p>
            </div>
            {errors.description && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="salary"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Salary (Optional)
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              placeholder="e.g., $50,000 - $80,000, $25/hr, Competitive"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Examples: "$50k-80k/year", "$25-35/hour", "Competitive", or leave
              blank
            </p>
          </div>
          {/* Section 5: External Link */}
          <div className="bg-primary-50/50 dark:bg-primary-900/10 p-6 rounded-xl border border-primary-100 dark:border-primary-800">
            <label htmlFor="applicationUrl" className={labelClass}>
              Application Link
            </label>
            <input
              {...register("applicationUrl")}
              type="url"
              id="applicationUrl"
              className={inputClass}
              placeholder="https://company.com/jobs/apply"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Where should candidates go to apply for this position?
            </p>
            {errors.applicationUrl && (
              <p className={errorClass}>{errors.applicationUrl.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 shadow-md font-bold rounded-lg text-sm px-10 py-3.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? "Publishing listing..." : "Publish Vacancy"}
            </button>

            <button
              type="button"
              className="w-full sm:w-auto text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-lg text-sm px-8 py-3.5 transition-colors"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}