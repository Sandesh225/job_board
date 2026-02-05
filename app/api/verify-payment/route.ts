import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");
    const sessionId = searchParams.get("sessionId");

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    console.log(`🔍 Verifying payment for application: ${applicationId}`);

    const { data: application, error } = await supabaseAdmin
      .from("job_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (error || !application) {
      console.error("Application not found:", error);
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Security check
    if (sessionId && application.stripe_session_id !== sessionId) {
      console.error("Session ID mismatch");
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    console.log(`✅ Payment verified: isPaid=${application.is_paid}, hasLetter=${!!application.generated_letter}`);

    return NextResponse.json({
      success: true,
      isPaid: application.is_paid || false,
      hasLetter: !!application.generated_letter,
      letter: application.is_paid ? application.generated_letter : null,
      preview: application.preview_text,
    });

  } catch (error: any) {
    console.error("❌ Verify payment error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}