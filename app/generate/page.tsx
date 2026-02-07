"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  Loader,
  Copy,
  Download,
  Zap,
  AlertCircle,
  CheckCircle2,
  Lock,
  FileText,
  Briefcase,
  Sparkles,
} from "lucide-react";
import SaasButton from "@/components/button-saas";
import { Card, CardContent, CardHeader } from "@/components/card-saas";

/**
 * 1. CONTENT COMPONENT
 * Contains all the logic and UI.
 * This must be separate to be wrapped in Suspense.
 */
function GeneratePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [step, setStep] = useState<"input" | "generating" | "result">("input");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedLetter, setGeneratedLetter] = useState("");

  // Logic State
  const [anonymousId, setAnonymousId] = useState("");
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [copied, setCopied] = useState(false);

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "confident", label: "Confident" },
    { value: "creative", label: "Creative" },
    { value: "formal", label: "Formal" },
  ];

  // 1. Initialize Session & Check for Redirects
  useEffect(() => {
    // Session ID Logic
    let id = localStorage.getItem("jobappai_session_id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("jobappai_session_id", id);
    }
    setAnonymousId(id);

    // Check URL for payment return
    const app_id = searchParams.get("applicationId");
    const session_id = searchParams.get("session_id");

    if (app_id && session_id) {
      setApplicationId(app_id);
      setStep("generating");
      verifyPayment(app_id);
    }
  }, [searchParams]);

  // 2. Verify Payment from Stripe Redirect
  const verifyPayment = async (appId: string) => {
    try {
      const res = await fetch(`/api/verify-payment?applicationId=${appId}`);
      const data = await res.json();

      if (data.success && data.isPaid) {
        setIsPaid(true);
        setGeneratedLetter(data.letter);
        setStep("result");
        // Clean URL
        router.replace("/generate");
      } else {
        alert("Payment verification failed. Please contact support.");
        setStep("input");
      }
    } catch (error) {
      console.error(error);
      setStep("input");
    }
  };

  // 3. Generate the AI Draft
  const handleGenerate = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      alert("Please enter both your Resume and the Job Description");
      return;
    }

    setStep("generating");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription, tone, anonymousId }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to generate");

      setGeneratedLetter(data.letter);
      setApplicationId(data.applicationId);
      setIsPaid(false);
      setStep("result");
    } catch (error: any) {
      alert(error.message);
      setStep("input");
    }
  };

  // 4. Handle Stripe Checkout
  const handleCheckout = async () => {
    if (!applicationId) return;
    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      alert("Checkout failed. Please try again.");
      setIsCheckingOut(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "cover-letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              AI-Powered
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Generate Your Cover Letter
          </h1>
          <p className="text-xl text-muted-foreground">
            Tailored professional letters in 60 seconds
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                  step === "input" && num === 1
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : step === "generating" && num === 2
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : step === "result" && num <= (isPaid ? 3 : 2)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                {num}
              </div>
              {num < 3 && <div className="h-1 w-12 bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Input */}
        {step === "input" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-foreground">
                  Paste Details
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <FileText className="w-4 h-4 text-primary" /> Resume Text
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your full resume here..."
                    className="w-full h-48 p-4 rounded-lg border border-border bg-card text-foreground resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <Briefcase className="w-4 h-4 text-primary" /> Job
                    Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job posting here..."
                    className="w-full h-48 p-4 rounded-lg border border-border bg-card text-foreground resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Tone
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {tones.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTone(t.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          tone === t.value
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <SaasButton
                  onClick={handleGenerate}
                  variant="primary"
                  size="lg"
                  className="w-full gap-2"
                >
                  <Zap className="w-5 h-5" /> Generate Draft
                </SaasButton>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Generating */}
        {step === "generating" && (
          <Card className="text-center py-12">
            <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Crafting your letter...
            </h2>
            <p className="text-muted-foreground">
              Our AI is analyzing your skills against the job requirements.
            </p>
          </Card>
        )}

        {/* Step 3: Result */}
        {step === "result" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-4 flex items-center gap-3">
                {isPaid ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <Lock className="w-6 h-6 text-primary" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">
                    {isPaid ? "Letter Unlocked" : "Draft Generated"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isPaid
                      ? "Ready for download."
                      : "Unlock to view the full letter."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="relative border border-border rounded-lg overflow-hidden mb-6">
                  <div
                    className={`bg-secondary/30 p-8 whitespace-pre-wrap text-foreground leading-relaxed transition-all duration-700 ${!isPaid ? "blur-md select-none h-64 overflow-hidden" : ""}`}
                  >
                    {generatedLetter}
                  </div>

                  {!isPaid && (
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                      <div className="bg-card border border-border p-8 rounded-xl shadow-2xl max-w-sm">
                        <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">
                          Unlock Full Letter
                        </h3>
                        <p className="text-muted-foreground mb-6 text-sm">
                          Get the high-converting, ATS-optimized version for
                          just $3.
                        </p>
                        <SaasButton
                          onClick={handleCheckout}
                          variant="primary"
                          size="lg"
                          className="w-full"
                          disabled={isCheckingOut}
                        >
                          {isCheckingOut ? (
                            <Loader className="w-5 h-5 animate-spin" />
                          ) : (
                            "Unlock for $3.00"
                          )}
                        </SaasButton>
                      </div>
                    </div>
                  )}
                </div>

                {isPaid && (
                  <div className="flex flex-wrap gap-3">
                    <SaasButton
                      onClick={handleCopy}
                      variant={copied ? "primary" : "secondary"}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" /> {copied ? "Copied" : "Copy"}
                    </SaasButton>
                    <SaasButton
                      onClick={handleDownload}
                      variant="outline"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" /> Download
                    </SaasButton>
                    <SaasButton
                      onClick={() => setStep("input")}
                      variant="ghost"
                    >
                      Generate Another
                    </SaasButton>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 2. MAIN EXPORT
 * Wraps the content in Suspense to fix the Next.js Prerender error.
 */
export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader className="w-12 h-12 animate-spin text-primary" />
        </div>
      }
    >
      <GeneratePageContent />
    </Suspense>
  );
}