"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/client"; // Assumes you have this setup
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  User,
  FileText,
  Link2,
  Send,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Internal UI Components (Replaces external dependencies)
// ============================================================================

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

const InputField = ({
  icon: Icon,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: any }) => (
  <div className="relative group">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
        {Icon}
      </div>
    )}
    <input
      className={`flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${Icon ? "pl-10" : ""} ${className}`}
      {...props}
    />
  </div>
);

const TextAreaField = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
    {...props}
  />
);

// ============================================================================
// Main Component
// ============================================================================

export default function ApplyJobClient({ job, user }: ApplyJobClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user.user_metadata?.full_name || "",
    email: user.email || "",
    phone: "",
    coverLetter: "",
    resumeUrl: "",
  });

  const MIN_COVER_LETTER_LENGTH = 100;
  const currentLength = formData.coverLetter.length;
  const isCoverLetterValid = currentLength >= MIN_COVER_LETTER_LENGTH;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCoverLetterValid) {
      toast.error(
        `Please write at least ${MIN_COVER_LETTER_LENGTH} characters.`,
      );
      return;
    }

    startTransition(async () => {
      try {
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
          if (error.code === "23505") {
            toast.error("You have already applied for this position.");
          } else {
            console.error("Submission error:", error);
            toast.error("Something went wrong. Please try again.");
          }
        } else {
          toast.success("Application submitted successfully!");
          // Small delay for UX before redirect
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.refresh();
          router.push("/dashboard");
        }
      } catch (err) {
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Breadcrumbs --- */}
        <nav className="mb-8 flex items-center space-x-1 text-sm text-muted-foreground">
          <Link
            href="/jobs"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Jobs
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/jobs/${job.id}`}
            className="hover:text-primary transition-colors truncate max-w-[150px]"
          >
            {job.title}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Apply</span>
        </nav>

        {/* --- Header Card --- */}
        <div className="relative mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {job.title}
              </h1>
              <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
                <Briefcase className="h-4 w-4" /> {job.company}
              </p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {job.job_type.replace("_", " ")}
              </span>
              <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                <MapPin className="mr-1 h-3 w-3" /> {job.location}
              </span>
            </div>
          </div>
        </div>

        {/* --- Application Form --- */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label required>Full Name</Label>
                <InputField
                  name="fullName"
                  icon={<User className="h-4 w-4" />}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label required>Email Address</Label>
                <InputField
                  type="email"
                  name="email"
                  icon={<Mail className="h-4 w-4" />}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label required>Phone Number</Label>
                <InputField
                  type="tel"
                  name="phone"
                  icon={<Phone className="h-4 w-4" />}
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label required>Resume / Portfolio URL</Label>
                <InputField
                  type="url"
                  name="resumeUrl"
                  icon={<Link2 className="h-4 w-4" />}
                  placeholder="https://linkedin.com/in/..."
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Cover Letter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Cover Letter</h2>
            </div>

            <div className="relative">
              <Label required>Why are you the best fit for this role?</Label>
              <TextAreaField
                name="coverLetter"
                placeholder="Tell us about your experience and why you want to join us..."
                value={formData.coverLetter}
                onChange={handleChange}
                required
                className="min-h-[200px] resize-y"
              />

              {/* Character Count & Validation Indicator */}
              <div className="mt-2 flex items-center justify-between text-xs">
                <div
                  className={`flex items-center gap-1.5 transition-colors ${isCoverLetterValid ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
                >
                  {isCoverLetterValid ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Looks good!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>
                        Minimum {MIN_COVER_LETTER_LENGTH} characters required
                      </span>
                    </>
                  )}
                </div>
                <span
                  className={
                    isCoverLetterValid
                      ? "text-muted-foreground"
                      : "text-orange-500 font-medium"
                  }
                >
                  {currentLength} / {MIN_COVER_LETTER_LENGTH} characters
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !isCoverLetterValid}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By clicking submit, you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </form>
      </div>
    </div>
  );
}