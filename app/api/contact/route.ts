import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      message?: string;
      website?: string;
    };

    // A hidden field catches simple form bots without affecting real visitors.
    if (body.website) {
      return NextResponse.json({ sent: true });
    }

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const message = body.message?.trim();

    if (!name || name.length < 2 || name.length > 80) {
      return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
    }
    if (!email || !emailPattern.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (!message || message.length < 10 || message.length > 3000) {
      return NextResponse.json(
        { error: "Please enter a message between 10 and 3,000 characters." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom =
      process.env.PROGRAM_EMAIL_FROM ??
      "Be An Athlete <programs@beanathlete.in>";
    const emailTo =
      process.env.CONTACT_EMAIL_TO ?? "hiteshjangid1201@gmail.com";

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Email delivery is temporarily unavailable." },
        { status: 503 }
      );
    }

    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: emailFrom,
      to: [emailTo],
      replyTo: email,
      subject: `Website enquiry from ${name}`,
      text: `New website enquiry\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<h2>New website enquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
    });

    if (error) {
      throw new Error(`Resend delivery failed: ${error.message}`);
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Unable to deliver contact enquiry", error);
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again." },
      { status: 500 }
    );
  }
}
