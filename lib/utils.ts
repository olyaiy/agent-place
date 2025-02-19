import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add slug generation function
export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single
    .replace(/^-+/, '')       // Trim - from start
    .replace(/-+$/, '')       // Trim - from end
    .substring(0, 40) +       // Limit length
    '-' + 
    Math.random().toString(36).substring(2, 6) // Add random string for uniqueness
}
