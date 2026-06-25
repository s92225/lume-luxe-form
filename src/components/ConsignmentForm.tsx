"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductSection from "./ProductSection";
import CustomerSection from "./CustomerSection";
import ConfirmationSection from "./ConfirmationSection";
import { useLang } from "./LanguageProvider";
import {
  FormData,
  ProductData,
  CustomerData,
  MAX_PRODUCTS,
} from "@/lib/types";
import { toPng } from "html-to-image";

const emptyProduct = (): ProductData => ({
  modelDetails: "",
  stamp: "",
  accessories: [],
  receiptType: "",
  receiptNoneDetails: "",
  receiptCountry: "",
  receiptDate: "",
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

type Step = "email" | "products" | "customer" | "confirm";

export default function ConsignmentForm() {
  const { t } = useLang();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState<ProductData[]>([emptyProduct()]);
  const [customer, setCustomer] = useState<CustomerData>(emptyCustomer());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const confirmRef = useRef<HTMLDivElement>(null);

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError(t.errorEmail);
      return false;
    }
    setError("");
    return true;
  };

  const validateProducts = () => {
    setError("");
    return true;
  };

  const validateCustomer = () => {
    if (!customer.agreement) {
      setError(t.errorAgree);
      return false;
    }
    setError("");
    return true;
  };

  const goNext = () => {
    if (step === "email") {
      if (validateEmail()) setStep("products");
    } else if (step === "products") {
      if (validateProducts()) setStep("customer");
    } else if (step === "customer") {
      if (validateCustomer()) setStep("confirm");
    }
  };

  const goBack = () => {
    if (step === "products") setStep("email");
    else if (step === "customer") setStep("products");
    else if (step === "confirm") {
      setStep("customer");
      setScreenshotTaken(false); // re-capture if data changes and user returns
    }
  };

  const captureScreenshot = async () => {
    if (!confirmRef.current) return;
    setCapturing(true);

    // Render an off-screen clone at a fixed desktop width so the screenshot
    // captures the entire confirmation content regardless of the viewport
    // (mobile or desktop) and is not clipped by overflow-x-auto containers.
    const CAPTURE_WIDTH = 1024;
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "0";
    wrapper.style.left = "-99999px";
    // Let the wrapper grow to fit any oversized children (e.g. wide tables)
    // so nothing is visually clipped before we measure/capture.
    wrapper.style.width = "max-content";
    wrapper.style.minWidth = `${CAPTURE_WIDTH}px`;
    wrapper.style.background = "#ffffff";
    wrapper.style.pointerEvents = "none";
    wrapper.style.zIndex = "-1";

    const clone = confirmRef.current.cloneNode(true) as HTMLElement;
    clone.style.width = "100%";
    clone.style.maxWidth = "none";

    // Remove horizontal-scroll constraints so wide tables render in full.
    clone.querySelectorAll<HTMLElement>(".overflow-x-auto").forEach((el) => {
      el.style.overflow = "visible";
      el.style.maxWidth = "none";
      el.style.width = "100%";
    });

    document.body.appendChild(wrapper);
    wrapper.appendChild(clone);

    try {
      // Allow layout to settle before measuring/capturing.
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(null)))
      );

      // Measure the rendered clone and pad slightly to avoid edge clipping
      // from sub-pixel rounding.
      const width = Math.max(
        clone.scrollWidth,
        clone.offsetWidth,
        wrapper.scrollWidth,
        CAPTURE_WIDTH
      );
      const height = Math.max(clone.scrollHeight, clone.offsetHeight);

      const dataUrl = await toPng(clone, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
        },
      });
      const link = document.createElement("a");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.download = `lumeluxe-confirmation-${stamp}.png`;
      link.href = dataUrl;
      link.click();
      setScreenshotTaken(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorScreenshot);
    } finally {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
      setCapturing(false);
    }
  };

  // Auto-screenshot once the user lands on the confirmation step
  useEffect(() => {
    if (step === "confirm" && !screenshotTaken && !capturing) {
      // Delay to ensure layout, fonts, and signature image are fully painted
      const timer = setTimeout(() => {
        captureScreenshot();
      }, 600);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleSubmit = async () => {
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
        <h2 className="text-2xl font-semibold text-[#1c1c1c]">{t.successTitle}</h2>
        <p className="text-[#5f5f5d]">{t.successMsg}</p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setStep("email");
            setEmail("");
            setProducts([emptyProduct()]);
            setCustomer(emptyCustomer());
            setScreenshotTaken(false);
          }}
          className="mt-4"
        >
          {t.newFormBtn}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-[#5f5f5d]">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            step === "email"
              ? "bg-[#1c1c1c] text-[#fcfbf8]"
              : "bg-[#eceae4] text-[#1c1c1c]"
          }`}
        >
          {t.stepEmail}
        </span>
        <span className="text-[#eceae4]">→</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            step === "products"
              ? "bg-[#1c1c1c] text-[#fcfbf8]"
              : "bg-[#eceae4] text-[#1c1c1c]"
          }`}
        >
          {t.stepProducts}
        </span>
        <span className="text-[#eceae4]">→</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            step === "customer"
              ? "bg-[#1c1c1c] text-[#fcfbf8]"
              : "bg-[#eceae4] text-[#1c1c1c]"
          }`}
        >
          {t.stepCustomer}
        </span>
        <span className="text-[#eceae4]">→</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            step === "confirm"
              ? "bg-[#1c1c1c] text-[#fcfbf8]"
              : "bg-[#eceae4] text-[#1c1c1c]"
          }`}
        >
          {t.stepConfirm}
        </span>
      </div>

      {/* Step content */}
      {step === "email" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t.emailLabel}
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
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
              {t.addProductBtn} ({products.length}/{MAX_PRODUCTS})
            </Button>
          )}
        </div>
      )}

      {step === "customer" && (
        <div className="border border-[#eceae4] rounded-xl p-6 bg-white/50">
          <CustomerSection data={customer} onChange={setCustomer} />
        </div>
      )}

      {step === "confirm" && (
        <ConfirmationSection
          ref={confirmRef}
          data={{ email, products, customer }}
        />
      )}

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 justify-between pt-4">
        {step !== "email" ? (
          <Button type="button" variant="outline" onClick={goBack}>
            {t.backBtn}
          </Button>
        ) : (
          <div />
        )}

        {step === "confirm" ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#5f5f5d]">
              {capturing
                ? t.capturingText
                : screenshotTaken
                ? t.screenshotTakenText
                : ""}
            </span>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || capturing}
              className="min-w-[100px]"
            >
              {submitting ? t.submittingBtn : t.submitBtn}
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={goNext}>
            {t.nextBtn}
          </Button>
        )}
      </div>
    </div>
  );
}
