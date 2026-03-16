import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkHasPreviousResults() {
  const saved = sessionStorage.getItem('analysisResults')
  try {
    const parsedResults = JSON.parse(saved)
    return parsedResults && typeof parsedResults === 'object'
  } catch (error) {
    return false
  }
}
