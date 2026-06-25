"use client";

import { useEffect, useState } from "react";
import ConsignmentForm from "@/components/ConsignmentForm";
import { LanguageProvider, useLang } from "@/components/LanguageProvider";
import { MessageCircle, AtSign, MapPin, FileText, Languages } from "lucide-react";

function HomeContent() {
  const { t, lang, toggleLang } = useLang();
  const [formId, setFormId] = useState<string>("");

  useEffect(() => {
    fetch("/api/form-id")
      .then((res) => res.json())
      .then((data) => setFormId(data.formId))
      .catch(() => setFormId(""));
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center min-h-screen">
      <main className="w-full max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border border-[#eceae4] rounded-xl p-6 mb-6 bg-white/50">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1c1c1c]">
              {t.headerTitle}
            </h1>
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eceae4] bg-white text-sm font-medium text-[#1c1c1c] hover:bg-[#f7f5ef] transition-colors shrink-0"
            >
              <Languages className="w-4 h-4" />
              {lang === "zh" ? "EN" : "中文"}
            </button>
          </div>
          <div className="text-sm text-[#5f5f5d] space-y-2">
            <a href="https://wa.me/85293148873" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>93148873</span>
            </a>
            <a href="https://www.instagram.com/lumeluxehk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <AtSign className="w-4 h-4 text-[#E4405F]" />
              <span>LUMELUXEHK</span>
            </a>
            <a href="https://maps.app.goo.gl/XdRxVZnEiJuiKU2R7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <MapPin className="w-4 h-4 text-[#1c1c1c]" />
              <span>{lang === "zh" ? "尖沙咀北京道53-63號 國都大廈13樓1305 E1室" : "Room 1305 E1, 13/F, Kwok Tung Mansion, 53-63 Peking Road, Tsim Sha Tsui"}</span>
            </a>
            {formId && (
              <div className="flex items-center gap-2 pt-1">
                <FileText className="w-4 h-4 text-[#1c1c1c]" />
                <span className="font-mono font-medium text-[#1c1c1c]">{formId}</span>
              </div>
            )}
          </div>
          
        </div>

        {/* Form */}
        <ConsignmentForm />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}
