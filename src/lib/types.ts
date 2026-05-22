export interface ProductData {
  modelDetails: string;
  stamp: string;
  accessories: string[];
  receiptType: string;
  condition: string;
  conditionDetails: string[];
  otherNotes: string;
  consignmentType: string;
  price: string;
}

export interface CustomerData {
  name: string;
  phone: string;
  date: string;
  agreement: boolean;
  signatureDataUrl: string;
}

export interface FormData {
  email: string;
  products: ProductData[];
  customer: CustomerData;
}

export const ACCESSORIES_OPTIONS = [
  "盒",
  "塵袋",
  "一套鎖",
  "肩帶",
  "雨褸",
  "產品說明",
  "證書",
];

export const RECEIPT_OPTIONS = ["正本", "官網", "副本"];

export const CONDITION_OPTIONS = ["全新", "未使用品", "二手"];

export const CONDITION_DETAILS_OPTIONS = [
  "磨損",
  "花痕",
  "壓痕",
  "污漬",
  "氧化",
  "軟化",
  "染色變色",
];

export const CONSIGNMENT_TYPE_OPTIONS = ["寄賣", "直收"];

export const TERMS_AND_CONDITIONS = `1.本人承諾以上商品是原廠正版真品，並仿製品、冒版或侵權產品，並同意如上述商品不通過鑑定，本人需因虛假陳述繳付 HKD600 鑑定費用，或賠償因而導致的損失。

2.商品最短寄賣期為30天，寄賣期結束前要求取回將收取貨價 5%的行政費。首30天後如欲取回商品，不需收取任何費用。

3.本人希望收回不少於上述「報價」，並明白LUME LUXE會另加上服務費作售價，亦會於商品售出後7 個工作天內以支票/電子轉帳方式支付本人商品費用。

4.寄賣人取回寄賣商品時，需當面檢查商品狀態和所屬配件，事後投訴恕不受理。`;

export const MAX_PRODUCTS = 4;
