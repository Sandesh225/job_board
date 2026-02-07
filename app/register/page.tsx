"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "@/app/actions/auth";
import { toast } from "sonner";
import { ArrowRight, Mail, Lock, Sparkles, Search, Briefcase } from "lucide-react";
import { Input } from "@/components/input-saas";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState("job-seeker");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("role", role);

    startTransition(async () => {
      const result = await signup(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.requiresConfirmation) {
        toast.success(result.success, {
          duration: 10000,
        });
        return;
      }

      if (result?.success) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        toast.success("Account created! Redirecting...");
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Branding */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8 group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <span className="text-2xl font-bold text-primary-foreground">J</span>
          </div>
          <span className="text-2xl font-bold text-foreground">
            Job<span className="text-primary">Board</span>
          </span>
        </Link>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Card Header */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Join JobBoard
            </h1>
            <p className="text-muted-foreground">
              Start your journey to landing your dream job
            </p>
          </div>

          {/* Card Content */}
          <div className="p-8 space-y-6">
            {/* Social Signup Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg bg-background hover:bg-secondary/50 text-foreground font-medium transition-all duration-200 hover:shadow-md group"
              >
                <img
                  className="w-5 h-5"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                />
                <span className="text-sm">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg bg-background hover:bg-secondary/50 text-foreground font-medium transition-all duration-200 hover:shadow-md group"
              >
                <img
                  className="w-5 h-5 dark:invert"
                  src="https://www.svgrepo.com/show/511330/apple-fill.svg"
                  alt="Apple"
                />
                <span className="text-sm">Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground font-medium">
                  Or sign up with email
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <Input
                type="email"
                name="email"
                id="email"
                label="Email Address"
                placeholder="you@example.com"
                icon={<Mail className="h-5 w-5" />}
                autoComplete="email"
                required
              />

              {/* Password Input */}
              <Input
                type="password"
                name="password"
                id="password"
                label="Password"
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5" />}
                autoComplete="new-password"
                helper="Must be at least 8 characters long"
                required
              />

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("job-seeker")}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
                      role === "job-seeker"
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border bg-background hover:bg-secondary/30"
                    }`}
                  >
                    <Search className={`w-6 h-6 ${role === "job-seeker" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-semibold ${role === "job-seeker" ? "text-primary" : "text-foreground"}`}>
                      Job Seeker
                    </span>
                    {role === "job-seeker" && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("employer")}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
                      role === "employer"
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border bg-background hover:bg-secondary/30"
                    }`}
                  >
                    <Briefcase className={`w-6 h-6 ${role === "employer" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-semibold ${role === "employer" ? "text-primary" : "text-foreground"}`}>
                      Employer
                    </span>
                    {role === "employer" && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3 p-4 bg-secondary/20 rounded-lg border border-border">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="group relative w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card Footer */}
          <div className="bg-secondary/30 border-t border-border px-8 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl">⚡</div>
            <p className="text-xs text-muted-foreground font-medium">Quick Setup</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl">🎯</div>
            <p className="text-xs text-muted-foreground font-medium">AI-Powered</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl">🔒</div>
            <p className="text-xs text-muted-foreground font-medium">Secure & Private</p>
          </div>
        </div>
      </div>
    </div>
  );
}