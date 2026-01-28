import { Resend } from "resend";

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return new Response("Missing fields", { status: 400 });
    }

    const resend = new Resend(env.RESEND_API_KEY);

    // Email to Pixxivo
    await resend.emails.send({
      from: "Pixxivo <contact@pixxivo.com>",
      to: ["contact@pixxivo.com"],
      reply_to: email,
      subject: `New contact from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    // Auto-reply
    await resend.emails.send({
      from: "Pixxivo <contact@pixxivo.com>",
      to: [email],
      subject: "Thanks for contacting Pixxivo",
      text: `
Hi ${name},

Thanks for reaching out to Pixxivo.

We’ve received your message and will get back to you shortly.
We appreciate your interest in our work.

— Pixxivo
https://pixxivo.com
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
};
