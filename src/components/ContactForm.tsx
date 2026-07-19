"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, brandStages, type ContactFormValues } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/Magnetic";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-warm-white px-3 py-2 text-sm text-soil placeholder:text-foreground-secondary/60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-state-focus";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      reset();
    } catch {
      setServerError("Couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-state-success/40 bg-state-success/10 p-6">
        <p className="font-display text-xl font-semibold text-soil">Thank you, that&apos;s in.</p>
        <p className="mt-2 text-sm text-foreground-secondary">
          I read every enquiry personally and reply within a few days. If it&apos;s
          urgent, feel free to email directly too.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot — hidden from real users, visible to bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("company_website")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register("email")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone (optional)" error={errors.phone?.message}>
          <input className={inputClass} {...register("phone")} />
        </Field>
        <Field label="Business or brand name" error={errors.business?.message}>
          <input className={inputClass} {...register("business")} />
        </Field>
      </div>

      <Field label="Website or social link (optional)" error={errors.website?.message}>
        <input className={inputClass} {...register("website")} />
      </Field>

      <Field label="Where is your brand right now?" error={errors.brandStage?.message}>
        <select className={inputClass} defaultValue="" {...register("brandStage")}>
          <option value="" disabled>
            Choose the closest fit
          </option>
          {brandStages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </Field>

      <Field label="What do you think you need?" error={errors.servicesNeeded?.message}>
        <input className={inputClass} {...register("servicesNeeded")} placeholder="A rough idea is fine" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Estimated budget (optional)" error={errors.budget?.message}>
          <input className={inputClass} {...register("budget")} />
        </Field>
        <Field label="Desired timeline (optional)" error={errors.timeline?.message}>
          <input className={inputClass} {...register("timeline")} />
        </Field>
      </div>

      <Field label="Tell me about the project" error={errors.description?.message}>
        <textarea rows={5} className={inputClass} {...register("description")} />
      </Field>

      <Field label="How did you find Branding Tatva? (optional)" error={errors.referral?.message}>
        <input className={inputClass} {...register("referral")} />
      </Field>

      {status === "error" && serverError && (
        <p role="alert" className="text-sm text-state-error">
          {serverError}
        </p>
      )}

      <Magnetic className="inline-block">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={cn(
            "group/btn inline-flex items-center justify-center gap-1.5 rounded-full bg-action-primary px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-earth hover:bg-action-primary-hover hover:-translate-y-0.5 hover:shadow-elevation-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-state-focus focus-visible:ring-offset-2 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          )}
        >
          {status === "submitting" ? "Sending…" : "Send enquiry"}
          {status !== "submitting" && (
            <span
              aria-hidden="true"
              className="inline-block -translate-x-1 opacity-0 transition-all duration-300 ease-earth group-hover/btn:translate-x-0 group-hover/btn:opacity-100"
            >
              &rarr;
            </span>
          )}
        </button>
      </Magnetic>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-soil">
      {label}
      {children}
      {error && (
        <span className="mt-1 block text-xs font-normal text-state-error">{error}</span>
      )}
    </label>
  );
}
