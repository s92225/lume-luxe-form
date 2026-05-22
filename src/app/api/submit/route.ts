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

    const rows = body.products.map((product) => [
      timestamp,                                    // A: 時間戳記
      body.email,                                   // B: 電郵地址
      product.modelDetails,                         // C: 型號／尺寸／顏色／皮質／金屬／刻印 #1
      product.accessories.join(", "),               // D: 配件 #1
      product.receiptType,                          // E: 其他 #1 [收據]
      product.condition,                            // F: 商品狀況 #1
      product.conditionDetails.join(", "),          // G: 商品狀況-2 #1
      product.otherNotes,                           // H: 其他: #1
      product.consignmentType,                      // I: 寄賣種類 #1
      product.price,                                // J: 報價 #1
      "",                                           // K: 型號／尺寸／顏色／皮質／金屬／刻印 #2 (empty)
      body.customer.name,                           // L: 姓名
      body.customer.phone,                          // M: 電話
      formattedDate,                                // N: 日期
      "I Agree",                                    // O: T&C Agreement
      "",                                           // P: 配件 #2 (empty)
      "",                                           // Q: 其他 #2 [收據] (empty)
      "",                                           // R: 商品狀況 #2 (empty)
      "",                                           // S: 商品狀況-2 #2 (empty)
      "",                                           // T: 其他: #2 (empty)
      "",                                           // U: 寄賣種類 #2 (empty)
      "",                                           // V: 報價 #2 (empty)
      product.stamp,                                // W: Stamp #1
      "",                                           // X: Stamp #2 (empty)
      signatureUrl,                                 // Y: Signature raw URL (for Make.com)
      imageFormula,                                 // Z: Signature preview (=IMAGE formula)
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "'Form response'!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: rows,
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
