"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import dynamic from "next/dynamic";
import SaasButton from "@/components/button-saas";
import { Card, CardContent } from "@/components/card-saas";

// Dynamic import prevents server-side rendering issues with PDF generation
const CoverLetterFinalizer = dynamic(
  () => import("@/components/CoverLetterFinalizer"),
  { 
    ssr: false, 
    loading: () => (
      <div className="text-center p-10">
        <Loader className="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>
    ) 
  }
);

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get Params from URL (Passed by Stripe)
  const sessionId = searchParams.get("session_id");
  const applicationId = searchParams.get("applicationId");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [letter, setLetter] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  // Poll the API to check if Webhook verified the payment
  useEffect(() => {
    if (!sessionId || !applicationId) return;

    const pollStatus = async () => {
      try {
        const res = await fetch(
          `/api/verify-payment?sessionId=${encodeURIComponent(sessionId)}&applicationId=${encodeURIComponent(applicationId)}`,
        );
        const data = await res.json();

        console.log("Poll response:", data);

        // SUCCESS: If we have a letter, show it immediately
        if (data.hasLetter && data.letter) {
          console.log("✅ Letter found! Displaying...");
          setLetter(data.letter);
          setStatus("success");
          return true;
        }

        // Still waiting for generation
        if (!data.hasLetter) {
          console.log("⏳ Waiting for letter generation...");
          return false;
        }

        return false;
      } catch (e) {
        console.error("[Verify Payment] Error:", e);
        return false;
      }
    };

    // Initial poll immediately
    pollStatus();

    // Then poll every 2 seconds
    const intervalId = setInterval(async () => {
      setPollCount((prev) => prev + 1);
      const isComplete = await pollStatus();
      if (isComplete) clearInterval(intervalId);
    }, 2000);

    // Timeout after 60 seconds
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (status !== "success") {
        console.error("❌ Timeout: Payment verification took too long");
        setStatus("error");
      }
    }, 60000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [sessionId, applicationId]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* STATE 1: LOADING */}
      {status === "loading" && (
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex flex-col items-center">
              <Loader className="w-8 h-8 animate-spin text-primary mb-4" />
              <h2 className="text-xl font-bold mb-2 text-foreground">
                Confirming Payment...
              </h2>
              <p className="text-muted-foreground">
                We are finalizing your document. This usually takes 5-10
                seconds.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Attempt: {pollCount}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATE 2: SUCCESS */}
      {status === "success" && letter && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground">
              You can now finalize and download your cover letter.
            </p>
          </div>

          {/* THE INTEGRATION POINT */}
          <CoverLetterFinalizer initialLetter={letter} />
        </div>
      )}

      {/* STATE 3: TIMEOUT/ERROR */}
      {status === "error" && (
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex flex-col items-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">
                Processing Delayed
              </h3>
              <p className="text-muted-foreground mb-6">
                Your payment was received, but the document generation is taking
                longer than usual. It will appear in your dashboard shortly.
              </p>
              <SaasButton
                onClick={() => router.push("/dashboard")}
                variant="primary"
                size="lg"
                className="w-full justify-center"
              >
                Go to Dashboard
              </SaasButton>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Wrapper for Next.js Suspense requirement
export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}