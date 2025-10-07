import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils.ts
export function hasEnvVars(...vars: string[]) {
  return vars.every((v) => Boolean(process.env[v]));
}
