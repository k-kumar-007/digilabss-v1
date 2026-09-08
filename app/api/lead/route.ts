import { NextResponse } from "next/server";
import { validateLead } from "@/lib/validateLead";
import type { LeadPayload } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dummy CRM sink.
 *
 * Submissions are recorded three ways so the data is verifiable wherever this
 * is running:
 *   1. structured server log (visible in `vercel logs` or the dev terminal);
 *   2. appended to a JSON Lines file on disk — `.data/leads.jsonl` locally,
 *      `/tmp` on serverless, where it is the only writable path;
 *   3. forwarded to LEAD_WEBHOOK_URL if set (Google Sheet, SheetDB, webhook.site).
 */

type StoredLead = LeadPayload & {
  id: string;
  receivedAt: string;
  source: string;
  userAgent: string;
};

/** Crude per-IP throttle. In-memory, so it resets on cold start — enough for a demo. */
const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

async function persistToDisk(lead: StoredLead) {
  try {
    const { appendFile, mkdir } = await import("node:fs/promises");
    const path = await import("node:path");

    // Serverless filesystems are read-only apart from /tmp.
    const dir = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "leads.jsonl"), `${JSON.stringify(lead)}\n`, "utf8");
    return true;
  } catch (error) {
    console.warn("[lead] disk write skipped:", (error as Error).message);
    return false;
  }
}

async function forwardToWebhook(lead: StoredLead) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return "not-configured" as const;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.LEAD_WEBHOOK_TOKEN
          ? { "x-api-key": process.env.LEAD_WEBHOOK_TOKEN }
          : {}),
      },
      body: JSON.stringify(lead),
      // Never let a slow CRM hold up the visitor's confirmation.
      signal: AbortSignal.timeout(4000),
    });

    return response.ok ? ("delivered" as const) : ("rejected" as const);
  } catch (error) {
    console.error("[lead] webhook failed:", (error as Error).message);
    return "failed" as const;
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: Partial<LeadPayload> & { website?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: a hidden field only a bot fills in. Answer 200 so it learns nothing.
  if (body.website) {
    console.warn("[lead] honeypot triggered from", ip);
    return NextResponse.json({ ok: true, id: "ignored" });
  }

  const errors = validateLead(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const lead: StoredLead = {
    id: `lead_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    receivedAt: new Date().toISOString(),
    name: body.name!.trim(),
    email: body.email!.trim().toLowerCase(),
    company: body.company!.trim(),
    budget: body.budget!,
    message: body.message?.trim() || undefined,
    source: request.headers.get("referer") ?? "direct",
    userAgent: request.headers.get("user-agent") ?? "unknown",
  };

  const [persisted, webhook] = await Promise.all([
    persistToDisk(lead),
    forwardToWebhook(lead),
  ]);

  console.info("[lead] captured", {
    id: lead.id,
    email: lead.email,
    company: lead.company,
    budget: lead.budget,
    persisted,
    webhook,
  });

  return NextResponse.json({ ok: true, id: lead.id, webhook });
}

/** Small convenience endpoint so stored leads can be eyeballed in development. */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 404 });
  }

  try {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.join(process.cwd(), ".data", "leads.jsonl");
    const contents = await readFile(file, "utf8");

    const leads = contents
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));

    return NextResponse.json({ ok: true, count: leads.length, leads });
  } catch {
    return NextResponse.json({ ok: true, count: 0, leads: [] });
  }
}
