import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";
import { FormData } from "@/lib/types";
import { getOAuth2Client } from "@/lib/google-auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function uploadSignatureToDrive(
  auth: any,
  base64Data: string,
  fileName: string
): Promise<string> {
  const drive = google.drive({ version: "v3", auth });
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const base64Content = base64Data.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64Content, "base64");

  const fileMetadata: { name: string; mimeType: string; parents?: string[] } = {
    name: fileName,
    mimeType: "image/png",
  };

  if (folderId) {
    fileMetadata.parents = [folderId];
  }

  const media = {
    mimeType: "image/png",
    body: Readable.from(buffer),
  };

  const file = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });

  const fileId = file.data.id;

  if (!fileId) {
    throw new Error("Failed to upload signature");
  }

  await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

function formatTimestamp(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Hong_Kong",
  };
  return now.toLocaleString("zh-HK", options);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Hong_Kong",
  };
  return date.toLocaleString("zh-HK", options);
}

function getHKDatePrefix(): string {
  const now = new Date();
  const hk = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
  const yy = hk.getFullYear().toString();
  const mm = (hk.getMonth() + 1).toString().padStart(2, "0");
  const dd = hk.getDate().toString().padStart(2, "0");
  return `S${yy}${mm}${dd}`;
}

async function generateFormId(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auth: any,
  sheetId: string
): Promise<string> {
  const sheets = google.sheets({ version: "v4", auth });
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
  return `${prefix}${seq}`;
}

function flattenProducts(products: FormData["products"]): string[] {
  const fields: string[] = [];
  for (let i = 0; i < 4; i++) {
    const p = products[i];
    if (p) {
      fields.push(
        p.modelDetails,
        p.stamp,
        p.accessories.join(", "),
        p.receiptType,
        p.condition,
        p.conditionDetails.join(", "),
        p.otherNotes,
        p.consignmentPrice,
        p.directBuyPrice
      );
    } else {
      fields.push("", "", "", "", "", "", "", "", "");
    }
  }
  return fields;
}

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json();

    if (!body.email || !body.products?.length || !body.customer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!body.customer.name || !body.customer.phone || !body.customer.date) {
      return NextResponse.json(
        { error: "Missing customer information" },
        { status: 400 }
      );
    }

    if (!body.customer.signatureDataUrl) {
      return NextResponse.json(
        { error: "Signature is required" },
        { status: 400 }
      );
    }

    const auth = getOAuth2Client();

    const signatureUrl = await uploadSignatureToDrive(
      auth,
      body.customer.signatureDataUrl,
      `signature_${body.customer.name}_${Date.now()}.png`
    );

    const sheets = google.sheets({ version: "v4", auth });
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!sheetId) {
      throw new Error("GOOGLE_SHEET_ID not configured");
    }

    const timestamp = formatTimestamp();
    const formattedDate = formatDate(body.customer.date);
    const imageFormula = `=IMAGE("${signatureUrl}")`;
    const formId = await generateFormId(auth, sheetId);

    const productFields = flattenProducts(body.products);

    const row = [
      formId,                                       // A: 表格編號
      timestamp,                                    // B: 時間戳記
      body.email,                                   // C: 電郵地址
      body.customer.name,                           // D: 姓名
      body.customer.phone,                          // E: 電話
      formattedDate,                                // F: 日期
      ...productFields,                             // G-AP: p1-p4 (9 fields x 4 products = 36 cols)
      body.customer.agreement ? "I Agree" : "",     // AQ: agreement
      signatureUrl,                                 // AR: signature_url
      imageFormula,                                 // AS: signature_preview
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "'Form_Responses'!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
