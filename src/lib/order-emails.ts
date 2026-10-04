import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const OrderItemSchema = z.object({
  title: z.string(),
  qty: z.number(),
  price: z.number(),
  size: z.string().optional(),
  color: z.string().optional(),
});

const OrderEmailSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  items: z.array(OrderItemSchema),
  total: z.number(),
  shipping: z.object({
    name: z.string(),
    email: z.string(),
    address: z.string(),
    city: z.string(),
    phone: z.string(),
  }),
  payment: z.enum(["cod", "bank", "easypaisa"]),
});

// TODO: once you verify your own domain on Resend, change this to something
// like "SheikhStore <orders@sheikhstore.com>". Until then, Resend's shared
// test sender only allows sending to the email you signed up with.
const FROM_EMAIL = "SheikhStore <onboarding@resend.dev>";
const ADMIN_EMAIL = "shaikhsuffiyan22@gmail.com";

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  bank: "Bank Transfer",
  easypaisa: "Easypaisa",
};

function money(n: number): string {
  return `Rs ${n.toLocaleString("en-PK")}`;
}

function itemsHtml(items: z.infer<typeof OrderItemSchema>[]): string {
  return items
    .map((i) => {
      const variant = [i.size, i.color].filter(Boolean).join(", ");
      return `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #eee;">
          ${i.title} × ${i.qty}${variant ? ` (${variant})` : ""}
        </td>
        <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;">
          ${money(i.price * i.qty)}
        </td>
      </tr>`;
    })
    .join("");
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set on the server — skipping email send.");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    if (!res.ok) {
      console.error("Resend API error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Failed to reach Resend API:", err);
  }
}

export const sendOrderEmails = createServerFn({ method: "POST" })
  .validator(OrderEmailSchema)
  .handler(async ({ data: order }) => {
    const rows = itemsHtml(order.items);
    const paymentLabel = PAYMENT_LABELS[order.payment] ?? order.payment;

    // Customer confirmation
    await sendEmail(
      order.shipping.email,
      `Your SheikhStore order ${order.id} is confirmed`,
      `<div style="font-family:sans-serif;max-width:480px;margin:auto;color:#1a1a1a;">
        <h2>Thank you, ${order.shipping.name}!</h2>
        <p>Your order <strong>${order.id}</strong> has been placed successfully.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">${rows}</table>
        <p style="margin-top:14px;font-size:16px;"><strong>Total: ${money(order.total)}</strong></p>
        <p>Payment method: ${paymentLabel}</p>
        <p>Shipping to: ${order.shipping.address}, ${order.shipping.city}</p>
        <p style="margin-top:20px;">SheikhStore — Har Order Mein Bharosa ❤️</p>
      </div>`,
    );

    // Admin notification
    await sendEmail(
      ADMIN_EMAIL,
      `New order received — ${order.id}`,
      `<div style="font-family:sans-serif;max-width:480px;margin:auto;color:#1a1a1a;">
        <h2>New order: ${order.id}</h2>
        <p><strong>${order.shipping.name}</strong><br/>
          ${order.shipping.phone} · ${order.shipping.email}<br/>
          ${order.shipping.address}, ${order.shipping.city}
        </p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">${rows}</table>
        <p style="margin-top:14px;font-size:16px;">
          <strong>Total: ${money(order.total)}</strong> (${paymentLabel})
        </p>
      </div>`,
    );

    return { sent: true };
  });