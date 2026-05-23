import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getOAuth2Client } from "@/lib/google-auth";

function getHKDatePrefix(): string {
  const now = new Date();
  const hk = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
  const yy = hk.getFullYear().toString();
  const mm = (hk.getMonth() + 1).toString().padStart(2, "0");
  const dd = hk.getDate().toString().padStart(2, "0");
  return `S${yy}${mm}${dd}`;
}

export async function GET() {
  try {
    const auth = getOAuth2Client();
    const sheets = google.sheets({ version: "v4", auth });
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!sheetId) {
      throw new Error("GOOGLE_SHEET_ID not configured");
    }

    const prefix = getHKDatePrefix();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "'Form_Responses'!A:A",
    });

    const values = res.data.values || [];
    let count = 0;
    for (const row of values) {
      if (row[0] && typeof row[0] === "string" && row[0].startsWith(prefix)) {
        count++;
      }
    }

    const seq = (count + 1).toString().padStart(2, "0");
    const formId = `${prefix}${seq}`;

    return NextResponse.json({ formId });
  } catch (error) {
    console.error("Form ID generation error:", error);
    return NextResponse.json({ formId: "" }, { status: 500 });
  }
}
