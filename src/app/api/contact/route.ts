import { NextResponse } from "next/server";
import { sendContactEmail, validateContact } from "@/lib/email";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function limited(address: string) {
  const now = Date.now();
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      const active = times.filter((time) => now - time < WINDOW_MS);
      if (active.length === 0) hits.delete(key);
      else hits.set(key, active);
    }
  }
  const recent = (hits.get(address) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(address, recent);
    return true;
  }
  recent.push(now);
  hits.set(address, recent);
  return false;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json(
          { ok: false, error: "Untrusted request origin." },
          { status: 403 },
        );
      }
    } catch {
      return NextResponse.json(
        { ok: false, error: "Untrusted request origin." },
        { status: 403 },
      );
    }
  }

  if (limited(clientAddress(request))) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many messages. Please wait a few minutes and try again.",
      },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    const text = await request.text();
    if (text.length > 20_000) {
      return NextResponse.json(
        { ok: false, error: "Message is too large." },
        { status: 413 },
      );
    }
    payload = JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const body = payload as Record<string, unknown>;
  const validated = validateContact({
    name: asString(body.name),
    email: asString(body.email),
    subject: asString(body.subject),
    message: asString(body.message),
    company: asString(body.company),
  });

  if (!validated.ok) {
    return NextResponse.json(
      { ok: false, error: validated.error },
      { status: 400 },
    );
  }

  const result = await sendContactEmail(validated.value);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ ok: true });
}
