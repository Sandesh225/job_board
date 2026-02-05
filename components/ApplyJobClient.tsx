"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/client';
import { Loader, ChevronRight } from "lucide-react";
import SaasButton from "./button-saas";
import { Card, CardContent, CardHeader } from "./card-saas";
import InputField from "./input-saas";

interface Job {
  id: string;
  title: string;
  company: string;
  job_type: string;
  location: string;
  experience_level: string;
  salary: string | null;
}

interface ApplyJobClientProps {
  job: Job;
  user: any;
}

export default function ApplyJobClient({ job, user }: ApplyJobClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    fullName: user.user_metadata?.full_name || "",
    email: user.email || "",
    phone: "",
    coverLetter: "",
    resumeUrl: "",
  });

  const MIN_COVER_LETTER_LENGTH = 100;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation check
    if (formData.coverLetter.length < MIN_COVER_LETTER_LENGTH) {
      toast.error(
        `Cover letter must be at least ${MIN_COVER_LETTER_LENGTH} characters.`,
      );
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.from("applications").insert({
        job_id: job.id,
        user_id: user.id,
        status: "pending",
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cover_letter: formData.coverLetter,
        resume_url: formData.resumeUrl,
      });

      if (error) {
        // Postgres error code for unique violation (user already applied)
        if (error.code === "23505") {
          toast.error(
            "You have already submitted an application for this position.",
          );
        } else {
          console.error("Submission error:", error);
          toast.error("Something went wrong. Please try again later.");
        }
      } else {
        toast.success("Application received! Redirecting...");
        // Refresh the page/router to update server components elsewhere
        router.refresh();
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background py-12 pt-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium">
          <Link
            href="/jobs"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Jobs
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Link
            href={`/jobs/${job.id}`}
            className="text-primary hover:text-primary/80 transition-colors truncate max-w-[150px] sm:max-w-none"
          >
            {job.title}
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Apply</span>
        </nav>

        {/* Header Card with Job Info & Resume/Description Sections */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="h3 text-foreground">Apply for {job.title}</h1>
                <p className="text-muted-foreground font-medium">
                  {job.company}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-primary">{job.job_type}</span>
                <span className="badge badge-secondary">{job.location}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Job Details Section - Resume & Job Description Both Visible */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Resume Section */}
          <Card>
            <CardHeader>
              <h3 className="h5 text-foreground">Resume Information</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Ensure your resume is up-to-date with:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Current work experience</li>
                  <li>Relevant skills and certifications</li>
                  <li>Educational background</li>
                  <li>Contact information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Job Description Section */}
          <Card>
            <CardHeader>
              <h3 className="h5 text-foreground">Job Description</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground">
                    Experience Level
                  </p>
                  <p className="text-muted-foreground">
                    {job.experience_level}
                  </p>
                </div>
                {job.salary && (
                  <div>
                    <p className="font-semibold text-foreground">
                      Salary Range
                    </p>
                    <p className="text-muted-foreground">{job.salary}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader className="border-b border-border">
            <h2 className="h4 text-foreground">Candidate Information</h2>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-semibold text-foreground"
                  >
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="input-base input-focus w-full"
                    placeholder="Jane Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-semibold text-foreground"
                  >
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-base input-focus w-full"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>

              {/* Phone & Resume */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-semibold text-foreground"
                  >
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-base input-focus w-full"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label
                    htmlFor="resumeUrl"
                    className="block mb-2 text-sm font-semibold text-foreground"
                  >
                    Resume Link <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="url"
                    id="resumeUrl"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    required
                    className="input-base input-focus w-full"
                    placeholder="https://resume.com/yourname"
                  />
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="coverLetter"
                    className="text-sm font-semibold text-foreground"
                  >
                    Cover Letter <span className="text-destructive">*</span>
                  </label>
                  <span
                    className={`text-xs font-medium ${formData.coverLetter.length < MIN_COVER_LETTER_LENGTH ? "text-warning" : "text-success"}`}
                  >
                    {formData.coverLetter.length} / {MIN_COVER_LETTER_LENGTH}{" "}
                    chars min
                  </span>
                </div>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  required
                  rows={10}
                  className="w-full px-4 py-3 rounded-md border border-input bg-input text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Share your experience and why you're interested in this role..."
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
                <SaasButton
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex-1 justify-center"
                >
                  <Link href={`/jobs/${job.id}`}>Cancel</Link>
                </SaasButton>
                <SaasButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={
                    isPending ||
                    formData.coverLetter.length < MIN_COVER_LETTER_LENGTH
                  }
                  className="flex-[2] justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </SaasButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
