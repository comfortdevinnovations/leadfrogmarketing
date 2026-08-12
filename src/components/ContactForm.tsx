"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { ArrowIcon } from "./icons";

const SERVICES = [
  "SEO & Content Marketing",
  "Paid Advertising (PPC)",
  "Social Media Marketing",
  "Email Marketing Automation",
  "Lead Nurturing & CRM Integration",
  "Not sure yet",
];

const inputClasses =
  "bg-white border-2 border-primary/15 focus:border-accent focus:outline-none px-4 py-3 rounded-xl w-full transition-colors placeholder:text-text/35";

type Status = "idle" | "submitting" | "success";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  }

  /**
   * Returns to a blank form. The success panel replaces the <form> entirely, so
   * the native inputs are unmounted and come back empty on their own — only the
   * service pills, which live in React state, need clearing by hand.
   */
  function resetForm() {
    setStatus("idle");
    setError(null);
    setSelectedServices([]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const data = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("your_name"),
          email: data.get("email"),
          phone: data.get("phone"),
          company: data.get("company"),
          message: data.get("message"),
          services: selectedServices,
          subject_ref: data.get("subject_ref"),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          result.error ?? "Something went wrong. Please try again."
        );
        setStatus("idle");
        return;
      }

      setStatus("success");
    } catch {
      setError(
        "We couldn't reach the server. Check your connection and try again."
      );
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      >
        <Image
          src="/lead-logo.png"
          alt="Lead Frog Marketing"
          width={200}
          height={200}
          className="h-20 w-20 object-contain"
        />
        <h3 className="font-heading font-black text-3xl text-primary">
          Message received.
        </h3>
        <p className="max-w-sm text-text/65">
          A strategist will reach out within one business day. Thanks for
          hopping our way.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/20 bg-white px-6 py-3 font-heading text-sm uppercase tracking-wider text-primary transition-colors duration-300 hover:border-accent hover:text-alt-primary"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot: hidden from people, irresistible to bots. A filled value
          gets the submission silently dropped server-side.

          Two constraints keep real submissions from tripping it. The field must
          not be `display: none`-adjacent-but-visible: off-screen positioning
          still reads as visible to browser autofill and password-manager
          fillers, which then populate it. And the name must not match an
          autofill category — anything url/website/email/phone/address-shaped
          gets filled on sight. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Subject reference
          <input
            type="text"
            name="subject_ref"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm text-text/70">
          Your Name
          <input
            required
            type="text"
            name="your_name"
            placeholder="John Doe"
            className={`${inputClasses} mt-2`}
          />
        </label>
        <label className="block text-sm text-text/70">
          Email Address
          <input
            required
            type="email"
            name="email"
            placeholder="john@company.com"
            className={`${inputClasses} mt-2`}
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm text-text/70">
          Phone Number{" "}
          <span className="text-text/40">(optional)</span>
          <input
            type="tel"
            name="phone"
            placeholder="(555) 123-4567"
            className={`${inputClasses} mt-2`}
          />
        </label>
        <label className="block text-sm text-text/70">
          Company
          <input
            type="text"
            name="company"
            placeholder="Company name"
            className={`${inputClasses} mt-2`}
          />
        </label>
      </div>

      <fieldset className="block text-sm text-text/70">
        <legend>Which service(s) are you interested in?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SERVICES.map((service) => {
            const isSelected = selectedServices.includes(service);
            return (
              <button
                key={service}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                onClick={() => toggleService(service)}
                className={`rounded-full border-2 px-4 py-2 text-sm transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-secondary"
                    : "border-primary/15 bg-white text-text/70 hover:border-accent"
                }`}
              >
                {service}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="block text-sm text-text/70">
        Tell us about your goals
        <textarea
          required
          name="message"
          rows={5}
          placeholder="What does growth need to look like for you this year?"
          className={`${inputClasses} mt-2 resize-none`}
        />
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-4 font-heading text-sm uppercase tracking-wider text-secondary transition-colors duration-300 hover:bg-alt-primary disabled:opacity-70 sm:w-auto"
      >
        <span
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-[glint-sweep_1s_ease]"
          aria-hidden="true"
        />
        {status === "submitting" ? "Sending..." : "Send Message"}
        <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </form>
  );
}
