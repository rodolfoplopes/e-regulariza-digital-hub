
/**
 * Converts a number of days to a future date from today or a specified start date
 * 
 * @param days Number of days for the deadline
 * @param startDate Optional start date (defaults to today)
 * @returns A Date object representing the future deadline date
 */
export function daysToDeadlineDate(days: number, startDate: Date = new Date()): Date {
  const result = new Date(startDate);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Formats a date as a string in Brazilian format (DD/MM/YYYY)
 * 
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Calculates and formats a deadline date string based on days
 * 
 * @param days Number of days for the deadline
 * @param startDate Optional start date (defaults to today)
 * @returns Formatted deadline date string (DD/MM/YYYY)
 */
export function getFormattedDeadline(days: number, startDate?: Date): string {
  const deadlineDate = daysToDeadlineDate(days, startDate);
  return formatDate(deadlineDate);
}

/**
 * Calculates the number of days between two dates
 * 
 * @param startDate The starting date
 * @param endDate The ending date (defaults to today)
 * @returns Number of days between the dates
 */
export function daysBetweenDates(startDate: Date, endDate: Date = new Date()): number {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));
  return diffDays;
}

/**
 * Returns the remaining days until a deadline
 * 
 * @param deadlineDate The deadline date
 * @returns Number of days remaining (negative if overdue)
 */
export function getRemainingDays(deadlineDate: Date): number {
  const today = new Date();
  const timeDiff = deadlineDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Formats the deadline information for display
 * 
 * @param daysEstimated Number of days estimated for completion
 * @param startDate Starting date of the process or stage
 * @returns An object with formatted deadline information
 */
export function getDeadlineInfo(daysEstimated: number, startDate: Date = new Date()) {
  const deadlineDate = daysToDeadlineDate(daysEstimated, startDate);
  const remainingDays = getRemainingDays(deadlineDate);
  const formattedDeadline = formatDate(deadlineDate);
  
  let status: 'on-time' | 'approaching' | 'late' = 'on-time';
  
  if (remainingDays < 0) {
    status = 'late';
  } else if (remainingDays <= Math.ceil(daysEstimated * 0.2)) {
    status = 'approaching';
  }
  
  return {
    deadlineDate,
    formattedDeadline,
    remainingDays,
    status
  };
}
