"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";
import { toast } from "sonner";
import { ArrowRight, Mail, Lock, Sparkles } from "lucide-react";
import { Input } from "@/components/input-saas";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await login(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.success) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        toast.success("Login successful! Redirecting...");
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue your job search journey
            </p>
          </div>

          {/* Card Content */}
          <div className="p-8 space-y-6">
            {/* Social Login Buttons */}
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
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Login Form */}
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
                autoComplete="current-password"
                required
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card Footer */}
          <div className="bg-secondary/30 border-t border-border px-8 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground mb-4">
            Trusted by 10,000+ job seekers worldwide
          </p>
          <div className="flex items-center justify-center gap-6 opacity-60">
            <div className="text-xs text-muted-foreground">🔒 Secure Login</div>
            <div className="text-xs text-muted-foreground">⚡ Instant Access</div>
            <div className="text-xs text-muted-foreground">🎯 AI-Powered</div>
          </div>
        </div>
      </div>
    </div>
  );
}