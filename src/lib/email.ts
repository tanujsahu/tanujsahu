export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
}

export interface ContactResult {
  ok: boolean;
  error?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: ContactPayload) {
  const name = sanitize(input.name);
  const email = sanitize(input.email).toLowerCase();
  const subject = sanitize(input.subject);
  const message = sanitize(input.message);
  const company = sanitize(input.company ?? "");

  if (company) {
    return { ok: false as const, error: "Unable to send your message." };
  }
  if (name.length < 2 || name.length > 80) {
    return { ok: false as const, error: "Enter your name (2–80 characters)." };
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 120) {
    return { ok: false as const, error: "Enter a valid email address." };
  }
  if (subject.length < 2 || subject.length > 120) {
    return { ok: false as const, error: "Enter a subject (2–120 characters)." };
  }
  if (message.length < 10 || message.length > 4000) {
    return {
      ok: false as const,
      error: "Enter a message between 10 and 4000 characters.",
    };
  }

  return {
    ok: true as const,
    value: { name, email, subject, message },
  };
}

function sanitize(value: string) {
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

export async function sendContactEmail(message: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "tanujsahu09@gmail.com";

  if (!apiKey || !from) {
    return {
      ok: false,
      status: 503,
      error:
        "Email delivery is not configured on this server. Use the email address instead — your message was not sent.",
    };
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: message.email,
        subject: `Portfolio inquiry: ${message.subject}`,
        text: [
          `Name: ${message.name}`,
          `Email: ${message.email}`,
          "",
          message.message,
        ].join("\n"),
      }),
    });
  } catch {
    return {
      ok: false,
      status: 502,
      error:
        "The email service could not be reached. Nothing was delivered.",
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      status: 502,
      error:
        "The email service rejected the message. Nothing was delivered.",
    };
  }

  return { ok: true };
}
