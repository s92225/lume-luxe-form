import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "OAuth credentials not configured" },
      { status: 500 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "http://localhost:3000/api/auth/callback"
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    return new NextResponse(
      `
      <html>
        <head><title>Authorization Successful</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1>✓ 授權成功！</h1>
          <p>請將以下 Refresh Token 複製到 <code>.env.local</code> 文件中：</p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; word-break: break-all; margin: 16px 0;">
            <strong>GOOGLE_REFRESH_TOKEN=</strong><br/>
            <code>${tokens.refresh_token}</code>
          </div>
          <p style="color: #666;">完成後即可關閉此頁面。此步驟只需執行一次。</p>
          <p style="color: #666;">Access Token (for reference, not needed in env):</p>
          <code style="font-size: 12px; color: #999;">${tokens.access_token?.substring(0, 30)}...</code>
        </body>
      </html>
      `,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Failed to exchange code for tokens" },
      { status: 500 }
    );
  }
}
