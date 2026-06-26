"use client";

import React, { forwardRef } from "react";
import { FormData, ProductData } from "@/lib/types";
import { useLang } from "./LanguageProvider";

interface ConfirmationSectionProps {
  data: FormData;
  formId?: string;
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
  ({ data, formId }, ref) => {
    const { t } = useLang();
    const { email, products, customer } = data;

    const renderValue = (value: string | string[] | boolean) => {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join("、") : "—";
      }
      if (typeof value === "boolean") {
        return value ? t.yes : t.no;
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
            {t.confirmTitle}
          </h2>
          {formId && (
            <p className="text-sm font-mono font-medium text-[#1c1c1c]">
              {formId}
            </p>
          )}
          <p className="text-sm text-[#5f5f5d]">
            {t.confirmSubtitle}
          </p>
        </div>

        {/* Email */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1c1c1c]">{t.contactInfoTitle}</h3>
          <table className="w-full text-sm border border-[#eceae4]">
            <tbody>
              <tr className="border-b border-[#eceae4]">
                <th className="text-left bg-[#f7f5ef] px-3 py-2 w-1/3 font-medium text-[#1c1c1c]">
                  {t.emailLabel}
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
            {t.productsTitle} ({filledProducts.length})
          </h3>
          {filledProducts.length === 0 ? (
            <p className="text-sm text-[#5f5f5d] italic">{t.noProducts}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-[#eceae4] border-collapse">
                <thead>
                  <tr className="bg-[#f7f5ef]">
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c] w-10">
                      #
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      {t.colModel}
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      {t.colStamp}
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      {t.colAccessories}
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      {t.colReceipt}
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      {t.colCountry}
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      {t.colReceiptDate}
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      {t.colCondition}
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      {t.colConditionDetails}
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      {t.colOther}
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      {t.colConsignmentPrice}
                    </th>
                    <th className="text-left px-2 py-2 border border-[#eceae4] font-medium text-[#1c1c1c]">
                      {t.colDirectBuyPrice}
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
                        {p.receiptType === t.receiptOptions[3] &&
                        p.receiptNoneDetails.trim() !== ""
                          ? `${t.receiptOptions[3]} (${p.receiptNoneDetails})`
                          : renderValue(p.receiptType)}
                      </td>
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c]">
                        {renderValue(p.receiptCountry)}
                      </td>
                      <td className="px-2 py-2 border border-[#eceae4] text-[#1c1c1c]">
                        {renderValue(p.receiptDate)}
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
          <h3 className="text-lg font-semibold text-[#1c1c1c]">{t.customerInfoTitle}</h3>
          <table className="w-full text-sm border border-[#eceae4]">
            <tbody>
              <tr className="border-b border-[#eceae4]">
                <th className="text-left bg-[#f7f5ef] px-3 py-2 w-1/3 font-medium text-[#1c1c1c]">
                  {t.colName}
                </th>
                <td className="px-3 py-2 text-[#1c1c1c]">
                  {renderValue(customer.name)}
                </td>
              </tr>
              <tr className="border-b border-[#eceae4]">
                <th className="text-left bg-[#f7f5ef] px-3 py-2 font-medium text-[#1c1c1c]">
                  {t.colPhone}
                </th>
                <td className="px-3 py-2 text-[#1c1c1c]">
                  {renderValue(customer.phone)}
                </td>
              </tr>
              <tr className="border-b border-[#eceae4]">
                <th className="text-left bg-[#f7f5ef] px-3 py-2 font-medium text-[#1c1c1c]">
                  {t.colDate}
                </th>
                <td className="px-3 py-2 text-[#1c1c1c]">
                  {renderValue(customer.date)}
                </td>
              </tr>
              <tr className="border-b border-[#eceae4]">
                <th className="text-left bg-[#f7f5ef] px-3 py-2 font-medium text-[#1c1c1c]">
                  {t.colAgreement}
                </th>
                <td className="px-3 py-2 text-[#1c1c1c]">
                  {renderValue(customer.agreement)}
                </td>
              </tr>
              <tr>
                <th className="text-left bg-[#f7f5ef] px-3 py-2 font-medium text-[#1c1c1c] align-top">
                  {t.colSignature}
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
