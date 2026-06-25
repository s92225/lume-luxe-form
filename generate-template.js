const {
  Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun,
  WidthType, AlignmentType, BorderStyle, HeadingLevel, ImageRun,
  PageOrientation, convertInchesToTwip, TableLayoutType,
  VerticalAlign, ShadingType
} = require("docx");
const fs = require("fs");

// Page: A4 portrait (Google Docs reliably honors portrait)
const PAGE_WIDTH_TWIPS = 11906; // A4 portrait width (8.27in)
const PAGE_HEIGHT_TWIPS = 16838; // A4 portrait height (11.69in)
const MARGIN = convertInchesToTwip(0.4);
const USABLE_WIDTH = PAGE_WIDTH_TWIPS - MARGIN * 2; // ~10754

// Font sizes (half-points)
const TITLE_SIZE = 24;    // 12pt
const HEADER_SIZE = 16;   // 8pt
const BODY_SIZE = 16;     // 8pt
const SMALL_SIZE = 14;    // 7pt
const TERMS_SIZE = 14;    // 7pt
const FOOTER_SIZE = 18;   // 9pt

const FONT = "Microsoft JhengHei"; // Good CJK font that won't split characters

// Thin borders
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const cellBorders = {
  top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder
};

// Column widths (in twips) - total ~10754 (A4 portrait minus 0.4in margins)
// #  | Model/Stamp | Accessories/Receipt | Condition/Other | Consign | Direct
const COL_WIDTHS = [400, 3200, 2200, 2554, 1200, 1200];
const TOTAL_TABLE_WIDTH = COL_WIDTHS.reduce((a, b) => a + b, 0);

function headerCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: cellBorders,
    shading: { type: ShadingType.SOLID, color: "E8E8E8" },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 20, after: 20 },
        children: [new TextRun({ text, bold: true, size: HEADER_SIZE, font: FONT })]
      })
    ]
  });
}

function bodyCell(text, width, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: cellBorders,
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 10, after: 10 },
        children: [new TextRun({
          text,
          size: opts.size || BODY_SIZE,
          font: FONT,
          bold: opts.bold || false
        })]
      })
    ]
  });
}

function multiLineCell(lines, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: cellBorders,
    verticalAlign: VerticalAlign.CENTER,
    children: lines.map(line =>
      new Paragraph({
        spacing: { before: 5, after: 5 },
        children: [new TextRun({ text: line.text, size: line.size || BODY_SIZE, font: FONT, bold: line.bold || false })]
      })
    )
  });
}

// Build product rows for p1-p20
function productRows() {
  const rows = [];
  for (let i = 1; i <= 20; i++) {
    const p = "p" + i + "_";
    rows.push(
      new TableRow({
        children: [
          // # column
          bodyCell(String(i), COL_WIDTHS[0], { center: true, bold: true }),
          // Model + Stamp
          multiLineCell([
            { text: "{{" + p + "model}}", size: BODY_SIZE },
            { text: "Stamp: {{" + p + "stamp}}", size: SMALL_SIZE }
          ], COL_WIDTHS[1]),
          // Accessories + Receipt
          multiLineCell([
            { text: "{{" + p + "accessories}}", size: BODY_SIZE },
            { text: "\u6536\u64da: {{" + p + "receipt_type}}", size: SMALL_SIZE }
          ], COL_WIDTHS[2]),
          // Condition + Other
          multiLineCell([
            { text: "{{" + p + "condition}}", size: BODY_SIZE },
            { text: "\u5176\u4ed6: {{" + p + "other}}", size: SMALL_SIZE }
          ], COL_WIDTHS[3]),
          // Consignment quote
          bodyCell("{{" + p + "consignment_quote}}", COL_WIDTHS[4], { center: true }),
          // Direct buy quote
          bodyCell("{{" + p + "direct_buy_quote}}", COL_WIDTHS[5], { center: true })
        ]
      })
    );
  }
  return rows;
}

// Terms text
const terms = [
  "1. \u672c\u4eba\u627f\u8afe\u4ee5\u4e0a\u5546\u54c1\u662f\u539f\u5ee0\u6b63\u7248\u771f\u54c1\uff0c\u4e26\u975e\u4eff\u88fd\u54c1\u3001\u5192\u7248\u6216\u4fb5\u6b0a\u7522\u54c1\uff0c\u4e26\u540c\u610f\u5982\u4e0a\u8ff0\u5546\u54c1\u4e0d\u901a\u904e\u9451\u5b9a\uff0c\u672c\u4eba\u9700\u56e0\u865b\u5047\u9673\u8ff0\u7e73\u4ed8 HKD600 \u9451\u5b9a\u8cbb\u7528\uff0c\u6216\u8ce0\u511f\u56e0\u800c\u5c0e\u81f4\u7684\u640d\u5931\u3002",
  "2. \u5546\u54c1\u6700\u77ed\u5bc4\u8ce3\u671f\u70ba 40 \u5929\uff0c\u5bc4\u8ce3\u671f\u7d50\u675f\u524d\u8981\u6c42\u53d6\u56de\u5c07\u6536\u53d6\u8ca8\u50f9 5% \u7684\u884c\u653f\u8cbb\u3002\u9996 40 \u5929\u5f8c\u5982\u6b32\u53d6\u56de\u5546\u54c1\uff0c\u4e0d\u9700\u6536\u53d6\u4efb\u4f55\u8cbb\u7528\u3002",
  "3. \u672c\u4eba\u5e0c\u671b\u6536\u56de\u4e0d\u5c11\u65bc\u4e0a\u8ff0\u300c\u5831\u50f9\u300d\uff0c\u4e26\u660e\u767d LUME LUXE \u6703\u53e6\u52a0\u4e0a\u670d\u52d9\u8cbb\u4f5c\u552e\u50f9\uff0c\u4ea6\u6703\u65bc\u5546\u54c1\u552e\u51fa\u5f8c 7 \u500b\u5de5\u4f5c\u5929\u5167\u4ee5\u652f\u7968/\u96fb\u5b50\u8f49\u5e33\u65b9\u5f0f\u652f\u4ed8\u672c\u4eba\u5546\u54c1\u8cbb\u7528\u3002",
  "4. \u5bc4\u8ce3\u4eba\u53d6\u56de\u5bc4\u8ce3\u5546\u54c1\u6642\uff0c\u9700\u7576\u9762\u6aa2\u67e5\u5546\u54c1\u72c0\u614b\u548c\u6240\u5c6c\u914d\u4ef6\uff0c\u4e8b\u5f8c\u6295\u8a34\u6055\u4e0d\u53d7\u7406\u3002"
];

async function generate() {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            orientation: PageOrientation.PORTRAIT,
            width: PAGE_WIDTH_TWIPS,
            height: PAGE_HEIGHT_TWIPS
          },
          margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN }
        }
      },
      children: [
        // Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: "Consignment Receipt", bold: true, size: TITLE_SIZE, font: FONT })]
        }),

        // Main product table
        new Table({
          layout: TableLayoutType.FIXED,
          width: { size: TOTAL_TABLE_WIDTH, type: WidthType.DXA },
          columnWidths: COL_WIDTHS,
          rows: [
            // Header row
            new TableRow({
              tableHeader: true,
              children: [
                headerCell("#", COL_WIDTHS[0]),
                headerCell("\u578b\u865f/\u5c3a\u5bf8/\u984f\u8272/\u76ae\u8cea/\u91d1\u5c6c/\u523b\u5370\nModel / Stamp", COL_WIDTHS[1]),
                headerCell("\u914d\u4ef6/\u6536\u64da\nAccessories / Receipt", COL_WIDTHS[2]),
                headerCell("\u5546\u54c1\u72c0\u6cc1\nCondition / Other", COL_WIDTHS[3]),
                headerCell("\u5bc4\u8ce3\u50f9\nConsign", COL_WIDTHS[4]),
                headerCell("\u76f4\u6536\u50f9\nDirect", COL_WIDTHS[5])
              ]
            }),
            // Product rows 1-20
            ...productRows()
          ]
        }),

        // Spacer
        new Paragraph({ spacing: { before: 100, after: 40 }, children: [] }),

        // Terms
        ...terms.map(t => new Paragraph({
          spacing: { before: 10, after: 10 },
          children: [new TextRun({ text: t, size: TERMS_SIZE, font: FONT })]
        })),

        // Spacer
        new Paragraph({ spacing: { before: 80, after: 20 }, children: [] }),

        // Footer: Name, Phone, Date, Signature
        new Table({
          layout: TableLayoutType.FIXED,
          width: { size: TOTAL_TABLE_WIDTH, type: WidthType.DXA },
          columnWidths: [Math.round(TOTAL_TABLE_WIDTH * 0.30), Math.round(TOTAL_TABLE_WIDTH * 0.30), Math.round(TOTAL_TABLE_WIDTH * 0.20), Math.round(TOTAL_TABLE_WIDTH * 0.20)],
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE }
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [new Paragraph({
                    spacing: { before: 20, after: 20 },
                    children: [new TextRun({ text: "\u59d3\u540d\uff1a{{client_name}}", size: FOOTER_SIZE, font: FONT })]
                  })]
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [new Paragraph({
                    spacing: { before: 20, after: 20 },
                    children: [new TextRun({ text: "\u96fb\u8a71\uff1a{{phone}}", size: FOOTER_SIZE, font: FONT })]
                  })]
                }),
                new TableCell({
                  width: { size: 20, type: WidthType.PERCENTAGE },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [new Paragraph({
                    spacing: { before: 20, after: 20 },
                    children: [new TextRun({ text: "\u65e5\u671f\uff1a{{receipt_date}}", size: FOOTER_SIZE, font: FONT })]
                  })]
                }),
                new TableCell({
                  width: { size: 20, type: WidthType.PERCENTAGE },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [new Paragraph({
                    spacing: { before: 20, after: 20 },
                    children: [new TextRun({ text: "\u7c3d\u540d Signature:", size: FOOTER_SIZE, font: FONT })]
                  })]
                })
              ]
            })
          ]
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = "C:/Users/User/Downloads/Consignment Receipt_template_20products.docx";
  fs.writeFileSync(outPath, buffer);
  console.log("Written to:", outPath);
}

generate().catch(console.error);
