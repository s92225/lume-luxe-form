"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  ProductData,
  ACCESSORIES_OPTIONS,
  RECEIPT_OPTIONS,
  CONDITION_OPTIONS,
  CONDITION_DETAILS_OPTIONS,
  CONSIGNMENT_TYPE_OPTIONS,
} from "@/lib/types";

interface ProductSectionProps {
  index: number;
  data: ProductData;
  onChange: (index: number, data: ProductData) => void;
  onRemove?: (index: number) => void;
  canRemove: boolean;
}

export default function ProductSection({
  index,
  data,
  onChange,
  onRemove,
  canRemove,
}: ProductSectionProps) {
  const updateField = <K extends keyof ProductData>(
    field: K,
    value: ProductData[K]
  ) => {
    onChange(index, { ...data, [field]: value });
  };

  const toggleCheckbox = (
    field: "accessories" | "conditionDetails",
    value: string
  ) => {
    const current = data[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateField(field, updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
          Product #{index + 1}
        </h2>
        {canRemove && onRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            移除
          </Button>
        )}
      </div>

      {/* 型號／尺寸／顏色／皮質／金屬／刻印 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          型號／尺寸／顏色／皮質／金屬／刻印 #{index + 1}
        </Label>
        <Input
          value={data.modelDetails}
          onChange={(e) => updateField("modelDetails", e.target.value)}
          placeholder="您的答案"
          className="bg-white"
        />
      </div>

      {/* Stamp */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Stamp #{index + 1}</Label>
        <Input
          value={data.stamp}
          onChange={(e) => updateField("stamp", e.target.value)}
          placeholder="您的答案"
          className="bg-white"
        />
      </div>

      {/* 配件 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">配件 #{index + 1}</Label>
        <div className="grid grid-cols-2 gap-2">
          {ACCESSORIES_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={data.accessories.includes(opt)}
                onCheckedChange={() => toggleCheckbox("accessories", opt)}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 收據 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          其他 #{index + 1}
        </Label>
        <p className="text-xs text-[#5f5f5d]">收據(正本/官網/副本)</p>
        <RadioGroup
          value={data.receiptType}
          onValueChange={(v) => updateField("receiptType", v)}
          className="flex gap-4"
        >
          {RECEIPT_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value={opt} />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* 商品狀況 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          商品狀況 #{index + 1} <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={data.condition}
          onValueChange={(v) => updateField("condition", v)}
        >
          {CONDITION_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value={opt} />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* 商品狀況-2 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">商品狀況-2 #{index + 1}</Label>
        <div className="grid grid-cols-2 gap-2">
          {CONDITION_DETAILS_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={data.conditionDetails.includes(opt)}
                onCheckedChange={() => toggleCheckbox("conditionDetails", opt)}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 其他 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">其他: #{index + 1}</Label>
        <Input
          value={data.otherNotes}
          onChange={(e) => updateField("otherNotes", e.target.value)}
          placeholder="您的答案"
          className="bg-white"
        />
      </div>

      {/* 寄賣種類 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">寄賣種類 #{index + 1}</Label>
        <RadioGroup
          value={data.consignmentType}
          onValueChange={(v) => updateField("consignmentType", v)}
        >
          {CONSIGNMENT_TYPE_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value={opt} />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* 報價 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">報價 #{index + 1}</Label>
        <Input
          value={data.price}
          onChange={(e) => updateField("price", e.target.value)}
          placeholder="您的答案"
          className="bg-white"
        />
      </div>
    </div>
  );
}
