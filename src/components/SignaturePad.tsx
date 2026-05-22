"use client";

import React, { useRef, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string) => void;
  value: string;
}

export default function SignaturePad({ onSignatureChange, value }: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas>(null);

  const handleEnd = useCallback(() => {
    if (sigRef.current) {
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
      onSignatureChange(dataUrl);
    }
  }, [onSignatureChange]);

  const handleClear = useCallback(() => {
    if (sigRef.current) {
      sigRef.current.clear();
      onSignatureChange("");
    }
  }, [onSignatureChange]);

  return (
    <div className="space-y-2">
      <div className="border border-[#eceae4] rounded-lg overflow-hidden bg-white">
        <SignatureCanvas
          ref={sigRef}
          penColor="#1c1c1c"
          canvasProps={{
            className: "w-full h-[200px]",
            style: { width: "100%", height: "200px" },
          }}
          onEnd={handleEnd}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
        >
          清除簽名
        </Button>
        {value && (
          <span className="text-sm text-[#5f5f5d]">✓ 已簽名</span>
        )}
      </div>
    </div>
  );
}
