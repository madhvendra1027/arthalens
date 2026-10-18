import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// Anti-abuse: In-memory IP rate limiter (5 submissions per 10 minutes per IP)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
  if (process.env.NODE_ENV === "development" && (ip === "127.0.0.1" || ip === "::1" || ip === "localhost")) {
    return false;
  }
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 10 * 60 * 1000 });
    return false;
  }

  if (record.count >= 5) {
    return true;
  }

  record.count += 1;
  return false;
}

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please provide a valid email address").max(120),
  organization: z.string().trim().max(120).optional().default(""),
  inquiryType: z.string().default("research"),
  subject: z.string().trim().min(4, "Subject must be at least 4 characters").max(150),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(3000),
  website: z.string().max(0, "Automated submission rejected").optional().default(""),
  _botCheck: z.string().max(0, "Automated submission rejected").optional().default(""),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: "Too many contact requests from this address. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = ContactSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues?.[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = result.data;

    // Header injection prevention: remove line breaks from subject and name
    const sanitizedSubject = data.subject.replace(/[\r\n]/g, " ");
    const sanitizedName = data.name.replace(/[\r\n]/g, " ");

    const destinationEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "governance@arthalens.org";

    // Diagnostic server-side event log (safeguarding user credentials, zero password/token capture)
    console.log(
      `[Contact Inquiry Received] From: "${sanitizedName}" <${data.email}> | Org: "${data.organization}" | Type: ${data.inquiryType} | Subject: "${sanitizedSubject}" -> Target: ${destinationEmail}`
    );

    // If an external webhook is configured by the owner, dispatch safely
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: sanitizedName,
            email: data.email,
            organization: data.organization,
            inquiryType: data.inquiryType,
            subject: sanitizedSubject,
            message: data.message,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookErr) {
        console.error("[Contact Webhook Notification Failed]", webhookErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been submitted successfully to the ArthaLens governance team.",
        inquiryId: Math.random().toString(36).substring(2, 10).toUpperCase(),
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    console.error("[Contact Form Internal Error]", errorMsg);
    return NextResponse.json(
      { error: "An unexpected error occurred while transmitting your inquiry. Please try again." },
      { status: 500 }
    );
  }
}
