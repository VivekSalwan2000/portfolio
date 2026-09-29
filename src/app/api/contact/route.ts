import { NextResponse } from "next/server";
import { Resend } from "resend";
import { inquiryTypes, profile } from "@/lib/data";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = { name: 100, email: 200, note: 4000 };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, note, inquiry, company } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: a field real visitors never see or fill in (hidden in the
  // form's markup). Bots that blindly fill every input trip it; humans
  // never do. Silently pretend success so the bot doesn't learn to skip it.
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof note !== "string" ||
    typeof inquiry !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !note.trim()
  ) {
    return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > MAX_LEN.email) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  if (name.length > MAX_LEN.name || note.length > MAX_LEN.note) {
    return NextResponse.json({ error: "That message is too long." }, { status: 400 });
  }

  if (!inquiryTypes.includes(inquiry as (typeof inquiryTypes)[number])) {
    return NextResponse.json({ error: "Invalid inquiry type." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return NextResponse.json({ error: "Email sending isn't configured yet." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      // Deliberately separate from the publicly-displayed profile.email —
      // this is just where backend submissions get routed, which can be a
      // different inbox than the address shown/copied on the page.
      to: process.env.CONTACT_TO_EMAIL || profile.email,
      replyTo: email,
      subject: `[${inquiry}] Portfolio inquiry from ${name}`,
      text: `${note}\n\n— ${name}\n${email}`,
      html: `<p>${escapeHtml(note).replace(/\n/g, "<br />")}</p><p>— ${escapeHtml(name)}<br />${escapeHtml(email)}</p>`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Couldn't send that — try again in a moment." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return NextResponse.json({ error: "Couldn't send that — try again in a moment." }, { status: 500 });
  }
}
