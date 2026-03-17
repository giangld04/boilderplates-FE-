import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number, fmt = 'dd/MM/yyyy') {
  return format(new Date(date), fmt)
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function truncate(str: string, maxLength: number) {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
}
