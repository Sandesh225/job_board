'use client'

import React, { useState } from 'react'
import { Modal, ModalFooter } from '@/components/modal-saas'
import { Button } from '@/components/button-saas'
import { Input } from '@/components/input-saas'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card-saas'
import {
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap,
  FileText,
} from 'lucide-react'

interface CoverLetterGeneratorProps {
  isOpen: boolean
  onClose: () => void
  jobTitle?: string
  company?: string
}

interface GeneratedLetter {
  content: string
  timestamp: Date
  tone: 'professional' | 'friendly' | 'confident'
}

export function CoverLetterGenerator({
  isOpen,
  onClose,
  jobTitle = 'Senior React Developer',
  company = 'TechCorp',
}: CoverLetterGeneratorProps) {
  const [step, setStep] = useState<'input' | 'generating' | 'result'>('input')
  const [formData, setFormData] = useState({
    yourName: '',
    jobDescription: '',
    yourExperience: '',
    tone: 'professional' as const,
  })
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetter | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleGenerateLetter = async () => {
    // Validation
    if (!formData.yourName.trim()) {
      setError('Please enter your name')
      return
    }
    if (!formData.jobDescription.trim()) {
      setError('Please paste the job description')
      return
    }
    if (!formData.yourExperience.trim()) {
      setError('Please tell us about your experience')
      return
    }

    setStep('generating')
    setError(null)

    // Simulate API call to Gemini AI
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock generated letter
      const mockLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my extensive experience in modern web development and passion for creating exceptional user experiences, I am confident that I would be a valuable addition to your team.

Throughout my career, I have successfully delivered high-impact projects using React and modern JavaScript frameworks. My expertise includes building scalable applications, optimizing performance, and mentoring junior developers. I am particularly drawn to ${company}'s commitment to innovation and would be excited to contribute to your mission.

In my current role, I have demonstrated my ability to:
• Lead cross-functional teams to deliver complex features on schedule
• Implement best practices in code quality and testing methodologies
• Collaborate effectively with designers and product managers

Your job description resonates strongly with my professional goals, and I am eager to bring my skills and enthusiasm to your organization. I am confident that my technical expertise, combined with my collaborative approach and dedication to continuous learning, makes me an excellent fit for this role.

Thank you for considering my application. I would welcome the opportunity to discuss how I can contribute to ${company}'s success. Please feel free to contact me at your convenience.

Sincerely,
${formData.yourName}`

      setGeneratedLetter({
        content: mockLetter,
        timestamp: new Date(),
        tone: formData.tone,
      })

      setStep('result')
    } catch (err) {
      setError('Failed to generate cover letter. Please try again.')
      setStep('input')
    }
  }

  const handleCopyToClipboard = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (generatedLetter) {
      const element = document.createElement('a')
      const file = new Blob([generatedLetter.content], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `cover-letter-${company.toLowerCase()}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  const handleRegenerateWithTone = async (newTone: typeof formData.tone) => {
    setFormData((prev) => ({ ...prev, tone: newTone }))
    setStep('generating')
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockLetter = `Dear Hiring Manager,

I'm thrilled to apply for the ${jobTitle} position at ${company}! With my passion for building amazing products and proven track record in React development, I believe I'd be a great fit for your team.

What excites me most about this role is the opportunity to work with ${company}'s innovative products. I've consistently delivered results in fast-paced environments and have a genuine enthusiasm for solving complex problems through clean, maintainable code.

My key strengths include:
• Building high-performance React applications that users love
• Collaborating effectively across teams to ship features faster
• Staying updated with the latest web technologies and best practices

I'm not just looking for a job—I'm looking for a place where I can grow alongside a talented team and make a real impact. I'm confident that my technical skills, combined with my enthusiasm and collaborative spirit, would make me a valuable team member.

I'd love to chat about how we can work together to build something amazing!

Best regards,
${formData.yourName}`

      setGeneratedLetter({
        content: mockLetter,
        timestamp: new Date(),
        tone: newTone,
      })
    } catch (err) {
      setError('Failed to regenerate letter. Please try again.')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Cover Letter"
      description={`AI-powered cover letter tailored for ${company}`}
      size="xl"
    >
      {step === 'input' && (
        <div className="space-y-6">
          {/* Job Context */}
          <Card variant="default" className="bg-primary/5 border-primary/30" padding="md">
            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">{jobTitle}</p>
                <p className="text-sm text-foreground/70">{company}</p>
              </div>
            </div>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="flex gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* Name */}
            <Input
              label="Your Full Name"
              name="yourName"
              value={formData.yourName}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />

            {/* Job Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Job Description{' '}
                <span className="ml-1 text-destructive">*</span>
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                placeholder="Paste the full job description here..."
                rows={4}
                className="w-full rounded-md border border-input bg-input px-3 py-2 text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-input resize-none"
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Your Relevant Experience{' '}
                <span className="ml-1 text-destructive">*</span>
              </label>
              <textarea
                name="yourExperience"
                value={formData.yourExperience}
                onChange={handleInputChange}
                placeholder="Tell us about your experience, skills, and achievements..."
                rows={4}
                className="w-full rounded-md border border-input bg-input px-3 py-2 text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-input resize-none"
              />
            </div>

            {/* Tone Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Tone
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['professional', 'friendly', 'confident'] as const).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setFormData((prev) => ({ ...prev, tone }))}
                    className={`p-3 rounded-lg border-2 transition-all text-center capitalize font-medium ${
                      formData.tone === tone
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary/30 text-foreground hover:border-primary/50'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateLetter}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate Letter
            </Button>
          </ModalFooter>
        </div>
      )}

      {step === 'generating' && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
            <div className="absolute inset-1 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="font-semibold text-foreground">Generating your cover letter...</p>
            <p className="text-sm text-foreground/70">
              Our AI is crafting the perfect letter for you
            </p>
          </div>
        </div>
      )}

      {step === 'result' && generatedLetter && (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="flex gap-3 p-4 rounded-lg bg-success/10 border border-success/30">
            <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-sm text-success font-medium">Cover letter generated successfully!</p>
          </div>

          {/* Letter Preview */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Your Cover Letter
            </label>
            <div className="rounded-lg border border-border bg-secondary/30 p-6 max-h-96 overflow-y-auto">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {generatedLetter.content}
              </p>
            </div>
          </div>

          {/* Tone Variants */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Try Different Tones</p>
            <div className="grid grid-cols-3 gap-2">
              {(['professional', 'friendly', 'confident'] as const).map((tone) => (
                <Button
                  key={tone}
                  variant={generatedLetter.tone === tone ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleRegenerateWithTone(tone)}
                  className="capitalize"
                >
                  {tone}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => setStep('input')}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={handleCopyToClipboard}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </ModalFooter>
        </div>
      )}
    </Modal>
  )
}
