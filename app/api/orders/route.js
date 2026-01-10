import { NextResponse } from "next/server";
import { google } from "googleapis";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail) throw new Error("Missing GOOGLE_CLIENT_EMAIL env var");
    if (!privateKey) throw new Error("Missing GOOGLE_PRIVATE_KEY env var");

    const auth = new google.auth.JWT(
      clientEmail,
      null,
      privateKey.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const createdAt = new Date().toISOString();
    const orderId = crypto.randomUUID();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:F",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            createdAt,
            orderId,
            body.name,
            body.email,
            JSON.stringify(body.items),
            body.lockAt,
          ],
        ],
      },
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
