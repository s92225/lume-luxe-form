# LUME LUXE Consignment Agreement Form 
  
Online consignment agreement form with digital signature capability for LUME LUXE. Submissions are stored in Google Sheets with signature images uploaded to Google Drive.

## Features

- Multi-step form (Email → Products → Customer Info)
- Dynamic product entries (up to 4 products)
- Digital signature pad
- Google Sheets integration (one row per product)
- Signature images stored in Google Drive with `=IMAGE()` formula in sheet
- Lovable design system (warm, modern UI)

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **TailwindCSS** + shadcn/ui
- **react-signature-canvas** for signature capture
- **googleapis** for Google Sheets & Drive API

## Setup

### 1. Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or use existing)
3. Enable **Google Sheets API** and **Google Drive API**
4. Create a Service Account → download JSON key
5. Share your Google Sheet with the service account email (Editor access)
6. Create a Google Drive folder for signatures → share with service account email (Editor access)

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1YE-TTZKWToIo5Ubr0YZR1ycbwX3ZNvERQWcjcMyeXXA
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
```

### 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

## Google Sheet Column Mapping (A–Y)

| Col | Field |
|-----|-------|
| A | 時間戳記 |
| B | 電郵地址 |
| C | 型號／尺寸／顏色／皮質／金屬／刻印 #1 |
| D | 配件 #1 |
| E | 其他 #1 [收據] |
| F | 商品狀況 #1 |
| G | 商品狀況-2 #1 |
| H | 其他: #1 |
| I | 寄賣種類 #1 |
| J | 報價 #1 |
| K | (empty) |
| L | 姓名 |
| M | 電話 |
| N | 日期 |
| O | I Agree |
| P–V | (empty) |
| W | Stamp #1 |
| X | (empty) |
| Y | Signature (=IMAGE formula) |
