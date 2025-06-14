import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseNumber = (
  value: string,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
) => {
  const newValue = parseFloat(value);

  if (isNaN(newValue)) {
    return min;
  }

  if (newValue < min) {
    return min;
  }

  if (newValue > max) {
    return max;
  }

  return newValue;
};

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
