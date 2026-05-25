"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductSection from "./ProductSection";
import CustomerSection from "./CustomerSection";
import {
  FormData,
  ProductData,
  CustomerData,
  MAX_PRODUCTS,
} from "@/lib/types";

const emptyProduct = (): ProductData => ({
  modelDetails: "",
  stamp: "",
  accessories: [],
  receiptType: "",
  condition: "",
  conditionDetails: [],
  otherNotes: "",
  consignmentPrice: "",
  directBuyPrice: "",
});

const emptyCustomer = (): CustomerData => ({
  name: "",
  phone: "",
  date: "",
  agreement: false,
  signatureDataUrl: "",
});

type Step = "email" | "products" | "customer";

export default function ConsignmentForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState<ProductData[]>([emptyProduct()]);
  const [customer, setCustomer] = useState<CustomerData>(emptyCustomer());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleProductChange = (index: number, data: ProductData) => {
    const updated = [...products];
    updated[index] = data;
    setProducts(updated);
  };

  const addProduct = () => {
    if (products.length < MAX_PRODUCTS) {
      setProducts([...products, emptyProduct()]);
    }
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const validateEmail = () => {
    setError("");
    return true;
  };

  const validateProducts = () => {
    setError("");
    return true;
  };

  const validateCustomer = () => {
    setError("");
    return true;
  };

  const goNext = () => {
    if (step === "email") {
      if (validateEmail()) setStep("products");
    } else if (step === "products") {
      if (validateProducts()) setStep("customer");
    }
  };

  const goBack = () => {
    if (step === "products") setStep("email");
    else if (step === "customer") setStep("products");
  };

  const handleSubmit = async () => {
    if (!validateCustomer()) return;

    setSubmitting(true);
    setError("");

    const formData: FormData = { email, products, customer };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "提交失敗，請稍後再試");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失敗，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4 py-12">
        <div className="text-4xl">✓</div>
        <h2 className="text-2xl font-semibold text-[#1c1c1c]">提交成功！</h2>
        <p className="text-[#5f5f5d]">感謝您的提交，我們會盡快與您聯繫。</p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setStep("email");
            setEmail("");
            setProducts([emptyProduct()]);
            setCustomer(emptyCustomer());
          }}
          className="mt-4"
        >
          提交新表格
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 text-sm text-[#5f5f5d]">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            step === "email"
              ? "bg-[#1c1c1c] text-[#fcfbf8]"
              : "bg-[#eceae4] text-[#1c1c1c]"
          }`}
        >
          1. 電郵
        </span>
        <span className="text-[#eceae4]">→</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            step === "products"
              ? "bg-[#1c1c1c] text-[#fcfbf8]"
              : "bg-[#eceae4] text-[#1c1c1c]"
          }`}
        >
          2. 商品
        </span>
        <span className="text-[#eceae4]">→</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            step === "customer"
              ? "bg-[#1c1c1c] text-[#fcfbf8]"
              : "bg-[#eceae4] text-[#1c1c1c]"
          }`}
        >
          3. 客戶資料
        </span>
      </div>

      {/* Step content */}
      {step === "email" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              電郵
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-white"
            />
          </div>
        </div>
      )}

      {step === "products" && (
        <div className="space-y-8">
          {products.map((product, i) => (
            <div
              key={i}
              className="border border-[#eceae4] rounded-xl p-6 bg-white/50"
            >
              <ProductSection
                index={i}
                data={product}
                onChange={handleProductChange}
                onRemove={removeProduct}
                canRemove={i > 0}
              />
            </div>
          ))}

          {products.length < MAX_PRODUCTS && (
            <Button
              type="button"
              variant="outline"
              onClick={addProduct}
              className="w-full border-dashed border-2"
            >
              + 新增商品 ({products.length}/{MAX_PRODUCTS})
            </Button>
          )}
        </div>
      )}

      {step === "customer" && (
        <div className="border border-[#eceae4] rounded-xl p-6 bg-white/50">
          <CustomerSection data={customer} onChange={setCustomer} />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        {step !== "email" ? (
          <Button type="button" variant="outline" onClick={goBack}>
            返回
          </Button>
        ) : (
          <div />
        )}

        {step !== "customer" ? (
          <Button type="button" onClick={goNext}>
            下一個
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="min-w-[100px]"
          >
            {submitting ? "提交中..." : "提交"}
          </Button>
        )}
      </div>
    </div>
  );
}
