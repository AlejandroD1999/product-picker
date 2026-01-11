import { Resend } from "resend";
import { NextResponse } from "next/server";
import { google } from "googleapis";
import crypto from "crypto";

export const runtime = "nodejs";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail) throw new Error("Missing GOOGLE_CLIENT_EMAIL env var");
    if (!privateKey) throw new Error("Missing GOOGLE_PRIVATE_KEY env var");
    if (!spreadsheetId) throw new Error("Missing GOOGLE_SHEET_ID env var");

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    
    await auth.authorize();

    const sheets = google.sheets({ version: "v4", auth });

    const createdAt = new Date().toISOString();
    const orderId = crypto.randomUUID();
function getItem(items, key) {
  if (!items) return { qty: "", size: "", color: "" };

  const item = items[key];
  return {
    qty: item?.qty ?? "",
    size: item?.size ?? "",
    color: item?.color ?? ""
  };
}
const p1 = getItem(body.items, "p1");
const p2 = getItem(body.items, "p2");
const p3 = getItem(body.items, "p3");
const p4 = getItem(body.items, "p4");
await sheets.spreadsheets.values.append({
  spreadsheetId,
  range: "Sheet1!A:Q",
  valueInputOption: "RAW",
  requestBody: {
    values: [[
      createdAt,
      orderId,
      body.name,
      body.email,

      p1.qty, p1.size, p1.color,
      p2.qty, p2.size, p2.color,
      p3.qty, p3.size, p3.color,
      p4.qty, p4.size, p4.color,

      body.lockAt
    ]]
  }
});


await resend.emails.send({
  from: process.env.FROM_EMAIL || "Bronco Swag Gear <onboarding@resend.dev>",
  to: body.email,
  subject: "MRF-D 26.3 Merch - Order Received",
  html: `
    <h2>Order Confirmed</h2>
    <p>Thanks <strong>${body.name}</strong>,</p>
    <p>Your merch request has been received.</p>

    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Lock Date:</strong> ${body.lockDate}</p>

    <hr />
    <p>You may edit your order until the lock date.</p>
    <p>Bronco Swag Gear</p>
  `,
});


    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
