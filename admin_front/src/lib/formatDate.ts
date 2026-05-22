import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.tz.setDefault("Asia/Seoul")
//
// dayjs().tz()

export function today(format: 'YYYY-MM-DD' | 'YYYYMMDDHHmmssSSSS' | 'YYYY-MM-DD HH:mm:ss' = 'YYYY-MM-DD') {
  return dayjs().format(format);
}

export function todayAsDate() {
  return dayjs().toDate();
}

export function add(date: Date | string, days: number, unit: 'minute' | 'day') {
  return dayjs(date).add(days, unit);
}

export function addDaysAsDate(date: Date | string, days: number): Date {
  return dayjs(date).add(days, 'day').toDate();
}

export function startOfDay(date: Date | string, format: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss' = 'YYYY-MM-DD') {
  return dayjs(date).startOf('day').format(format);
}

export function endOfDay(date: Date | string, format: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss' = 'YYYY-MM-DD') {
  return dayjs(date).endOf('day').format(format);
}

export function formatDay(date: Date | string | undefined, format: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss' = 'YYYY-MM-DD') {
  if (!date) return '-';
  return dayjs(date).format(format);
}

export function startOfMonth(date: Date | string, format: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss' = 'YYYY-MM-DD') {
  return dayjs(date).startOf('month').format(format);
}

export function endOfMonth(date: Date | string, format: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss' = 'YYYY-MM-DD') {
  return dayjs(date).endOf('month').format(format);
}

export function daysInMonth(date: Date | string) {
  return dayjs(date).daysInMonth();
}


// Timestamp in milliseconds
export function getTimestamp(): number {
  return dayjs().valueOf();
}

export function formatTDate (date: Date | string) {
  return dayjs.utc(date).tz('Asia/Seoul').format('YYYY-MM-DD');
}

export function formatTDateTime (date: Date | string) {
  return dayjs.utc(date).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
}

// Format datetime truncated to the hour
export function formatDateHour(dateTime: Date | string): string {
  return dayjs(dateTime).minute(0).second(0).millisecond(0).format('YYYY-MM-DD HH:mm:ss');
}
