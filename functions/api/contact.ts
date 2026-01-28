import { Resend } from "resend";

const json = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });

const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    if (!env.RESEND_API_KEY) {
      return json({ ok: false, error: "Missing RESEND_API_KEY" }, 500);
    }

    let data: any;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON body" }, 400);
    }

    const name = String(data?.name ?? "").trim();
    const email = String(data?.email ?? "")
      .trim()
      .toLowerCase();
    const message = String(data?.message ?? "").trim();

    if (!name || !email || !message) {
      return json({ ok: false, error: "Missing fields" }, 400);
    }

    if (!isEmail(email)) {
      return json({ ok: false, error: "Invalid email" }, 400);
    }

    // Basic anti-abuse limits (optional but good)
    if (name.length > 80 || email.length > 120 || message.length > 3000) {
      return json({ ok: false, error: "Input too long" }, 400);
    }

    const resend = new Resend(env.RESEND_API_KEY);

    // 1) Email to Pixxivo inbox
    await resend.emails.send({
      from: "Pixxivo <contact@pixxivo.com>",
      to: ["contact@pixxivo.com"],
      replyTo: email, // ✅ correct field for Resend
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
    });

    // 2) Auto-reply to user
    await resend.emails.send({
      from: "Pixxivo <contact@pixxivo.com>",
      to: [email],
      subject: "Thanks for contacting Pixxivo",
      text:
        `Hi ${name},\n\n` +
        `Thanks for reaching out to Pixxivo.\n\n` +
        `We’ve received your message and will get back to you shortly.\n\n` +
        `— Pixxivo\nhttps://pixxivo.com\n`,
    });

    return json({ ok: true }, 200);
  } catch (err: any) {
    return json({ ok: false, error: "Server error" }, 500);
  }
};
