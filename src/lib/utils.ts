// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const SEARCH_DEBOUNCE_MS = 500

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(fn: T, delay = SEARCH_DEBOUNCE_MS) {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debounced = ((...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      timer = null
      fn(...args)
    }, delay)
  }) as ((...args: Parameters<T>) => void) & { cancel: () => void }

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return debounced
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}