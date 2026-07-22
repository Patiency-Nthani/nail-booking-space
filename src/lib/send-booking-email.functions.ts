import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  service: z.string().min(1),
  bookingDate: z.string().min(1),
  bookingTime: z.string().min(1),
});

const NOTIFY_TO = "patiencenthani936@gmail.com";

export const sendBookingEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      console.error("Missing LOVABLE_API_KEY or RESEND_API_KEY");
      return { ok: false as const, error: "email_not_configured" };
    }

    const subject = `New Booking: ${data.name} — ${data.service}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
        <h2 style="margin: 0 0 16px;">New Appointment Booking</h2>
        <p style="margin: 0 0 16px; color: #555;">A new booking was submitted on PTheNailTech's Space.</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #888;">Name</td><td style="padding: 8px 0;"><strong>${data.name}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Phone</td><td style="padding: 8px 0;">${data.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Service</td><td style="padding: 8px 0;">${data.service}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Date</td><td style="padding: 8px 0;">${data.bookingDate}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Time</td><td style="padding: 8px 0;">${data.bookingTime}</td></tr>
        </table>
      </div>
    `;

    const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "PTheNailTech <onboarding@resend.dev>",
        to: [NOTIFY_TO],
        reply_to: data.email,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Resend send failed [${response.status}]: ${body}`);
      return { ok: false as const, error: `resend_${response.status}` };
    }

    return { ok: true as const };
  });
