"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "@/app/actions/auth";
import { toast } from "sonner";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState("job-seeker");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    formData.append("role", role);

    startTransition(async () => {
      const result = await signup(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.requiresConfirmation) {
        // Email confirmation required
        toast.success(result.success, {
          duration: 10000,
        });
        return;
      }

      if (result?.success) {
        // Wait a tiny bit for the auth state to propagate
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Show success toast
        toast.success("Account created! Redirecting...");

        // Redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col justify-center py-12">
      <div className="flex flex-col items-center justify-center px-6 mx-auto w-full lg:py-0">
        {/* Branding/Logo */}
        <Link
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-xl font-bold text-white">J</span>
          </div>
          Job<span className="text-primary-600">Board</span>
        </Link>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Create an account
            </h1>

            <form className="space-y-4 md:space-y-6" action={handleSubmit}>
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="name@company.com"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {/* Role Selection Dropdown */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  I am a:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="job-seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 rounded border border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Creating account..." : "Create an account"}
              </button>

              {/* Login Link */}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}