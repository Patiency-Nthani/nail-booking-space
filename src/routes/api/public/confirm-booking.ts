import { createFileRoute } from "@tanstack/react-router";

function pageShell(title: string, body: string, accent = "#c2185b") {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title} — Luxe by Patience</title>
<style>
  body{font-family:Georgia,'Times New Roman',serif;background:#fff5f8;color:#3b1327;margin:0;padding:0;min-height:100vh;display:flex;align-items:center;justify-content:center}
  .card{background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(120,20,60,.12);padding:48px 40px;max-width:480px;width:calc(100% - 32px);text-align:center}
  h1{font-size:28px;margin:0 0 12px;color:${accent}}
  p{font-size:16px;line-height:1.55;color:#4a1f36;margin:0 0 8px}
  .brand{font-size:12px;letter-spacing:.25em;text-transform:uppercase;color:#a67086;margin-top:32px}
  a{color:${accent};font-weight:600}
</style></head><body><div class="card"><h1>${title}</h1>${body}<p class="brand">Luxe by Patience</p></div></body></html>`;
}

export const Route = createFileRoute("/api/public/confirm-booking")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");

        if (!token || !/^[0-9a-f-]{36}$/i.test(token)) {
          return new Response(
            pageShell("Invalid link", "<p>This confirmation link is not valid.</p>", "#a3324e"),
            { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
          );
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: booking, error: findErr } = await supabaseAdmin
          .from("bookings")
          .select("id, customer_name, customer_email, service, booking_date, booking_time, status")
          .eq("confirmation_token", token)
          .maybeSingle();

        if (findErr || !booking) {
          return new Response(
            pageShell("Booking not found", "<p>We couldn't find a booking for this link.</p>", "#a3324e"),
            { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } },
          );
        }

        if (booking.status !== "confirmed") {
          const { error: updateErr } = await supabaseAdmin
            .from("bookings")
            .update({ status: "confirmed" })
            .eq("id", booking.id);

          if (updateErr) {
            console.error("Failed to update booking status", updateErr);
            return new Response(
              pageShell("Something went wrong", "<p>Please try the link again in a moment.</p>", "#a3324e"),
              { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } },
            );
          }

          // Fire the customer confirmation email (best-effort)
          try {
            const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
            const RESEND_API_KEY = process.env.RESEND_API_KEY;
            if (LOVABLE_API_KEY && RESEND_API_KEY) {
              const html = `
                <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
                  <h2 style="margin: 0 0 12px; color: #c2185b;">Your appointment is confirmed ✨</h2>
                  <p style="margin: 0 0 16px; color: #555;">Hi ${booking.customer_name}, thank you for booking with Luxe by Patience. Your appointment is now confirmed.</p>
                  <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                    <tr><td style="padding: 8px 0; color: #888;">Service</td><td style="padding: 8px 0;"><strong>${booking.service}</strong></td></tr>
                    <tr><td style="padding: 8px 0; color: #888;">Date</td><td style="padding: 8px 0;">${booking.booking_date}</td></tr>
                    <tr><td style="padding: 8px 0; color: #888;">Time</td><td style="padding: 8px 0;">${booking.booking_time}</td></tr>
                    <tr><td style="padding: 8px 0; color: #888;">Location</td><td style="padding: 8px 0;">Salvation Army, Great North Road, Lusaka</td></tr>
                  </table>
                  <p style="color: #555; margin-top: 20px;">See you soon!<br/><em>Patience — PTheNailTech</em></p>
                </div>
              `;
              const resendRes = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${LOVABLE_API_KEY}`,
                  "X-Connection-Api-Key": RESEND_API_KEY,
                },
                body: JSON.stringify({
                  from: "Luxe by Patience <onboarding@resend.dev>",
                  to: [booking.customer_email],
                  reply_to: "patiencenthani936@gmail.com",
                  subject: `Your appointment is confirmed — ${booking.service}`,
                  html,
                }),
              });
              if (!resendRes.ok) {
                console.error("Customer confirmation email failed", resendRes.status, await resendRes.text());
              }
            }
          } catch (err) {
            console.error("Error sending customer confirmation email", err);
          }
        }

        return new Response(
          pageShell(
            "Booking confirmed",
            `<p><strong>${booking.customer_name}</strong> — ${booking.service}</p><p>${booking.booking_date} at ${booking.booking_time}</p><p style="margin-top:16px">A confirmation email has been sent to the client.</p>`,
          ),
          { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
        );
      },
    },
  },
});
