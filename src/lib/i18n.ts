export type Lang = "zh" | "en";

export interface Translation {
  headerTitle: string;
  stepEmail: string;
  stepProducts: string;
  stepCustomer: string;
  stepConfirm: string;
  emailLabel: string;
  emailPlaceholder: string;
  productTitle: string;
  removeBtn: string;
  addProductBtn: string;
  modelDetailsLabel: string;
  stampLabel: string;
  accessoriesLabel: string;
  receiptLabel: string;
  receiptHint: string;
  receiptNonePlaceholder: string;
  countryLabel: string;
  countryPlaceholder: string;
  receiptDateLabel: string;
  conditionLabel: string;
  conditionDetailsLabel: string;
  otherLabel: string;
  consignmentPriceLabel: string;
  directBuyPriceLabel: string;
  inputPlaceholder: string;
  customerTitle: string;
  nameLabel: string;
  phoneLabel: string;
  phonePlaceholder: string;
  dateLabel: string;
  agreeLabel: string;
  signatureLabel: string;
  signatureHint: string;
  confirmTitle: string;
  confirmSubtitle: string;
  contactInfoTitle: string;
  productsTitle: string;
  noProducts: string;
  customerInfoTitle: string;
  colModel: string;
  colStamp: string;
  colAccessories: string;
  colReceipt: string;
  colCountry: string;
  colReceiptDate: string;
  colCondition: string;
  colConditionDetails: string;
  colOther: string;
  colConsignmentPrice: string;
  colDirectBuyPrice: string;
  colName: string;
  colPhone: string;
  colDate: string;
  colAgreement: string;
  colSignature: string;
  backBtn: string;
  nextBtn: string;
  submitBtn: string;
  submittingBtn: string;
  capturingText: string;
  screenshotTakenText: string;
  successTitle: string;
  successMsg: string;
  newFormBtn: string;
  errorAgree: string;
  errorEmail: string;
  errorScreenshot: string;
  yes: string;
  no: string;
  receiptOptions: string[];
  conditionOptions: string[];
  conditionDetailsOptions: string[];
  accessoriesOptions: string[];
  terms: string;
}

export const translations: Record<Lang, Translation> = {
  zh: {
    // Header
    headerTitle: "Consignment Agreement Form: LUME LUXE",
    // Progress steps
    stepEmail: "1. 電郵",
    stepProducts: "2. 商品",
    stepCustomer: "3. 客戶資料",
    stepConfirm: "4. 確認",
    // Email step
    emailLabel: "電郵",
    emailPlaceholder: "your@email.com",
    // Products step
    productTitle: "Product",
    removeBtn: "移除",
    addProductBtn: "+ 新增商品",
    modelDetailsLabel: "型號／尺寸／顏色／皮質／金屬／刻印",
    stampLabel: "Stamp",
    accessoriesLabel: "配件",
    receiptLabel: "其他",
    receiptHint: "收據(正本/官網/副本)",
    receiptNonePlaceholder: "請說明 (例如：遺失、未保留)",
    countryLabel: "購買國家",
    countryPlaceholder: "搜索國家...",
    receiptDateLabel: "收據日期",
    conditionLabel: "商品狀況",
    conditionDetailsLabel: "商品狀況-2",
    otherLabel: "其他:",
    consignmentPriceLabel: "寄賣價錢",
    directBuyPriceLabel: "直收價錢",
    inputPlaceholder: "您的答案",
    // Customer step
    customerTitle: "客戶資料",
    nameLabel: "姓名",
    phoneLabel: "電話",
    phonePlaceholder: "E.g. 61112222",
    dateLabel: "日期",
    agreeLabel: "I Agree",
    signatureLabel: "簽名",
    signatureHint: "請在下方框內簽名",
    // Confirmation
    confirmTitle: "確認資料",
    confirmSubtitle: "請檢查以下所有資料，如有需要可返回修改。確認無誤後請按「提交」。",
    contactInfoTitle: "聯絡資料",
    productsTitle: "商品",
    noProducts: "未輸入任何商品",
    customerInfoTitle: "客戶資料",
    // Confirmation table headers
    colModel: "型號／尺寸／顏色／皮質／金屬／刻印",
    colStamp: "Stamp",
    colAccessories: "配件",
    colReceipt: "收據",
    colCountry: "國家",
    colReceiptDate: "收據日期",
    colCondition: "狀況",
    colConditionDetails: "狀況-2",
    colOther: "其他",
    colConsignmentPrice: "寄賣價",
    colDirectBuyPrice: "直收價",
    colName: "姓名",
    colPhone: "電話",
    colDate: "日期",
    colAgreement: "同意條款",
    colSignature: "簽名",
    // Navigation
    backBtn: "返回",
    nextBtn: "下一個",
    submitBtn: "提交",
    submittingBtn: "提交中...",
    capturingText: "📷 正在自動截圖...",
    screenshotTakenText: "✓ 已自動下載截圖",
    // Success
    successTitle: "提交成功！",
    successMsg: "感謝您的提交，我們會盡快與您聯繫。",
    newFormBtn: "提交新表格",
    // Error
    errorAgree: "請勾選「I Agree」以同意條款",
    errorEmail: "請輸入有效的電郵地址",
    errorScreenshot: "截圖失敗，請稍後再試",
    // Boolean render
    yes: "是",
    no: "否",
    // Options
    receiptOptions: ["正本", "官網", "副本", "沒有"],
    conditionOptions: ["全新", "未使用品", "二手"],
    conditionDetailsOptions: ["磨損", "花痕", "壓痕", "污漬", "氧化", "軟化", "染色變色"],
    accessoriesOptions: ["盒", "塵袋", "一套鎖", "肩帶", "雨褸", "產品說明", "證書"],
    // Terms
    terms: `1.本人承諾以上商品是原廠正版真品，並仿製品、冒版或侵權產品，並同意如上述商品不通過鑑定，本人需因虛假陳述繳付 HKD600 鑑定費用，或賠償因而導致的損失。

2.商品最短寄賣期為30天，寄賣期結束前要求取回將收取貨價 5%的行政費。首30天後如欲取回商品，不需收取任何費用。

3.本人希望收回不少於上述「報價」，並明白LUME LUXE會另加上服務費作售價，亦會於商品售出後7 個工作天內以支票/電子轉帳方式支付本人商品費用。

4.寄賣人取回寄賣商品時，需當面檢查商品狀態和所屬配件，事後投訴恕不受理。`,
  },
  en: {
    // Header
    headerTitle: "Consignment Agreement Form: LUME LUXE",
    // Progress steps
    stepEmail: "1. Email",
    stepProducts: "2. Products",
    stepCustomer: "3. Customer Info",
    stepConfirm: "4. Confirm",
    // Email step
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    // Products step
    productTitle: "Product",
    removeBtn: "Remove",
    addProductBtn: "+ Add Product",
    modelDetailsLabel: "Model / Size / Color / Leather / Hardware / Stamp",
    stampLabel: "Stamp",
    accessoriesLabel: "Accessories",
    receiptLabel: "Receipt (Original / Official Website / Copy)",
    receiptHint: "Receipt (Original / Official Website / Copy)",
    receiptNonePlaceholder: "Please specify (e.g. Lost, Not kept)",
    countryLabel: "Country of Purchase",
    countryPlaceholder: "Search country...",
    receiptDateLabel: "Receipt Date",
    conditionLabel: "Condition",
    conditionDetailsLabel: "Condition Details",
    otherLabel: "Other Notes:",
    consignmentPriceLabel: "Consignment Price",
    directBuyPriceLabel: "Direct Buy Price",
    inputPlaceholder: "Your answer",
    // Customer step
    customerTitle: "Customer Information",
    nameLabel: "Name",
    phoneLabel: "Phone",
    phonePlaceholder: "E.g. 61112222",
    dateLabel: "Date",
    agreeLabel: "I Agree",
    signatureLabel: "Signature",
    signatureHint: "Please sign in the box below",
    // Confirmation
    confirmTitle: "Confirmation",
    confirmSubtitle: "Please review all information below. Go back to edit if needed. Click \"Submit\" when confirmed.",
    contactInfoTitle: "Contact Information",
    productsTitle: "Products",
    noProducts: "No products entered",
    customerInfoTitle: "Customer Information",
    // Confirmation table headers
    colModel: "Model / Size / Color / Leather / Hardware / Stamp",
    colStamp: "Stamp",
    colAccessories: "Accessories",
    colReceipt: "Receipt",
    colCountry: "Country",
    colReceiptDate: "Receipt Date",
    colCondition: "Condition",
    colConditionDetails: "Condition-2",
    colOther: "Other",
    colConsignmentPrice: "Consignment Price",
    colDirectBuyPrice: "Direct Buy Price",
    colName: "Name",
    colPhone: "Phone",
    colDate: "Date",
    colAgreement: "Agreed to Terms",
    colSignature: "Signature",
    // Navigation
    backBtn: "Back",
    nextBtn: "Next",
    submitBtn: "Submit",
    submittingBtn: "Submitting...",
    capturingText: "📷 Auto-capturing screenshot...",
    screenshotTakenText: "✓ Screenshot downloaded",
    // Success
    successTitle: "Submitted Successfully!",
    successMsg: "Thank you for your submission. We will contact you shortly.",
    newFormBtn: "Submit New Form",
    // Error
    errorAgree: 'Please check "I Agree" to accept the terms',
    errorEmail: "Please enter a valid email address",
    errorScreenshot: "Screenshot failed, please try again later",
    // Boolean render
    yes: "Yes",
    no: "No",
    // Options
    receiptOptions: ["Original", "Official Website", "Copy", "None"],
    conditionOptions: ["Brand New", "Unused", "Pre-owned"],
    conditionDetailsOptions: ["Wear", "Scratches", "Dents", "Stains", "Oxidation", "Softening", "Discoloration"],
    accessoriesOptions: ["Box", "Dust Bag", "Lock Set", "Strap", "Rain Cover", "Product Manual", "Certificate"],
    // Terms
    terms: `1. I confirm that the above items are genuine original products, not replicas, counterfeits or infringing products. I agree that if the items fail authentication, I shall pay a HKD600 authentication fee for false representation, or compensate for any resulting losses.

2. The minimum consignment period is 30 days. A 5% administrative fee of the item price will be charged if the item is retrieved before the end of the consignment period. After the first 30 days, the item may be retrieved without any charge.

3. I wish to receive no less than the above "quoted price" and understand that LUME LUXE will add a service fee to the selling price. Payment will be made by cheque/electronic transfer within 7 working days after the item is sold.

4. When retrieving consigned items, the consignor must inspect the item's condition and accessories on the spot. No complaints will be entertained afterwards.`,
  },
};
