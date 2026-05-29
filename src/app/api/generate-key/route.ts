import { NextRequest, NextResponse } from "next/server";
import { createDocument, queryDocuments } from "@/lib/firestore-rest";

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email required" },
        { status: 400 }
      );
    }

    const allowedPlans = ["free", "basic", "pro", "enterprise"];
    const selectedPlan = allowedPlans.includes(plan) ? plan : "free";

    // Check if email already has a key
    const exists = await queryDocuments("FFAPIClients", "email", email);
    if (exists) {
      return NextResponse.json(
        { success: false, error: "Email already has an API key" },
        { status: 400 }
      );
    }

    // Generate unique API key using native crypto
    const randomPart = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
    const apiKey = `ff_${selectedPlan}_${randomPart}`;

    const created = await createDocument("FFAPIClients", apiKey, {
      apiKey: apiKey,
      plan: selectedPlan,
      email: email,
      isActive: true,
      requestsUsed: 0,
      lastRequests: [],
      createdAt: new Date().toISOString(),
    });

    if (created) {
      return NextResponse.json({ success: true, apiKey: apiKey });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to save key to database" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Key generation error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate key";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
