import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";
import { randomUUID } from "crypto";
import { FormData, MAX_PRODUCTS } from "@/lib/types";
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

// Locate our own row by its unique token and compute the sequential form ID.
// We identify our row via a UUID token written into column A during the append
// (instead of trusting append's reported row number, which is unreliable under
// concurrent appends). The sequence is the count of prefix-matching rows up to
// and including our row, so it increments correctly and never collides.
async function resolveFormId(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auth: any,
  sheetId: string,
  token: string,
  prefix: string
): Promise<{ formId: string; rowNum: number }> {
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "'Form_Responses'!A:A",
  });

  const values = res.data.values || [];

  // Find our row by the unique token.
  let rowNum = -1;
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === token) {
      rowNum = i + 1; // 1-based row number
      break;
    }
  }

  if (rowNum === -1) {
    throw new Error("Could not locate appended row by token");
  }

  // Count prefix-matching rows (finalized IDs and pending tokens) up to and
  // including our row to determine our sequence number.
  let count = 0;
  for (let i = 0; i < rowNum; i++) {
    const val = values[i][0];
    if (typeof val === "string" && val.startsWith(prefix)) {
      count++;
    }
  }

  const seq = count.toString().padStart(2, "0");
  return { formId: `${prefix}${seq}`, rowNum };
}

function flattenProducts(products: FormData["products"]): string[] {
  const fields: string[] = [];
  for (let i = 0; i < MAX_PRODUCTS; i++) {
    const p = products[i];
    if (p) {
      fields.push(
        p.modelDetails,
        p.stamp,
        p.accessories.join(", "),
        p.receiptType === "沒有" || p.receiptType === "None"
          ? p.receiptNoneDetails?.trim()
            ? `${p.receiptType} (${p.receiptNoneDetails.trim()})`
            : p.receiptType
          : p.receiptType,
        p.receiptCountry,
        p.receiptDate,
        p.condition,
        p.conditionDetails.join(", "),
        p.otherNotes,
        p.consignmentPrice,
        p.directBuyPrice
      );
    } else {
      fields.push("", "", "", "", "", "", "", "", "", "", "");
    }
  }
  return fields;
}

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json();

    if (!body.products?.length) {
      return NextResponse.json(
        { error: "At least one product is required" },
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

    const productFields = flattenProducts(body.products);

    // Write a unique, prefix-bearing token into column A during the append so we
    // can reliably locate our own row afterwards (append's reported row number is
    // unreliable under concurrent submissions). The token starts with the date
    // prefix so it is counted toward the sequence.
    const prefix = getHKDatePrefix();
    const token = `${prefix}#${randomUUID()}`;

    const row = [
      token,                                        // A: 表格編號 (temporary token, replaced below)
      timestamp,                                    // B: 時間戳記
      body.email,                                   // C: 電郵地址
      body.customer.name,                           // D: 姓名
      body.customer.phone,                          // E: 電話
      formattedDate,                                // F: 日期
      ...productFields,                             // G-GD: p1-p20 (11 fields x 20 products = 220 cols)
      body.customer.agreement ? "I Agree" : "",     // GE: agreement
      signatureUrl,                                 // GF: signature_url
      imageFormula,                                 // GG: signature_preview
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

    // Locate our row by token and compute the sequential form ID.
    const { formId, rowNum } = await resolveFormId(auth, sheetId, token, prefix);

    // Replace the temporary token with the final form ID.
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `'Form_Responses'!A${rowNum}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[formId]],
      },
    });

    console.log(`Form submitted: row=${rowNum}, formId=${formId}`);

    return NextResponse.json({ success: true, formId });
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
