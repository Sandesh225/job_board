'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Loader, Copy, Download, Zap, AlertCircle, CheckCircle2, Lock, FileText, Briefcase, Sparkles } from 'lucide-react';
import SaasButton from '@/components/button-saas';
import { Card, CardContent, CardHeader } from '@/components/card-saas';

export default function GeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [step, setStep] = useState<'input' | 'generating' | 'result'>('input');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedLetter, setGeneratedLetter] = useState('');
  
  // Logic State
  const [anonymousId, setAnonymousId] = useState('');
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [copied, setCopied] = useState(false);

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'confident', label: 'Confident' },
    { value: 'creative', label: 'Creative' },
    { value: 'formal', label: 'Formal' },
  ];

  // 1. Initialize Session
  useEffect(() => {
    let id = localStorage.getItem('jobappai_session_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('jobappai_session_id', id);
    }
    setAnonymousId(id);

    const app_id = searchParams.get('applicationId');
    const session_id = searchParams.get('session_id');

    if (app_id && session_id) {
      setApplicationId(app_id);
      setStep('generating');
      verifyPayment(app_id);
    }
  }, [searchParams]);

  // 2. Verify Payment
  const verifyPayment = async (appId: string) => {
    try {
      const res = await fetch(`/api/verify-payment?applicationId=${appId}`);
      const data = await res.json();
      
      if (data.success && data.isPaid) {
        setIsPaid(true);
        setGeneratedLetter(data.letter);
        setStep('result');
        router.replace('/generate');
      } else {
        alert('Payment verification failed. Please contact support.');
        setStep('input');
      }
    } catch (error) {
      console.error(error);
      setStep('input');
    }
  };

  // 3. Generate Draft
  const handleGenerate = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      alert('Please enter both your Resume and the Job Description');
      return;
    }

    setStep('generating');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription, tone, anonymousId }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to generate');

      setGeneratedLetter(data.letter);
      setApplicationId(data.applicationId);
      setIsPaid(false);
      setStep('result');

    } catch (error: any) {
      alert(error.message);
      setStep('input');
    }
  };

  // 4. Handle Checkout
  const handleCheckout = async () => {
    if (!applicationId) return;
    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      alert('Checkout failed. Please try again.');
      setIsCheckingOut(false);
    }
  };

  // Utilities
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'cover-letter.txt';
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
            <span className="text-sm font-semibold text-primary">AI-Powered</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Generate Your Cover Letter
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-powered cover letters tailored to your job in 60 seconds
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                  step === 'input' && num === 1
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : step === 'generating' && num === 2
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : step === 'result'
                    ? num <= (isPaid ? 3 : 2)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                    : num <= 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {num}
              </div>
              {num < 3 && <div className="h-1 w-12 bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Input */}
        {step === 'input' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-foreground">Job Details</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Resume Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Paste Your Resume
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your full resume text here..."
                    className="w-full h-48 p-4 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                  />
                </div>

                {/* Job Description Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job posting here..."
                    className="w-full h-48 p-4 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Include job title, company details, and key requirements
                  </p>
                </div>

                {/* Tone Selector */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Writing Tone
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {tones.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTone(t.value)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                          tone === t.value
                            ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                            : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
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
                  className="w-full justify-center gap-2"
                  disabled={!jobDescription.trim() || !resumeText.trim()}
                >
                  <Zap className="w-5 h-5" />
                  Generate Cover Letter
                </SaasButton>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6 pb-6 flex gap-3">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">60 Seconds</h3>
                    <p className="text-sm text-muted-foreground">Get your letter instantly</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6 pb-6 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">ATS-Optimized</h3>
                    <p className="text-sm text-muted-foreground">Passes screening systems</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Generating */}
        {step === 'generating' && (
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Generating Your Cover Letter...
              </h2>
              <p className="text-muted-foreground">
                Our AI is analyzing your resume against the job description...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Result */}
        {step === 'result' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Status Banner */}
            <Card className={`${isPaid ? 'bg-primary/5 border-primary/20' : 'bg-primary/5 border-primary/20'}`}>
              <CardContent className="pt-6 pb-6 flex items-center gap-3">
                {isPaid ? (
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                ) : (
                  <Lock className="w-6 h-6 text-primary flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">{isPaid ? 'Success!' : 'Draft Ready'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isPaid ? 'Your cover letter is ready for download.' : 'Your cover letter has been generated. Unlock to view.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-foreground">Your Cover Letter</h2>
              </CardHeader>
              <CardContent>
                {/* The Letter Container */}
                <div className="relative border border-border rounded-lg overflow-hidden mb-6">
                  
                  {/* The Text Content */}
                  <div className={`bg-secondary/50 p-6 whitespace-pre-wrap text-foreground leading-relaxed transition-all duration-500 ${!isPaid ? 'blur-[6px] select-none h-64 overflow-hidden' : ''}`}>
                    {generatedLetter}
                  </div>

                  {/* Paywall Overlay */}
                  {!isPaid && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
                      <div className="bg-card border border-border p-8 rounded-xl shadow-2xl max-w-sm w-full">
                        <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">Unlock Full Letter</h3>
                        <p className="text-muted-foreground mb-6 text-sm">
                          Get the complete, unblurred version tailored to this job.
                        </p>
                        <SaasButton
                          onClick={handleCheckout}
                          variant="primary"
                          size="lg"
                          className="w-full justify-center"
                          disabled={isCheckingOut}
                        >
                          {isCheckingOut ? (
                            <Loader className="w-5 h-5 animate-spin" />
                          ) : (
                            <>Unlock for $3.00</>
                          )}
                        </SaasButton>
                        <p className="text-xs text-muted-foreground mt-4">
                          Secure payment via Stripe
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {isPaid && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <SaasButton
                      onClick={handleCopy}
                      variant={copied ? 'primary' : 'secondary'}
                      size="lg"
                      className="gap-2"
                    >
                      <Copy className="w-5 h-5" />
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </SaasButton>
                    <SaasButton
                      onClick={handleDownload}
                      variant="outline"
                      size="lg"
                      className="gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </SaasButton>
                    <SaasButton
                      onClick={() => {
                        setStep('input');
                        setGeneratedLetter('');
                        setJobDescription('');
                        setResumeText('');
                        setIsPaid(false);
                      }}
                      variant="ghost"
                      size="lg"
                    >
                      Generate Another
                    </SaasButton>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 pb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Pro Tip</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize the letter to add personal touches and specific examples. Personalized letters have higher success rates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}