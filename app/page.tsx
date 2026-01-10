"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // If user is logged in, send them to dashboard
        router.replace("/dashboard");
      } else {
        // If no user, stop loading and show the landing page
        setLoading(false);
      }
    };

    checkUser();
  }, [router, supabase]);

  // While checking the session, show a clean background
  // to prevent the landing page from "flickering"
  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-gray-900" />;
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <Hero />
      <Features />
      <CTASection />
    </div>
  );
}
