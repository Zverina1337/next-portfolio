import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hasLabel = (tl: GSAPTimeline | null, name: string): boolean =>
  !!tl && !!tl.labels && Object.prototype.hasOwnProperty.call(tl.labels, name);


export async function getGsap() {
  const mod = await import('gsap')
  return mod.gsap
}
