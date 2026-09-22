"use client";

import { FormEvent, useState } from "react";

type CheckoutResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string };
  theme: { color: string };
  handler: (response: RazorpaySuccess) => Promise<void>;
  modal: { ondismiss: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

function loadRazorpayCheckout() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function FastBowlingPurchase() {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function startCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setSuccess(false);
    setMessage("Preparing secure checkout...");

    try {
      const checkoutReady = await loadRazorpayCheckout();
      if (!checkoutReady || !window.Razorpay) {
        throw new Error("Unable to load Razorpay Checkout. Please try again.");
      }

      const orderResponse = await fetch("/api/fast-bowling/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Unable to create the payment order.");
      }

      const order = orderData as CheckoutResponse;
      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Be An Athlete",
        description: "Fast Bowling - Strength & Conditioning Programme",
        order_id: order.orderId,
        prefill: { name, email },
        theme: { color: "#F5C400" },
        handler: async (payment) => {
          setMessage("Payment received. Verifying and emailing your programme...");

          const confirmationResponse = await fetch("/api/fast-bowling/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payment, name, email }),
          });
          const confirmation = await confirmationResponse.json();

          if (!confirmationResponse.ok) {
            setBusy(false);
            setMessage(
              confirmation.error ||
                "Payment was received, but email delivery needs attention. Please contact us with your payment ID."
            );
            return;
          }

          setSuccess(true);
          setBusy(false);
          setMessage(`Payment confirmed. The programme has been sent to ${email}.`);
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            setMessage("Checkout closed. No programme has been sent.");
          },
        },
      });

      setMessage("Complete your payment in the secure Razorpay window.");
      razorpay.open();
    } catch (error) {
      setBusy(false);
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <div className="mt-12 border border-bolt/30 bg-ink p-6 md:p-8">
      <p className="mb-2 font-body text-xs font-bold uppercase tracking-widest2 text-bolt">
        Complete Digital Programme
      </p>
      <h2 className="font-display text-2xl text-chalk sm:text-3xl">
        Fast Bowling - Strength &amp; Conditioning Programme
      </h2>
      <p className="mt-4 max-w-3xl font-body leading-relaxed text-steel">
        Get the complete strength and conditioning plans with exercise
        demonstrations, instructions, progressions, and structured weekly
        training. After successful payment, both PDFs are sent to your email.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3 font-body">
        <span className="text-lg text-steel line-through">₹10,000</span>
        <span className="font-display text-3xl text-bolt">₹7,499</span>
        <span className="rounded-sm bg-bolt/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-bolt">
          25% Off
        </span>
      </div>

      {!formOpen ? (
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="mt-6 rounded-sm bg-bolt px-7 py-4 font-body text-xs font-bold uppercase tracking-widest text-ink transition-transform hover:scale-[1.02]"
        >
          Get The Training Programme
        </button>
      ) : (
        <form onSubmit={startCheckout} className="mt-7 grid gap-4 md:grid-cols-2">
          <label className="font-body text-xs font-bold uppercase tracking-widest text-chalk">
            Name
            <input
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full border border-white/20 bg-charcoal px-4 py-3 text-base font-normal normal-case tracking-normal text-chalk outline-none transition-colors focus:border-bolt"
            />
          </label>
          <label className="font-body text-xs font-bold uppercase tracking-widest text-chalk">
            Email
            <input
              required
              type="email"
              maxLength={254}
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full border border-white/20 bg-charcoal px-4 py-3 text-base font-normal normal-case tracking-normal text-chalk outline-none transition-colors focus:border-bolt"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-sm bg-bolt px-7 py-4 font-body text-xs font-bold uppercase tracking-widest text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Processing..." : "Continue To Secure Payment"}
            </button>
            <p className="mt-3 font-body text-xs leading-relaxed text-steel">
              The price is shown in Razorpay Checkout. Your programme is emailed
              only after the payment is verified and captured.
            </p>
          </div>
        </form>
      )}

      {message && (
        <p
          role="status"
          className={`mt-5 font-body text-sm ${success ? "text-bolt" : "text-steel"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
