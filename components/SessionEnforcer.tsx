"use client";

import { useSingleSessionEnforcer } from "@/app/utils/hooks/useSingleSessionEnforcer";

export function SessionEnforcer() {
    useSingleSessionEnforcer();
    return null; // it doesn’t render anything visible
}
