"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const initial = { name: "", email: "", subject: "", message: "", company: "" };

export function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  function update(field: keyof typeof initial, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== "idle" && status !== "submitting") setStatus("idle");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (values.name.trim().length < 2) nextErrors.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (values.subject.trim().length < 2) nextErrors.subject = "Enter a subject.";
    if (values.message.trim().length < 10) {
      nextErrors.message = "Enter at least 10 characters.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setFeedback("Check the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setStatus("error");
        setFeedback(
          data.error ||
            "The message could not be delivered. Nothing was sent.",
        );
        return;
      }
      setStatus("success");
      setFeedback("Your message was delivered. I'll get back to you soon.");
      setValues(initial);
    } catch {
      setStatus("error");
      setFeedback(
        "The message could not be delivered. Check your connection and try again, or use email directly.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(event) => update("company", event.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="contact-name"
          label="Name"
          value={values.name}
          error={errors.name}
          autoComplete="name"
          onChange={(value) => update("name", value)}
        />
        <Field
          id="contact-email"
          label="Email"
          type="email"
          value={values.email}
          error={errors.email}
          autoComplete="email"
          onChange={(value) => update("email", value)}
        />
      </div>
      <Field
        id="contact-subject"
        label="Subject"
        value={values.subject}
        error={errors.subject}
        onChange={(value) => update("subject", value)}
      />
      <div>
        <label htmlFor="contact-message" className="text-sm text-slate-300">
          Message
        </label>
        <textarea
          id="contact-message"
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          rows={5}
          maxLength={4000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
        />
        {errors.message ? (
          <p id="contact-message-error" className="mt-1 text-sm text-rose-300">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          {status === "submitting" ? "Sending" : "Send message"}
        </Button>
        <a
          href={`mailto:${profile.email}`}
          className="text-sm text-cyan-100 underline-offset-4 hover:underline"
        >
          Or email directly
        </a>
      </div>
      <p className="text-xs leading-5 text-slate-400">
        A success message appears only after the server confirms the email was accepted for delivery.
      </p>
      <p
        role="status"
        aria-live="polite"
        className={
          status === "success"
            ? "text-sm text-emerald-300"
            : status === "error"
              ? "text-sm text-rose-300"
              : "text-sm text-slate-400"
        }
      >
        {feedback}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-slate-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        maxLength={type === "email" ? 120 : 80}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
