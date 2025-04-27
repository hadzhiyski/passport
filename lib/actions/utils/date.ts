import { format } from 'date-fns';

/**
 * Formats a Date object to a string in the format 'YYYY-MM-DD' for PostgreSQL.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
