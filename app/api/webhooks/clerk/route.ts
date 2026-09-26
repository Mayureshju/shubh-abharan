import { NextResponse, type NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { connectDb } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models";
import { roleFromMetadata } from "@/lib/auth/roles";

export async function POST(request: NextRequest) {
  if (!process.env.CLERK_WEBHOOK_SECRET && !process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
  }
  try {
    const event = await verifyWebhook(request);
    if (event.type === "user.created" || event.type === "user.updated") {
      const user = event.data;
      await connectDb();
      await UserModel.findOneAndUpdate(
        { clerkUserId: user.id },
        {
          $set: {
            clerkUserId: user.id,
            email: user.email_addresses?.[0]?.email_address,
            name: [user.first_name, user.last_name].filter(Boolean).join(" ") || undefined,
            role: roleFromMetadata((user.public_metadata ?? {}) as Record<string, unknown>),
          },
        },
        { upsert: true },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
