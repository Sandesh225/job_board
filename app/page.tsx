"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

// Import all sections
import Hero from "@/components/sections/Hero";
import ProblemSolution from "@/components/sections/ProblemSolution";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  // Auth check - redirect to dashboard if logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, supabase]);

  // Show loading state while checking auth
  if (loading) {
    return <div className="min-h-screen bg-background" />;
  }

  // Render all sections
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Hero />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </div>
  );
}