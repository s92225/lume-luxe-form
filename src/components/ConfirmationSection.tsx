"use client";

import React, { forwardRef } from "react";
import { FormData, ProductData } from "@/lib/types";

interface ConfirmationSectionProps {
  data: FormData;
}

const isProductEmpty = (p: ProductData): boolean => {
  return (
    p.modelDetails.trim() === "" &&
    p.stamp.trim() === "" &&
    p.accessories.length === 0 &&
    p.receiptType.trim() === "" &&
    p.condition.trim() === "" &&
    p.conditionDetails.length === 0 &&
    p.otherNotes.trim() === "" &&
    p.consignmentPrice.trim() === "" &&
    p.directBuyPrice.trim() === ""
  );
};

const ConfirmationSection = forwardRef<HTMLDivElement, ConfirmationSectionProps>(
  ({ data }, ref) => {
    const { email, products, customer } = data;

    const renderValue = (value: string | string[] | boolean) => {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join("、") : "—";
      }
      if (typeof value === "boolean") {
        return value ? "是" : "否";
      }
      return value && value.trim() !== "" ? value : "—";
    };

    const filledProducts = products
      .map((p, originalIndex) => ({ p, originalIndex }))
      .filter(({ p }) => !isProductEmpty(p));

    return (
      <div
        ref={ref}
        className="space-y-8 bg-white p-6 rounded-xl border border-[#eceae4]"
      >
        <div className="space-y-1 border-b border-[#eceae4] pb-4">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1c1c1c]">
            確認資料
          </h2>
          <p className="text-sm text-[#5f5f5d]">
            請檢查以下所有資料，如有需要可返回修改。確認無誤後請按「提交」。
          </p>
        </div>

        {/* Email */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1c1c1c]">聯絡資料</h3>
          <table className="w-full text-sm border border-[#eceae4]">
            <tbody>
              <tr className="border-b border-[#eceae4]">
                <th className="text-left bg-[#f7f5ef] px-3 py-2 w-1/3 font-medium text-[#1c1c1c]">
                  電郵
                </th>
                <td className="px-3 py-2 text-[#1c1c1c] break-all">
                  {renderValue(email)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Products */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1c1c1c]">
            商品 ({filledProducts.length})
          </h3>
          {filledProducts.length === 0 ? (
            <p className="text-sm text-[#5f5f5d] italic">未輸入任何商品</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-[#eceae4] border-collapse">
                <thead>
                  <tr className="bg-[#f7f5ef]">
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c] w-10">
                      #
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      型號／尺寸／顏色／皮質／金屬／刻印
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      Stamp
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      配件
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      收據
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      狀況
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      狀況-2
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      其他
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      寄賣價
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      直收價
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filledProducts.map(({ p, originalIndex }, displayIdx) => (
                    <tr key={originalIndex} className="align-top">
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c] font-medium">
                        {displayIdx + 1}
                      </td>
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c]">
                        {renderValue(p.modelDetails)}
                      </td>
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c]">
                        {renderValue(p.stamp)}
                      </td>
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c]">
                        {renderValue(p.accessories)}
                      </td>
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c]">
                        {renderValue(p.receiptType)}
                      </td>
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c]">
                        {renderValue(p.condition)}
                      </td>
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c]">
                        {renderValue(p.conditionDetails)}
                      </td>
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c]">
                        {renderValue(p.otherNotes)}
                      </td>
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c]">
                        {renderValue(p.consignmentPrice)}
                      </td>
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c]">
                        {renderValue(p.directBuyPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Customer */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1c1c1c]">客戶資料</h3>
          <table className="w-full text-sm border border-[#eceae4]">
            <tbody>
              <tr className="border-b border-[#eceae4]">
                <th className="text-left bg-[#f7f5ef] px-3 py-2 w-1/3 font-medium text-[#1c1c1c]">
                  姓名
                </th>
                <td className="px-3 py-2 text-[#1c1c1c]">
                  {renderValue(customer.name)}
                </td>
              </tr>
              <tr className="border-b border-[#eceae4]">
                <th className="text-left bg-[#f7f5ef] px-3 py-2 font-medium text-[#1c1c1c]">
                  電話
                </th>
                <td className="px-3 py-2 text-[#1c1c1c]">
                  {renderValue(customer.phone)}
                </td>
              </tr>
              <tr className="border-b border-[#eceae4]">
                <th className="text-left bg-[#f7f5ef] px-3 py-2 font-medium text-[#1c1c1c]">
                  日期
                </th>
                <td className="px-3 py-2 text-[#1c1c1c]">
                  {renderValue(customer.date)}
                </td>
              </tr>
              <tr className="border-b border-[#eceae4]">
                <th className="text-left bg-[#f7f5ef] px-3 py-2 font-medium text-[#1c1c1c]">
                  同意條款
                </th>
                <td className="px-3 py-2 text-[#1c1c1c]">
                  {renderValue(customer.agreement)}
                </td>
              </tr>
              <tr>
                <th className="text-left bg-[#f7f5ef] px-3 py-2 font-medium text-[#1c1c1c] align-top">
                  簽名
                </th>
                <td className="px-3 py-2">
                  {customer.signatureDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={customer.signatureDataUrl}
                      alt="signature"
                      className="max-h-32 border border-[#eceae4] rounded bg-white"
                    />
                  ) : (
                    <span className="text-[#1c1c1c]">—</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    );
  }
);

ConfirmationSection.displayName = "ConfirmationSection";

export default ConfirmationSection;
