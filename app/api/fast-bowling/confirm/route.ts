import { createHmac, timingSafeEqual } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { Resend } from "resend";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] || character
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      razorpay_payment_id?: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const paymentId = body.razorpay_payment_id;
    const orderId = body.razorpay_order_id;
    const signature = body.razorpay_signature;

    if (
      !name ||
      !email ||
      !emailPattern.test(email) ||
      !paymentId ||
      !orderId ||
      !signature
    ) {
      return NextResponse.json({ error: "Invalid payment confirmation." }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment verification is not configured." }, { status: 503 });
    }

    const expectedSignature = createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    if (!signaturesMatch(expectedSignature, signature)) {
      return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.fetch(orderId);
    let payment = await razorpay.payments.fetch(paymentId);

    const orderEmail = String(order.notes?.customer_email ?? "").toLowerCase();
    const orderName = String(order.notes?.customer_name ?? "");
    const orderProduct = String(order.notes?.product ?? "");

    if (
      payment.order_id !== orderId ||
      orderEmail !== email ||
      orderName !== name ||
      orderProduct !== "fast_bowling_strength_conditioning" ||
      Number(payment.amount) !== Number(order.amount) ||
      payment.currency !== order.currency
    ) {
      return NextResponse.json({ error: "Payment details do not match the order." }, { status: 400 });
    }

    if (payment.status === "authorized") {
      payment = await razorpay.payments.capture(
        paymentId,
        Number(payment.amount),
        payment.currency
      );
    }

    if (payment.status !== "captured") {
      return NextResponse.json(
        { error: "The payment has not been captured yet. Please contact us with your payment ID." },
        { status: 409 }
      );
    }

    if (
      String(payment.notes?.delivery_status ?? "") === "emailed" &&
      String(payment.notes?.delivered_to ?? "").toLowerCase() === email
    ) {
      return NextResponse.json({ delivered: true, alreadyDelivered: true });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom =
      process.env.PROGRAM_EMAIL_FROM ??
      "Be An Athlete <programs@beanathlete.in>";

    if (!resendApiKey || !emailFrom) {
      return NextResponse.json(
        {
          error:
            "Payment is confirmed, but email delivery is not configured. Please contact us with your payment ID.",
        },
        { status: 503 }
      );
    }

    const programmeDirectory = path.join(
      process.cwd(),
      "private",
      "programs",
      "fast-bowling"
    );

    const strengthPlan = await readFile(
      path.join(
        programmeDirectory,
        "FAST BOWLER STRENGTH PLAN (BE AN ATHLETE).pdf"
      )
    );
    const conditioningPlan = await readFile(
      path.join(
        programmeDirectory,
        "FAST BOWLER CONDITIONING PLAN (BE AN ATHLETE).pdf"
      )
    );

    const resend = new Resend(resendApiKey);
    const { error: emailError } = await resend.emails.send({
      from: emailFrom,
      to: [email],
      subject: "Your Fast Bowling Strength & Conditioning Programme",
      text: `Hi ${name},\n\nThank you for your purchase. Your Fast Bowling Strength & Conditioning Programme is attached to this email.\n\nTrain with purpose,\nCoach Hitesh Sharma\nBe An Athlete`,
      html: `<p>Hi ${escapeHtml(name)},</p><p>Thank you for your purchase. Your <strong>Fast Bowling Strength &amp; Conditioning Programme</strong> is attached to this email.</p><p>Train with purpose,<br />Coach Hitesh Sharma<br />Be An Athlete</p>`,
      attachments: [
        {
          filename: "Fast Bowler Strength Plan - Be An Athlete.pdf",
          content: strengthPlan,
        },
        {
          filename: "Fast Bowler Conditioning Plan - Be An Athlete.pdf",
          content: conditioningPlan,
        },
      ],
    }, {
      idempotencyKey: `fast-bowling-${paymentId}`,
    });

    if (emailError) {
      throw new Error(`Resend delivery failed: ${emailError.message}`);
    }

    try {
      await razorpay.payments.edit(paymentId, {
        notes: {
          ...payment.notes,
          delivery_status: "emailed",
          delivered_to: email,
          delivered_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Programme was emailed, but the delivery marker could not be saved", error);
    }

    return NextResponse.json({ delivered: true });
  } catch (error) {
    console.error("Unable to confirm payment or deliver programme", error);
    return NextResponse.json(
      {
        error:
          "Payment confirmation or email delivery failed. Please contact us with your payment ID.",
      },
      { status: 500 }
    );
  }
}
