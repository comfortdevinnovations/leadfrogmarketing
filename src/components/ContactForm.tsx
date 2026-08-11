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
          website: data.get("website"),
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
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <Image
          src="/green-logo.png"
          alt="Lead Frog Marketing"
          width={64}
          height={64}
          className="h-16 w-16 object-contain"
        />
        <h3 className="font-heading font-black text-3xl text-primary">
          Message received.
        </h3>
        <p className="max-w-sm text-text/65">
          A strategist will reach out within one business day. Thanks for
          hopping our way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot: hidden from people, irresistible to bots. A filled value
          gets the submission silently dropped server-side. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
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
