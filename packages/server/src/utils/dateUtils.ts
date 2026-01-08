import { format, startOfDay } from 'date-fns'

export function getToday(): Date {
  return startOfDay(new Date())
}

export function formatDateForAPI(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

