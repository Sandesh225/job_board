"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { jobFormSchema, JobFormValues } from "@/lib/validators";
import { createJob } from "@/app/actions/jobActions";

export default function PostJobForm() {
  const [isPending, startTransition] = useTransition();

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
        } else {
          toast.error(response.error || "Failed to post job");
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
      }
    });
  }

  // Correct CSS classes with proper dark mode support
  const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-3 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500";
  const labelClass = "block mb-2.5 text-sm font-medium text-gray-900 dark:text-white";
  const errorClass = "mt-1.5 text-xs text-red-600 font-medium dark:text-red-500";

  return (
    <section className="py-12 px-4 mx-auto max-w-3xl">
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Job Listing</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Fill out the details below to find your next great hire.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Title & Company */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClass}>Job Title</label>
            <input
              {...register("title")}
              type="text"
              id="title"
              className={inputClass}
              placeholder="e.g. Senior Product Designer"
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="company" className={labelClass}>Company Name</label>
            <input
              {...register("company")}
              type="text"
              id="company"
              className={inputClass}
              placeholder="e.g. Acme Corp"
            />
            {errors.company && <p className={errorClass}>{errors.company.message}</p>}
          </div>
        </div>

        {/* Row 2: Type & Experience */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="jobType" className={labelClass}>Job Type</label>
            <select {...register("jobType")} id="jobType" className={inputClass}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label htmlFor="experienceLevel" className={labelClass}>Experience Level</label>
            <select {...register("experienceLevel")} id="experienceLevel" className={inputClass}>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead/Manager">Lead/Manager</option>
            </select>
          </div>
        </div>

        {/* Row 3: Location & Salary */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="location" className={labelClass}>Location</label>
            <input
              {...register("location")}
              type="text"
              id="location"
              className={inputClass}
              placeholder="e.g. Remote / New York"
            />
            {errors.location && <p className={errorClass}>{errors.location.message}</p>}
          </div>

          <div>
            <label htmlFor="salary" className={labelClass}>Salary Range (Optional)</label>
            <input
              {...register("salary")}
              type="text"
              id="salary"
              className={inputClass}
              placeholder="e.g. $120k - $150k"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>Job Description</label>
          <textarea
            {...register("description")}
            id="description"
            rows={5}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-3.5 py-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
            placeholder="What will this person do at your company?"
          ></textarea>
          <div className="flex justify-between mt-2">
             <p className="text-[11px] text-gray-500 dark:text-gray-400 italic">Markdown supported.</p>
             <p className="text-[11px] text-gray-500 dark:text-gray-400 tabular-nums">
              {watch("description")?.length || 0} characters
             </p>
          </div>
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        {/* Application Link */}
        <div>
          <label htmlFor="applicationUrl" className={labelClass}>Application Link</label>
          <input
            {...register("applicationUrl")}
            type="url"
            id="applicationUrl"
            className={inputClass}
            placeholder="https://company.com/jobs/apply"
          />
          {errors.applicationUrl && <p className={errorClass}>{errors.applicationUrl.message}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-4 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 shadow font-semibold rounded-lg text-sm px-8 py-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Posting..." : "Publish Vacancy"}
          </button>
          
          <button
            type="button"
            className="text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-lg text-sm px-6 py-3 transition-colors"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}