import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

// Rate Limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(identifier);
  const WINDOW_MS = 10 * 60 * 1000;
  const MAX_REQUESTS = 5;

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (limit.count >= MAX_REQUESTS) return false;
  limit.count++;
  return true;
}

// ✅ PROPER PROMPT FOR FULL LETTER
const generateSystemPrompt = (tone: string) => `
You are an elite Executive Recruiter and Copywriter. Write a professional cover letter.

CONSTRAINTS:
1. NO BORING OPENERS: Never start with "I am writing to express my interest"
2. START WITH VALUE: Begin with a strong hook about the candidate's achievements
3. USE METRICS: Include specific numbers, percentages, and results from the resume
4. PROFESSIONAL STRUCTURE: 
   - Header with contact info placeholders
   - Date
   - Salutation (Dear Hiring Manager,)
   - Hook paragraph (grab attention immediately)
   - 2-3 proof paragraphs (match job requirements to resume achievements)
   - Culture fit paragraph
   - Strong closing with call to action
   - Sign-off (Sincerely,)

TONE: ${tone || "professional"}

FORMAT: Output as plain text suitable for PDF conversion. Use proper paragraph spacing.
`;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait 10 minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { resumeText, jobDescription, tone = "professional", anonymousId } = body;

    // Validation
    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { error: "Resume is too short. Minimum 50 characters." },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.length < 50) {
      return NextResponse.json(
        { error: "Job description is too short. Minimum 50 characters." },
        { status: 400 }
      );
    }

    if (!anonymousId) {
      return NextResponse.json({ error: "Session ID is required." }, { status: 400 });
    }

    console.log(`🚀 Generating FULL letter for session: ${anonymousId}`);

    // ✅ GENERATE THE COMPLETE LETTER IMMEDIATELY
    const systemInstruction = generateSystemPrompt(tone);
    const userPrompt = `
WRITE A COMPLETE PROFESSIONAL COVER LETTER NOW.

CANDIDATE RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

REQUIREMENTS:
- Complete letter format (Header, Date, Salutation, Body, Sign-off)
- Professional ${tone} tone
- Match job requirements to resume achievements
- Include specific metrics and results
- No markdown formatting
- Plain text output ready for PDF conversion
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(userPrompt);
    const fullLetter = result.response.text();

    if (!fullLetter || fullLetter.length < 100) {
      throw new Error("Generated letter too short");
    }

    console.log(`✅ Full letter generated: ${fullLetter.length} characters`);

    // ✅ CREATE PREVIEW (first 200 chars)
    const previewText = fullLetter.substring(0, 200) + "...";

    // ✅ SAVE FULL LETTER TO DATABASE
    const { data: application, error: dbError } = await supabaseAdmin
      .from("job_applications")
      .insert({
        session_id: anonymousId,
        resume_text: resumeText,
        job_description: jobDescription,
        tone: tone,
        preview_text: previewText,
        generated_letter: fullLetter,  // ✅ STORE FULL LETTER HERE
        is_paid: false,                // ✅ NOT PAID YET
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError || !application) {
      console.error("❌ Database Error:", dbError);
      throw new Error("Failed to save application to database.");
    }

    console.log(`✅ Application saved with ID: ${application.id}`);

    // ✅ RETURN ONLY PREVIEW TO FRONTEND
    return NextResponse.json({
      success: true,
      letter: previewText,  // ✅ Only send preview
      applicationId: application.id,
    });

  } catch (error: any) {
    console.error("❌ Generation Error:", error);

    const errorMessage = error.message?.includes('503')
      ? "AI Service is currently busy. Please try again in a moment."
      : (error.message || "Internal Server Error");

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}