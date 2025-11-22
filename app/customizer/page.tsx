"use client"

import { Suspense } from "react";
import { StyleCustomizer } from "@/components/customizer/style-customizer";
import { useSearchParams } from "next/navigation";

function CustomizerContent() {
  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme");
  
  return <StyleCustomizer initialTheme={themeParam as any} />;
}

export default function CustomizerPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[#2C2C2C] text-white">Loading...</div>}>
      <CustomizerContent />
    </Suspense>
  );
}

