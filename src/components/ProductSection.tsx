"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  ProductData,
} from "@/lib/types";
import CountrySelect from "./CountrySelect";
import { useLang } from "./LanguageProvider";

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
  const { t } = useLang();
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
          {t.productTitle} #{index + 1}
        </h2>
        {canRemove && onRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            {t.removeBtn}
          </Button>
        )}
      </div>

      {/* 型號／尺寸／顏色／皮質／金屬／刻印 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t.modelDetailsLabel} #{index + 1}
        </Label>
        <Input
          value={data.modelDetails}
          onChange={(e) => updateField("modelDetails", e.target.value)}
          placeholder={t.inputPlaceholder}
          className="bg-white"
        />
      </div>

      {/* Stamp */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t.stampLabel} #{index + 1}</Label>
        <Input
          value={data.stamp}
          onChange={(e) => updateField("stamp", e.target.value)}
          placeholder={t.inputPlaceholder}
          className="bg-white"
        />
      </div>

      {/* 配件 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t.accessoriesLabel} #{index + 1}</Label>
        <div className="grid grid-cols-2 gap-2">
          {t.accessoriesOptions.map((opt) => (
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
          {t.receiptLabel} #{index + 1}
        </Label>
        <p className="text-xs text-[#5f5f5d]">{t.receiptHint}</p>
        <RadioGroup
          value={data.receiptType}
          onValueChange={(v) => updateField("receiptType", v)}
          className="flex flex-wrap gap-4"
        >
          {t.receiptOptions.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value={opt} />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </RadioGroup>
        {data.receiptType === t.receiptOptions[3] && (
          <Input
            value={data.receiptNoneDetails}
            onChange={(e) => updateField("receiptNoneDetails", e.target.value)}
            placeholder={t.receiptNonePlaceholder}
            className="bg-white"
          />
        )}
        {data.receiptType && data.receiptType !== t.receiptOptions[3] && (
          <div className="space-y-1">
            <p className="text-xs text-[#5f5f5d]">{t.countryLabel}</p>
            <CountrySelect
              value={data.receiptCountry}
              onChange={(v) => updateField("receiptCountry", v)}
            />
            <p className="text-xs text-[#5f5f5d] pt-2">{t.receiptDateLabel}</p>
            <Input
              type="date"
              value={data.receiptDate}
              onChange={(e) => updateField("receiptDate", e.target.value)}
              className="bg-white"
            />
          </div>
        )}
      </div>

      {/* 商品狀況 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          {t.conditionLabel} #{index + 1}
        </Label>
        <RadioGroup
          value={data.condition}
          onValueChange={(v) => updateField("condition", v)}
        >
          {t.conditionOptions.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value={opt} />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* 商品狀況-2 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t.conditionDetailsLabel} #{index + 1}</Label>
        <div className="grid grid-cols-2 gap-2">
          {t.conditionDetailsOptions.map((opt) => (
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
        <Label className="text-sm font-medium">{t.otherLabel} #{index + 1}</Label>
        <Input
          value={data.otherNotes}
          onChange={(e) => updateField("otherNotes", e.target.value)}
          placeholder={t.inputPlaceholder}
          className="bg-white"
        />
      </div>

      {/* 寄賣價錢 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t.consignmentPriceLabel} #{index + 1}</Label>
        <Input
          value={data.consignmentPrice}
          onChange={(e) => updateField("consignmentPrice", e.target.value)}
          placeholder={t.inputPlaceholder}
          className="bg-white"
        />
      </div>

      {/* 直收價錢 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t.directBuyPriceLabel} #{index + 1}</Label>
        <Input
          value={data.directBuyPrice}
          onChange={(e) => updateField("directBuyPrice", e.target.value)}
          placeholder={t.inputPlaceholder}
          className="bg-white"
        />
      </div>
    </div>
  );
}
