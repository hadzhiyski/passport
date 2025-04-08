import { clsx, type ClassValue } from 'clsx';
import { differenceInMonths, differenceInYears } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHumanReadeableAge(dateString: string | null): string {
  if (!dateString) return 'Unknown age';

  const date = new Date(dateString);
  const now = new Date();
  const years = differenceInYears(now, date);
  const months = differenceInMonths(now, date) % 12;

  if (years > 0) {
    return `${years} year${years !== 1 ? 's' : ''}${months > 0 ? `, ${months} month${months !== 1 ? 's' : ''}` : ''}`;
  } else {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
}
