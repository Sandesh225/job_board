import CTASection from "@/components/CTASection";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
// Note: Header and Footer are removed here because they are in layout.tsx

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Hero />
      <Features />
      <CTASection />
    </div>
  );
}
