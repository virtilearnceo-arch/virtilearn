"use client";

import dynamic from "next/dynamic";

export const VditorEditor = dynamic(() => import("./VditorEditorImpl"), {
    ssr: false, // ✅ disable SSR
});
