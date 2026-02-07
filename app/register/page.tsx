"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "@/app/actions/auth";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  Briefcase,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState("job-seeker");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    formData.append("role", role);

    startTransition(async () => {
      try {
        const result = await signup(formData);

        if (result?.error) {
          toast.error(result.error);
          return;
        }

        if (result?.requiresConfirmation) {
          toast.success("Account created! Please check your email.");
        } else if (result?.success) {
          toast.success("Account created! Redirecting...");
          router.push("/dashboard");
          router.refresh();
        }
      } catch (e) {
        toast.error("An unexpected error occurred");
      }
    });
  }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-background text-foreground">
      {/* Left Side - Visuals (Hidden on mobile - flipped from login for variety) */}
      <div className="hidden lg:flex relative h-full bg-muted flex-col p-10 text-white dark:border-r border-border">
        <div className="absolute inset-0 bg-primary/90 dark:bg-zinc-900" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="mr-2 h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
            J
          </div>
          JobBoard
        </div>

        <div className="relative z-20 mt-auto">
          <h2 className="text-3xl font-bold mb-4">Join the community</h2>
          <ul className="space-y-3 text-primary-foreground/90">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Access thousands of jobs
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Smart salary insights
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Direct chat with employers
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="mx-auto grid w-full max-w-[480px] gap-6">
          <div className="flex flex-col text-center space-y-2 lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose your role and start your journey
            </p>
          </div>

          <form action={handleSubmit} className="grid gap-6">
            {/* Visual Role Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setRole("job-seeker")}
                className={`cursor-pointer rounded-xl border-2 p-4 hover:border-primary hover:bg-accent transition-all duration-200 ${role === "job-seeker" ? "border-primary bg-primary/5" : "border-transparent bg-muted/50"}`}
              >
                <Briefcase
                  className={`mb-3 h-6 w-6 ${role === "job-seeker" ? "text-primary" : "text-muted-foreground"}`}
                />
                <div className="font-semibold text-sm">I'm a Job Seeker</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Looking for my next dream job
                </div>
              </div>

              <div
                onClick={() => setRole("employer")}
                className={`cursor-pointer rounded-xl border-2 p-4 hover:border-primary hover:bg-accent transition-all duration-200 ${role === "employer" ? "border-primary bg-primary/5" : "border-transparent bg-muted/50"}`}
              >
                <Building2
                  className={`mb-3 h-6 w-6 ${role === "employer" ? "text-primary" : "text-muted-foreground"}`}
                />
                <div className="font-semibold text-sm">I'm an Employer</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Hiring talent for my company
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="input"
                  disabled={isPending}
                />
              </div>

              <div className="grid gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    className="input pr-10"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-1 rounded border-input text-primary focus:ring-ring"
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-snug"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}