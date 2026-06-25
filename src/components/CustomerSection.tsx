"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerData } from "@/lib/types";
import SignaturePad from "./SignaturePad";
import { useLang } from "./LanguageProvider";

interface CustomerSectionProps {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
}

export default function CustomerSection({ data, onChange }: CustomerSectionProps) {
  const { t } = useLang();
  const updateField = <K extends keyof CustomerData>(
    field: K,
    value: CustomerData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
        {t.customerTitle}
      </h2>

      {/* 姓名 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t.nameLabel}
        </Label>
        <Input
          value={data.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder={t.inputPlaceholder}
          className="bg-white"
        />
      </div>

      {/* 電話 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t.phoneLabel}
        </Label>
        <Input
          value={data.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder={t.phonePlaceholder}
          className="bg-white"
        />
      </div>

      {/* 日期 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t.dateLabel}
        </Label>
        <Input
          type="date"
          value={data.date}
          onChange={(e) => updateField("date", e.target.value)}
          className="bg-white"
        />
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-3">
        <div className="bg-white border border-[#eceae4] rounded-lg p-4">
          <p className="text-sm text-[#1c1c1c] whitespace-pre-line leading-relaxed">
            {t.terms}
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={data.agreement}
            onCheckedChange={(checked) =>
              updateField("agreement", checked === true)
            }
          />
          <span className="text-sm font-medium">{t.agreeLabel}</span>
        </label>
      </div>

      {/* Signature */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t.signatureLabel}
        </Label>
        <p className="text-xs text-[#5f5f5d]">{t.signatureHint}</p>
        <SignaturePad
          value={data.signatureDataUrl}
          onSignatureChange={(dataUrl) =>
            updateField("signatureDataUrl", dataUrl)
          }
        />
      </div>
    </div>
  );
}
