import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// app/api/webhooks/route.ts

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover", // Updated from 2024-11-20.acacia
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  let event: Stripe.Event;

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("❌ Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`❌ Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log(`✅ Webhook received: ${event.type} | ID: ${event.id}`);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Webhook handler error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const applicationId = session.metadata?.applicationId;
  const customerEmail = session.customer_details?.email;

  console.log(`🔔 Processing payment for application: ${applicationId}`);

  if (!applicationId) {
    console.error("❌ No applicationId in session metadata");
    return;
  }

  try {
    // 1. Fetch application
    const { data: application, error: appError } = await supabaseAdmin
      .from("job_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      console.error(`❌ Application not found: ${applicationId}`);
      return;
    }

    // 2. Idempotency check
    if (application.is_paid) {
      console.log(`⚠️ Already processed application: ${applicationId}`);
      return;
    }

    // 3. Verify letter already exists
    if (!application.generated_letter) {
      console.error(`❌ No letter found for application: ${applicationId}`);
      throw new Error("Letter not found. Please contact support.");
    }

    console.log(`✅ Letter already exists. Unlocking access...`);

    // ✅ 4. JUST MARK AS PAID - DON'T REGENERATE!
    const { error: updateError } = await supabaseAdmin
      .from("job_applications")
      .update({
        is_paid: true,  // ✅ Unlock the letter
        stripe_payment_intent_id: typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicationId);

    if (updateError) {
      console.error("❌ Failed to update application:", updateError);
      throw updateError;
    }

    // 5. Update payment record
    await supabaseAdmin
      .from("payments")
      .update({
        status: "succeeded",
        stripe_payment_intent_id: typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
        customer_email: customerEmail,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", session.id);

    console.log(`✅✅✅ SUCCESS: Access granted for ${customerEmail}`);

  } catch (error: any) {
    console.error("❌ CRITICAL ERROR in webhook:", error);

    // Still mark as paid even if there was an error
    await supabaseAdmin
      .from("job_applications")
      .update({
        is_paid: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicationId);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  console.log(`💰 Processing refund for charge: ${charge.id}`);

  const { data: payment } = await supabaseAdmin
    .from("payments")
    .select("application_id")
    .eq("stripe_payment_intent_id", charge.payment_intent as string)
    .single();

  if (payment?.application_id) {
    await supabaseAdmin
      .from("job_applications")
      .update({
        is_paid: false,
        // ✅ OPTIONAL: Keep the letter or delete it
        // generated_letter: null,  // Uncomment to delete on refund
      })
      .eq("id", payment.application_id);

    await supabaseAdmin
      .from("payments")
      .update({ status: "refunded" })
      .eq("application_id", payment.application_id);

    console.log(`🔒 Access revoked for application: ${payment.application_id}`);
  }
}