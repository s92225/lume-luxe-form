"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerData, TERMS_AND_CONDITIONS } from "@/lib/types";
import SignaturePad from "./SignaturePad";

interface CustomerSectionProps {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
}

export default function CustomerSection({ data, onChange }: CustomerSectionProps) {
  const updateField = <K extends keyof CustomerData>(
    field: K,
    value: CustomerData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
        客戶資料
      </h2>

      {/* 姓名 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          姓名 <span className="text-red-500">*</span>
        </Label>
        <Input
          value={data.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="您的答案"
          className="bg-white"
          required
        />
      </div>

      {/* 電話 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          電話 <span className="text-red-500">*</span>
        </Label>
        <Input
          value={data.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="E.g. 61112222"
          className="bg-white"
          required
        />
      </div>

      {/* 日期 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          日期 <span className="text-red-500">*</span>
        </Label>
        <Input
          type="date"
          value={data.date}
          onChange={(e) => updateField("date", e.target.value)}
          className="bg-white"
          required
        />
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-3">
        <div className="bg-white border border-[#eceae4] rounded-lg p-4">
          <p className="text-sm text-[#1c1c1c] whitespace-pre-line leading-relaxed">
            {TERMS_AND_CONDITIONS}
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={data.agreement}
            onCheckedChange={(checked) =>
              updateField("agreement", checked === true)
            }
          />
          <span className="text-sm font-medium">I Agree</span>
        </label>
      </div>

      {/* Signature */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          簽名 <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-[#5f5f5d]">請在下方框內簽名</p>
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
