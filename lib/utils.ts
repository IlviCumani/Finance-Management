import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const LOGO_DEV_PUBLIC_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_KEY

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLogoDevUrl(name: string) {
  return `https://img.logo.dev/name/${name}?token=${LOGO_DEV_PUBLIC_KEY}&format=webp&retina=true&fallback=404`
}
