import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { name, email } = (await request.json()) as {
      name?: string;
      email?: string;
    };

    const customerName = name?.trim();
    const customerEmail = email?.trim().toLowerCase();

    if (!customerName || customerName.length < 2 || customerName.length > 80) {
      return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
    }
    if (!customerEmail || !emailPattern.test(customerEmail) || customerEmail.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const price = Number(process.env.FAST_BOWLING_PROGRAM_PRICE_INR);
    const emailDeliveryConfigured = Boolean(process.env.RESEND_API_KEY);

    if (
      !keyId ||
      !keySecret ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !emailDeliveryConfigured
    ) {
      return NextResponse.json(
        {
          error:
            "Secure payment and email delivery are not configured yet. Please contact the coach.",
        },
        { status: 503 }
      );
    }

    const amount = Math.round(price * 100);
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `fast_bowling_${Date.now()}`,
      notes: {
        customer_name: customerName,
        customer_email: customerEmail,
        product: "fast_bowling_strength_conditioning",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    console.error("Unable to create Razorpay order", error);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 }
    );
  }
}
