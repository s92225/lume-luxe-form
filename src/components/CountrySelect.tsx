"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { COUNTRIES, getCountries } from "@/lib/countries";
import { useLang } from "./LanguageProvider";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CountrySelect({
  value,
  onChange,
}: CountrySelectProps) {
  const { t, lang } = useLang();
  const placeholder = t.countryPlaceholder;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const countryList = getCountries(lang);
  const q = query.trim().toLowerCase();
  const filtered = q
    ? countryList.filter((_, i) => {
        const entry = COUNTRIES[i];
        return (
          entry.zh.toLowerCase().includes(q) ||
          entry.en.toLowerCase().includes(q)
        );
      })
    : countryList;

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={open ? query : value}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setOpen(true);
          setQuery(e.target.value);
        }}
        placeholder={placeholder}
        className="bg-white"
      />
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-[#eceae4] bg-white shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[#5f5f5d]">{lang === "zh" ? "無結果" : "No results"}</div>
          ) : (
            filtered.map((country) => (
              <button
                key={country}
                type="button"
                className={`flex w-full items-center px-3 py-2 text-left text-sm hover:bg-[#f7f5ef] ${
                  country === value ? "bg-[#eceae4] font-medium" : ""
                }`}
                onClick={() => {
                  onChange(country);
                  setOpen(false);
                  setQuery("");
                }}
              >
                {country}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
